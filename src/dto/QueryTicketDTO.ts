export type QueryStatus = "pending" | "resolved";

export interface QueryTicket {
  queryId: number;
  userId: number | null;
  name: string;
  email: string;
  question: string;
  response: string | null;
  status: QueryStatus;
  createdAt: Date;
  resolvedAt: Date | null;
}

export interface CreateQueryInput {
  userId?: number;
  name: string;
  email: string;
  question: string;
}

export interface QueryFilters {
  status?: QueryStatus;
  search?: string;
  sortBy?: "created_at" | "status";
  sortOrder?: "asc" | "desc";
}
