import { ApiError } from "../core/errors/ApiError";
import { CreateEventInput, Event, EventSearchFilters } from "../dto/EventDTO";
import { IEventRepository } from "../dto/IRepositories";
import { WeakCache } from "../utils/cache";
import { curry, partial } from "../utils/functional";
import { IEventService } from "../dto/IServices";

const sanitizeText = (
  value: string | undefined,
  maxLength: number,
): string | undefined => {
  const trimmed = value?.trim();
  if (!trimmed) {
    return undefined;
  }
  return trimmed.slice(0, maxLength);
};

const clamp = curry((min: number, max: number, value: number): number => {
  return Math.max(min, Math.min(max, value));
});

const chooseAllowed = curry(
  (
    allowed: readonly string[],
    fallback: string,
    candidate: string | undefined,
  ): string => {
    if (!candidate) {
      return fallback;
    }

    return allowed.includes(candidate) ? candidate : fallback;
  },
);

// We define a reference scope object to act as the cache key.
const cacheScope = {};

export class EventService implements IEventService {
  private categoryCache = new WeakCache<
    typeof cacheScope,
    Array<{ category: string; count: number }>
  >();

  constructor(private readonly eventRepository: IEventRepository) {}

  private normalizeFilters(filters: EventSearchFilters): EventSearchFilters {
    const normalizeSearch = partial(sanitizeText, filters.search);
    const normalizeCategory = partial(sanitizeText, filters.category);

    const safeSortBy = chooseAllowed(["schedule", "created_at", "name"])(
      "schedule",
    )(filters.sortBy) as "schedule" | "created_at" | "name";

    const safeSortOrder = chooseAllowed(["asc", "desc"])("asc")(
      filters.sortOrder,
    ) as "asc" | "desc";

    const clampPage = clamp(1)(10000);
    const clampLimit = clamp(1)(100);

    return {
      search: normalizeSearch(80),
      category: normalizeCategory(40),
      upcomingOnly: Boolean(filters.upcomingOnly),
      sortBy: safeSortBy,
      sortOrder: safeSortOrder,
      page: clampPage(filters.page ?? 1),
      limit: clampLimit(filters.limit ?? 20),
    };
  }

  async listEvents(filters: EventSearchFilters): Promise<Event[]> {
    const safeFilters = this.normalizeFilters(filters);
    return this.eventRepository.findAll(safeFilters);
  }

  async getEventById(eventId: number): Promise<Event> {
    const event = await this.eventRepository.findById(eventId);
    if (!event) {
      throw new ApiError(404, "Event not found");
    }

    return event;
  }

  async createEvent(input: CreateEventInput): Promise<Event> {
    const result = await this.eventRepository.create(input);
    // Reset cache by renewing the scope object reference to allow old memory GC
    this.categoryCache = new WeakCache();
    return result;
  }

  async updateEvent(
    eventId: number,
    input: Partial<CreateEventInput> & { currentVersion?: number },
  ): Promise<Event> {
    const updated = await this.eventRepository.update(eventId, input);
    if (!updated) {
      throw new ApiError(404, "Event not found");
    }

    // Reset cache
    this.categoryCache = new WeakCache();
    return updated;
  }

  async deleteEvent(eventId: number): Promise<void> {
    const removed = await this.eventRepository.delete(eventId);
    if (!removed) {
      throw new ApiError(404, "Event not found");
    }
    // Reset cache
    this.categoryCache = new WeakCache();
  }

  async getCategorySummary(): Promise<
    Array<{ category: string; count: number }>
  > {
    // Memory Management Optimization: Use WeakMap cache attached to scope
    const cached = this.categoryCache.get(cacheScope);
    if (cached) {
      return cached;
    }

    const events = await this.eventRepository.findAll({
      page: 1,
      limit: 500,
      sortBy: "name",
      sortOrder: "asc",
    });

    const groupBy = (
      Object as typeof Object & {
        groupBy?: <T>(
          items: Iterable<T>,
          keyFn: (item: T, index: number) => PropertyKey,
        ) => Record<string, T[]>;
      }
    ).groupBy;

    // Use Prototype Extensions & Polyfills safe check
    if (!groupBy) {
      throw new ApiError(500, "Object.groupBy polyfill failed to initialize");
    }

    const grouped = groupBy(events, (event) => event.category);

    const result = Object.entries(grouped)
      .map(([category, groupedEvents]) => ({
        category,
        count: groupedEvents.length,
      }))
      .sort((a, b) => b.count - a.count);

    // Store in WeakCache
    this.categoryCache.set(cacheScope, result);

    return result;
  }
}
