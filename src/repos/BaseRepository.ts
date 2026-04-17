import { SupabaseClient } from "@supabase/supabase-js";
import { dbPool } from "../config/database";
import { ApiError } from "../core/errors/ApiError";

export abstract class BaseRepository<T extends Record<string, any>> {
  protected readonly tableName: string;
  protected readonly primaryKey: string;
  protected readonly supabase: SupabaseClient;

  constructor(tableName: string, primaryKey: string = "id") {
    this.tableName = tableName;
    this.primaryKey = primaryKey;
    this.supabase = dbPool;
  }

  // Generic Create
  protected async insert(data: Partial<T>): Promise<T> {
    const { data: record, error } = await this.supabase
      .from(this.tableName)
      .insert([data])
      .select()
      .single();

    if (error)
      throw new ApiError(
        500,
        `Insert failed in ${this.tableName}: ${error.message}`,
      );
    return record as T;
  }

  // Generic Find By ID
  protected async findByIdRaw(id: number | string): Promise<T | null> {
    const { data: record, error } = await this.supabase
      .from(this.tableName)
      .select()
      .eq(this.primaryKey, id)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw new ApiError(
        500,
        `Find failed in ${this.tableName}: ${error.message}`,
      );
    }
    return record as T;
  }

  // Generic Delete
  protected async deleteById(id: number | string): Promise<boolean> {
    const { error, count } = await this.supabase
      .from(this.tableName)
      .delete({ count: "exact" })
      .eq(this.primaryKey, id);

    if (error)
      throw new ApiError(
        500,
        `Delete failed in ${this.tableName}: ${error.message}`,
      );
    return count ? count > 0 : false;
  }
}

export type BaseRecord = {
  created_at: string;
};
