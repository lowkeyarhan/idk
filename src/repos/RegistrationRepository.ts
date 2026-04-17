import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { dbPool } from "../config/database";
import { CreateRegistrationInput, Registration } from "../models/Registration";
import { IRegistrationRepository } from "./interfaces";

interface RegistrationRow extends RowDataPacket {
  registration_id: number;
  user_id: number;
  event_id: number;
  student_id_path: string | null;
  registered_at: Date;
}

const mapRegistrationRow = (row: RegistrationRow): Registration => ({
  registrationId: row.registration_id,
  userId: row.user_id,
  eventId: row.event_id,
  studentIdPath: row.student_id_path,
  registeredAt: new Date(row.registered_at),
});

export class RegistrationRepository implements IRegistrationRepository {
  async create(input: CreateRegistrationInput): Promise<Registration> {
    const [result] = await dbPool.execute<ResultSetHeader>(
      `
      INSERT INTO registrations (user_id, event_id, student_id_path)
      VALUES (?, ?, ?)
      `,
      [input.userId, input.eventId, input.studentIdPath ?? null],
    );

    const [rows] = await dbPool.execute<RegistrationRow[]>(
      `
      SELECT registration_id, user_id, event_id, student_id_path, registered_at
      FROM registrations
      WHERE registration_id = ?
      LIMIT 1
      `,
      [result.insertId],
    );

    if (rows.length === 0) {
      throw new Error("Failed to fetch newly created registration");
    }

    return mapRegistrationRow(rows[0]);
  }

  async exists(userId: number, eventId: number): Promise<boolean> {
    const [rows] = await dbPool.execute<RowDataPacket[]>(
      `
      SELECT 1
      FROM registrations
      WHERE user_id = ? AND event_id = ?
      LIMIT 1
      `,
      [userId, eventId],
    );

    return rows.length > 0;
  }

  async findByUserId(userId: number): Promise<Registration[]> {
    const [rows] = await dbPool.execute<RegistrationRow[]>(
      `
      SELECT registration_id, user_id, event_id, student_id_path, registered_at
      FROM registrations
      WHERE user_id = ?
      ORDER BY registered_at DESC
      `,
      [userId],
    );

    return rows.map(mapRegistrationRow);
  }

  async findByEventId(eventId: number): Promise<Registration[]> {
    const [rows] = await dbPool.execute<RegistrationRow[]>(
      `
      SELECT registration_id, user_id, event_id, student_id_path, registered_at
      FROM registrations
      WHERE event_id = ?
      ORDER BY registered_at DESC
      `,
      [eventId],
    );

    return rows.map(mapRegistrationRow);
  }
}
