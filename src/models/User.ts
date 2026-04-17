export const userRoles = ["participant", "admin", "volunteer", "faculty", "organizer"] as const;

export type UserRole = (typeof userRoles)[number];

export interface User {
  userId: number;
  name: string;
  email: string;
  phone: string;
  college: string;
  year: number;
  password: string;
  role: UserRole;
  createdAt: Date;
}

export interface CreateUserInput {
  name: string;
  email: string;
  phone: string;
  college: string;
  year: number;
  password: string;
  role?: UserRole;
}
