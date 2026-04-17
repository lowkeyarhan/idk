import { z } from "zod";
import { userRoles } from "../dto/UserDTO";

export const registerSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(120),
    email: z.email().trim().toLowerCase(),
    phone: z.string().trim().min(7).max(20),
    college: z.string().trim().min(2).max(200),
    year: z.coerce.number().int().min(1).max(8),
    password: z
      .string()
      .min(8)
      .max(100)
      .regex(/[A-Z]/, "Password must include one uppercase letter")
      .regex(/[a-z]/, "Password must include one lowercase letter")
      .regex(/\d/, "Password must include one number"),
    role: z.enum(userRoles).optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.email().trim().toLowerCase(),
    password: z.string().min(1),
  }),
});
