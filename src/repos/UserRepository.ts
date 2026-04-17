import { CreateUserInput, User } from "../dto/UserDTO";
import { IUserRepository } from "../dto/IRepositories";
import { BaseRepository } from "./BaseRepository";

interface UserRecord {
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

const mapUserRow = (row: UserRecord): User => ({
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

export class UserRepository
  extends BaseRepository<UserRecord>
  implements IUserRepository
{
  constructor() {
    super("users", "user_id");
  }

  async create(input: CreateUserInput): Promise<User> {
    const raw = await this.insert({
      name: input.name,
      email: input.email,
      phone: input.phone,
      college: input.college,
      year: input.year,
      password: input.password,
      role: input.role ?? "participant",
    });

    return mapUserRow(raw);
  }

  async findById(userId: number): Promise<User | null> {
    const raw = await super.findByIdRaw(userId);
    return raw ? mapUserRow(raw) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const { data: record, error } = await this.supabase
      .from(this.tableName)
      .select()
      .eq("email", email)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null; // Not found
      throw new Error(`Find by email failed: ${error.message}`);
    }

    return mapUserRow(record as UserRecord);
  }
}
