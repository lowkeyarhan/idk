import { z } from "zod";

const queryBoolean = z
  .union([z.literal("true"), z.literal("false")])
  .optional()
  .transform((value) => value === "true");

const queryNumber = z
  .string()
  .optional()
  .transform((value) => {
    if (!value) {
      return undefined;
    }
    const parsed = Number.parseInt(value, 10);
    return Number.isNaN(parsed) ? undefined : parsed;
  });

export const createEventSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(200),
    category: z.string().trim().min(2).max(100),
    description: z.string().trim().min(10),
    rules: z.string().trim().min(5),
    schedule: z.iso.datetime(),
    venue: z.string().trim().min(2).max(255),
    prize: z.string().trim().max(255).optional(),
  }),
});

export const updateEventSchema = z.object({
  body: z
    .object({
      name: z.string().trim().min(2).max(200).optional(),
      category: z.string().trim().min(2).max(100).optional(),
      description: z.string().trim().min(10).optional(),
      rules: z.string().trim().min(5).optional(),
      schedule: z.iso.datetime().optional(),
      venue: z.string().trim().min(2).max(255).optional(),
      prize: z.string().trim().max(255).optional(),
    })
    .refine(
      (payload) => Object.keys(payload).length > 0,
      "At least one field is required",
    ),
});

export const listEventsSchema = z.object({
  query: z.object({
    search: z.string().trim().optional(),
    category: z.string().trim().optional(),
    upcomingOnly: queryBoolean,
    sortBy: z.enum(["schedule", "created_at", "name"]).optional(),
    sortOrder: z.enum(["asc", "desc"]).optional(),
    page: queryNumber,
    limit: queryNumber,
  }),
});
