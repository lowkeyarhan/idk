import {
  CreateQueryInput,
  QueryFilters,
  QueryTicket,
} from "../dto/QueryTicketDTO";
import { IQueryRepository } from "../dto/IRepositories";
import { BaseRepository } from "./BaseRepository";
import { ApiError } from "../core/errors/ApiError";

interface QueryRow {
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

const mapQueryRow = (row: QueryRow): QueryTicket => ({
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

export class QueryRepository
  extends BaseRepository<QueryRow>
  implements IQueryRepository
{
  constructor() {
    super("queries", "query_id");
  }

  async create(input: CreateQueryInput): Promise<QueryTicket> {
    const raw = await this.insert({
      user_id: input.userId ?? null,
      name: input.name,
      email: input.email,
      question: input.question,
    });

    return mapQueryRow(raw);
  }

  async findById(queryId: number): Promise<QueryTicket | null> {
    const raw = await super.findByIdRaw(queryId);
    return raw ? mapQueryRow(raw) : null;
  }

  async findAll(filters: QueryFilters): Promise<QueryTicket[]> {
    let query = this.supabase.from(this.tableName).select();

    if (filters.status) {
      query = query.eq("status", filters.status);
    }

    if (filters.search) {
      query = query.or(
        `name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,question.ilike.%${filters.search}%`,
      );
    }

    const sortCol = filters.sortBy ?? "created_at";
    query = query.order(sortCol, { ascending: filters.sortOrder === "asc" });

    const { data: rows, error } = await query;
    if (error) throw new ApiError(500, `Query search failed: ${error.message}`);

    return (rows as QueryRow[]).map(mapQueryRow);
  }

  async respond(
    queryId: number,
    response: string,
  ): Promise<QueryTicket | null> {
    const { data: record, error } = await this.supabase
      .from(this.tableName)
      .update({
        response,
        status: "resolved",
        resolved_at: new Date().toISOString(),
      })
      .eq(this.primaryKey, queryId)
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") return null; // PostgREST code for "No rows"
      throw new ApiError(
        500,
        `Failed to update query response: ${error.message}`,
      );
    }

    return mapQueryRow(record as QueryRow);
  }
}
