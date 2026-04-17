export interface Event {
  eventId: number;
  name: string;
  category: string;
  description: string;
  rules: string;
  schedule: Date;
  venue: string;
  prize: string | null;
  createdAt: Date;
}

export interface CreateEventInput {
  name: string;
  category: string;
  description: string;
  rules: string;
  schedule: string;
  venue: string;
  prize?: string;
}

export interface EventSearchFilters {
  search?: string;
  category?: string;
  upcomingOnly?: boolean;
  sortBy?: "schedule" | "created_at" | "name";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}
