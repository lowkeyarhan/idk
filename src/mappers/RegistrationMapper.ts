import { Registration } from "../dto/RegistrationDTO";

export interface RegistrationRow {
  registration_id: number;
  user_id: number;
  event_id: number;
  student_id_path: string | null;
  registered_at: string;
}

export const mapRegistrationRow = (row: RegistrationRow): Registration => ({
  registrationId: row.registration_id,
  userId: row.user_id,
  eventId: row.event_id,
  studentIdPath: row.student_id_path,
  registeredAt: new Date(row.registered_at),
});
