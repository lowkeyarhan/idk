import mysql from "mysql2/promise";
import { env } from "./env";

export const dbPool = mysql.createPool({
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  connectionLimit: 10,
  waitForConnections: true,
  queueLimit: 0,
});

export const testDbConnection = async (): Promise<void> => {
  const connection = await dbPool.getConnection();
  try {
    await connection.ping();
  } finally {
    connection.release();
  }
};
