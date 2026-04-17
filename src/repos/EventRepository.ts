import { CreateEventInput, Event, EventSearchFilters } from "../dto/EventDTO";
import { IEventRepository } from "../dto/IRepositories";
import { BaseRepository } from "./BaseRepository";
import { ApiError } from "../core/errors/ApiError";

interface EventRow {
  event_id: number;
  name: string;
  category: string;
  description: string;
  rules: string;
  schedule: string;
  venue: string;
  prize: string | null;
  version: number;
  created_at: string;
}

const mapEventRow = (row: EventRow): Event => ({
  eventId: row.event_id,
  name: row.name,
  category: row.category,
  description: row.description,
  rules: row.rules,
  schedule: new Date(row.schedule),
  venue: row.venue,
  prize: row.prize,
  version: row.version,
  createdAt: new Date(row.created_at),
});

export class EventRepository
  extends BaseRepository<EventRow>
  implements IEventRepository
{
  constructor() {
    super("events", "event_id");
  }

  async create(input: CreateEventInput): Promise<Event> {
    const raw = await this.insert({
      name: input.name,
      category: input.category,
      description: input.description,
      rules: input.rules,
      schedule: new Date(input.schedule).toISOString(),
      venue: input.venue,
      prize: input.prize ?? null,
      version: 1,
    });

    return mapEventRow(raw);
  }

  // OOP / Concurrency Control: Optimistic Locking
  async update(
    eventId: number,
    input: Partial<CreateEventInput> & { currentVersion?: number },
  ): Promise<Event | null> {
    const changes: Partial<EventRow> = {};
    if (input.name) changes.name = input.name;
    if (input.category) changes.category = input.category;
    if (input.description) changes.description = input.description;
    if (input.rules) changes.rules = input.rules;
    if (input.schedule)
      changes.schedule = new Date(input.schedule).toISOString();
    if (input.venue) changes.venue = input.venue;
    if (input.prize !== undefined) changes.prize = input.prize ?? null;

    if (Object.keys(changes).length === 0) return this.findById(eventId);

    // Explicit concurrency control: require matching current version if supplied
    let query = this.supabase
      .from(this.tableName)
      .update(changes)
      .eq(this.primaryKey, eventId);

    if (input.currentVersion !== undefined) {
      query = query.eq("version", input.currentVersion);
      changes.version = input.currentVersion + 1; // Increment on save
    }

    const { data: record, error } = await query.select().single();

    if (error) {
      if (error.code === "PGRST116") {
        // If not found when explicitly passing version, optimistic lock failed.
        if (input.currentVersion !== undefined) {
          throw new ApiError(
            409,
            "Concurrency mismatch: Event was updated by another user. Reload and try again.",
          );
        }
        return null;
      }
      throw new ApiError(500, `Failed to update event: ${error.message}`);
    }

    return mapEventRow(record as EventRow);
  }

  async delete(eventId: number): Promise<boolean> {
    return super.deleteById(eventId);
  }

  async findById(eventId: number): Promise<Event | null> {
    const raw = await super.findByIdRaw(eventId);
    return raw ? mapEventRow(raw) : null;
  }

  async findAll(filters: EventSearchFilters): Promise<Event[]> {
    let query = this.supabase.from(this.tableName).select();

    if (filters.search) {
      query = query.or(
        `name.ilike.%${filters.search}%,description.ilike.%${filters.search}%,category.ilike.%${filters.search}%`,
      );
    }

    if (filters.category) {
      query = query.eq("category", filters.category);
    }

    if (filters.upcomingOnly) {
      query = query.gte("schedule", new Date().toISOString());
    }

    const sortCol = filters.sortBy ?? "schedule";
    query = query.order(sortCol, { ascending: filters.sortOrder !== "desc" });

    const limit = Math.min(Math.max(filters.limit ?? 20, 1), 100);
    const page = Math.max(filters.page ?? 1, 1);
    const offset = (page - 1) * limit;

    query = query.range(offset, offset + limit - 1);

    const { data: rows, error } = await query;
    if (error) throw new ApiError(500, `Event search failed: ${error.message}`);

    return (rows as EventRow[]).map(mapEventRow);
  }
}
