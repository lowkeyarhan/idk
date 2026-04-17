import { CreateRegistrationInput, Registration } from "../dto/RegistrationDTO";
import { IRegistrationRepository } from "../dto/IRepositories";
import { BaseRepository } from "./BaseRepository";
import { ApiError } from "../core/errors/ApiError";
import {
  RegistrationRow,
  mapRegistrationRow,
} from "../mappers/RegistrationMapper";

export class RegistrationRepository
  extends BaseRepository<RegistrationRow>
  implements IRegistrationRepository
{
  constructor() {
    super("registrations", "registration_id");
  }

  async create(input: CreateRegistrationInput): Promise<Registration> {
    const { data: record, error } = await this.supabase
      .from(this.tableName)
      .insert([
        {
          user_id: input.userId,
          event_id: input.eventId,
          student_id_path: input.studentIdPath ?? null,
        },
      ])
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        // unique_violation
        throw new ApiError(409, "User is already registered for this event");
      }
      throw new ApiError(500, `Registration insert failed: ${error.message}`);
    }

    return mapRegistrationRow(record as RegistrationRow);
  }

  async exists(userId: number, eventId: number): Promise<boolean> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select("registration_id")
      .eq("user_id", userId)
      .eq("event_id", eventId)
      .limit(1);

    if (error)
      throw new ApiError(500, `Registration search failed: ${error.message}`);
    return data.length > 0;
  }

  async findByUserId(userId: number): Promise<Registration[]> {
    const { data: rows, error } = await this.supabase
      .from(this.tableName)
      .select()
      .eq("user_id", userId)
      .order("registered_at", { ascending: false });

    if (error)
      throw new ApiError(500, `Fetch by user failed: ${error.message}`);
    return (rows as RegistrationRow[]).map(mapRegistrationRow);
  }

  async findByEventId(eventId: number): Promise<Registration[]> {
    const { data: rows, error } = await this.supabase
      .from(this.tableName)
      .select()
      .eq("event_id", eventId)
      .order("registered_at", { ascending: false });

    if (error)
      throw new ApiError(500, `Fetch by event failed: ${error.message}`);
    return (rows as RegistrationRow[]).map(mapRegistrationRow);
  }
}
