import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { dbPool } from "../config/database";
import {
  CreateQueryInput,
  QueryFilters,
  QueryTicket,
} from "../models/QueryTicket";
import { IQueryRepository } from "./interfaces";

interface QueryRow extends RowDataPacket {
  query_id: number;
  user_id: number | null;
  name: string;
  email: string;
  question: string;
  response: string | null;
  status: "pending" | "resolved";
  created_at: Date;
  resolved_at: Date | null;
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

const ALLOWED_SORT_COLUMNS = {
  created_at: "created_at",
  status: "status",
} as const;

export class QueryRepository implements IQueryRepository {
  async create(input: CreateQueryInput): Promise<QueryTicket> {
    const [result] = await dbPool.execute<ResultSetHeader>(
      `
      INSERT INTO queries (user_id, name, email, question)
      VALUES (?, ?, ?, ?)
      `,
      [input.userId ?? null, input.name, input.email, input.question],
    );

    const created = await this.findById(result.insertId);
    if (!created) {
      throw new Error("Failed to fetch newly created query");
    }

    return created;
  }

  async findById(queryId: number): Promise<QueryTicket | null> {
    const [rows] = await dbPool.execute<QueryRow[]>(
      `
      SELECT query_id, user_id, name, email, question, response, status, created_at, resolved_at
      FROM queries
      WHERE query_id = ?
      LIMIT 1
      `,
      [queryId],
    );

    if (rows.length === 0) {
      return null;
    }

    return mapQueryRow(rows[0]);
  }

  async findAll(filters: QueryFilters): Promise<QueryTicket[]> {
    const whereClauses: string[] = [];
    const params: string[] = [];

    if (filters.status) {
      whereClauses.push("status = ?");
      params.push(filters.status);
    }

    if (filters.search) {
      whereClauses.push("(name LIKE ? OR email LIKE ? OR question LIKE ?)");
      const pattern = `%${filters.search}%`;
      params.push(pattern, pattern, pattern);
    }

    const whereSql =
      whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";
    const safeSortColumn = ALLOWED_SORT_COLUMNS[filters.sortBy ?? "created_at"];
    const safeSortOrder = filters.sortOrder === "asc" ? "ASC" : "DESC";

    const [rows] = await dbPool.execute<QueryRow[]>(
      `
      SELECT query_id, user_id, name, email, question, response, status, created_at, resolved_at
      FROM queries
      ${whereSql}
      ORDER BY ${safeSortColumn} ${safeSortOrder}
      `,
      params,
    );

    return rows.map(mapQueryRow);
  }

  async respond(
    queryId: number,
    response: string,
  ): Promise<QueryTicket | null> {
    await dbPool.execute(
      `
      UPDATE queries
      SET response = ?, status = 'resolved', resolved_at = NOW()
      WHERE query_id = ?
      `,
      [response, queryId],
    );

    return this.findById(queryId);
  }
}
