import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { dbPool } from "../config/database";
import { CreateEventInput, Event, EventSearchFilters } from "../models/Event";
import { IEventRepository } from "./interfaces";

interface EventRow extends RowDataPacket {
  event_id: number;
  name: string;
  category: string;
  description: string;
  rules: string;
  schedule: Date;
  venue: string;
  prize: string | null;
  created_at: Date;
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
  createdAt: new Date(row.created_at),
});

const ALLOWED_SORT_COLUMNS = {
  schedule: "schedule",
  created_at: "created_at",
  name: "name",
} as const;

const UPDATE_COLUMN_MAP: Record<keyof CreateEventInput, string> = {
  name: "name",
  category: "category",
  description: "description",
  rules: "rules",
  schedule: "schedule",
  venue: "venue",
  prize: "prize",
};

export class EventRepository implements IEventRepository {
  async create(input: CreateEventInput): Promise<Event> {
    const [result] = await dbPool.execute<ResultSetHeader>(
      `
      INSERT INTO events (name, category, description, rules, schedule, venue, prize)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        input.name,
        input.category,
        input.description,
        input.rules,
        input.schedule,
        input.venue,
        input.prize ?? null,
      ],
    );

    const created = await this.findById(result.insertId);
    if (!created) {
      throw new Error("Failed to fetch newly created event");
    }

    return created;
  }

  async update(
    eventId: number,
    input: Partial<CreateEventInput>,
  ): Promise<Event | null> {
    const entries = Object.entries(input) as Array<
      [keyof CreateEventInput, CreateEventInput[keyof CreateEventInput]]
    >;
    if (entries.length === 0) {
      return this.findById(eventId);
    }

    const assignments: string[] = [];
    const values: Array<string | number | null> = [];

    for (const [key, value] of entries) {
      if (value === undefined) {
        continue;
      }

      assignments.push(`${UPDATE_COLUMN_MAP[key]} = ?`);
      values.push(value ?? null);
    }

    if (assignments.length === 0) {
      return this.findById(eventId);
    }

    await dbPool.execute(
      `
      UPDATE events
      SET ${assignments.join(", ")}
      WHERE event_id = ?
      `,
      [...values, eventId],
    );

    return this.findById(eventId);
  }

  async delete(eventId: number): Promise<boolean> {
    const [result] = await dbPool.execute<ResultSetHeader>(
      `
      DELETE FROM events
      WHERE event_id = ?
      `,
      [eventId],
    );

    return result.affectedRows > 0;
  }

  async findById(eventId: number): Promise<Event | null> {
    const [rows] = await dbPool.execute<EventRow[]>(
      `
      SELECT event_id, name, category, description, rules, schedule, venue, prize, created_at
      FROM events
      WHERE event_id = ?
      LIMIT 1
      `,
      [eventId],
    );

    if (rows.length === 0) {
      return null;
    }

    return mapEventRow(rows[0]);
  }

  async findAll(filters: EventSearchFilters): Promise<Event[]> {
    const whereClauses: string[] = [];
    const params: Array<string | number> = [];

    if (filters.search) {
      whereClauses.push(
        "(name LIKE ? OR description LIKE ? OR category LIKE ?)",
      );
      const pattern = `%${filters.search}%`;
      params.push(pattern, pattern, pattern);
    }

    if (filters.category) {
      whereClauses.push("category = ?");
      params.push(filters.category);
    }

    if (filters.upcomingOnly) {
      whereClauses.push("schedule >= NOW()");
    }

    const whereSql =
      whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";

    const safeSortColumn = ALLOWED_SORT_COLUMNS[filters.sortBy ?? "schedule"];
    const safeSortOrder = filters.sortOrder === "desc" ? "DESC" : "ASC";

    const limit = Math.min(Math.max(filters.limit ?? 20, 1), 100);
    const page = Math.max(filters.page ?? 1, 1);
    const offset = (page - 1) * limit;

    const [rows] = await dbPool.execute<EventRow[]>(
      `
      SELECT event_id, name, category, description, rules, schedule, venue, prize, created_at
      FROM events
      ${whereSql}
      ORDER BY ${safeSortColumn} ${safeSortOrder}
      LIMIT ? OFFSET ?
      `,
      [...params, limit, offset],
    );

    return rows.map(mapEventRow);
  }
}
