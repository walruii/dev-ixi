"use server";
import { neon } from "@neondatabase/serverless";

export const getVersion = async (): Promise<string | null> => {
  try {
    const sql = await neon(process.env.DATABASE_URL as string);
    const response = await sql`SELECT version()`;
    return response[0].version;
  } catch (error) {
    console.error("Error fetching version:", error);
    return null;
  }
};
