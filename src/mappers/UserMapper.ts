import { User } from "../dto/UserDTO";

export interface UserRecord {
  user_id: number;
  name: string;
  email: string;
  phone: string;
  college: string;
  year: number;
  password: string;
  role: User["role"];
  created_at: string;
}

export const mapUserRow = (row: UserRecord): User => ({
  userId: row.user_id,
  name: row.name,
  email: row.email,
  phone: row.phone,
  college: row.college,
  year: row.year,
  password: row.password,
  role: row.role,
  createdAt: new Date(row.created_at),
});
