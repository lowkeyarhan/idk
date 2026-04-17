import { z } from "zod";

export const createQuerySchema = z.object({
  body: z.object({
    userId: z.coerce.number().int().positive().optional(),
    name: z.string().trim().min(2).max(120),
    email: z.email().trim().toLowerCase(),
    question: z.string().trim().min(10).max(2000),
  }),
});

export const respondQuerySchema = z.object({
  body: z.object({
    response: z.string().trim().min(5).max(2000),
  }),
});

const queryStatus = z.enum(["pending", "resolved"]);

export const listQueriesSchema = z.object({
  query: z.object({
    status: queryStatus.optional(),
    search: z.string().trim().optional(),
    sortBy: z.enum(["created_at", "status"]).optional(),
    sortOrder: z.enum(["asc", "desc"]).optional(),
  }),
});
