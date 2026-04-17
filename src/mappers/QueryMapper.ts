import { QueryTicket } from "../dto/QueryTicketDTO";

export interface QueryRow {
  query_id: number;
  user_id: number | null;
  name: string;
  email: string;
  question: string;
  response: string | null;
  status: "pending" | "resolved";
  created_at: string;
  resolved_at: string | null;
}

export const mapQueryRow = (row: QueryRow): QueryTicket => ({
  queryId: row.query_id,
  userId: row.user_id,
  name: row.name,
  email: row.email,
  question: row.question,
  response: row.response,
  status: row.status,
  createdAt: new Date(row.created_at),
  resolvedAt: row.resolved_at ? new Date(row.resolved_at) : null,
});
