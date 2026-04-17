import { Event } from "../dto/EventDTO";

export interface EventRow {
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

export const mapEventRow = (row: EventRow): Event => ({
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
