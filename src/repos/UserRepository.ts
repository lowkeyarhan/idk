import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { dbPool } from "../config/database";
import { CreateUserInput, User } from "../models/User";
import { IUserRepository } from "./interfaces";

interface UserRow extends RowDataPacket {
  user_id: number;
  name: string;
  email: string;
  phone: string;
  college: string;
  year: number;
  password: string;
  role: User["role"];
  created_at: Date;
}

const mapUserRow = (row: UserRow): User => ({
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

export class UserRepository implements IUserRepository {
  async create(input: CreateUserInput): Promise<User> {
    const [result] = await dbPool.execute<ResultSetHeader>(
      `
      INSERT INTO users (name, email, phone, college, year, password, role)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        input.name,
        input.email,
        input.phone,
        input.college,
        input.year,
        input.password,
        input.role ?? "participant",
      ],
    );

    const created = await this.findById(result.insertId);
    if (!created) {
      throw new Error("Failed to fetch newly created user");
    }

    return created;
  }

  async findById(userId: number): Promise<User | null> {
    const [rows] = await dbPool.execute<UserRow[]>(
      `
      SELECT user_id, name, email, phone, college, year, password, role, created_at
      FROM users
      WHERE user_id = ?
      LIMIT 1
      `,
      [userId],
    );

    if (rows.length === 0) {
      return null;
    }

    return mapUserRow(rows[0]);
  }

  async findByEmail(email: string): Promise<User | null> {
    const [rows] = await dbPool.execute<UserRow[]>(
      `
      SELECT user_id, name, email, phone, college, year, password, role, created_at
      FROM users
      WHERE email = ?
      LIMIT 1
      `,
      [email],
    );

    if (rows.length === 0) {
      return null;
    }

    return mapUserRow(rows[0]);
  }
}
