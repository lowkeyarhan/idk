import { z } from "zod";

export const createRegistrationSchema = z.object({
  body: z.object({
    eventId: z.coerce.number().int().positive()
  }),
});
