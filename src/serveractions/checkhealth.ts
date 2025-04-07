"use server";
import { neon } from "@neondatabase/serverless";

export const getVersion = async (): Promise<string | null> => {
  try {
    const sql = await neon(process.env.DATABASE_URL as string);
    const [stats] = await sql`SELECT version()`;
    if (!stats) return null;
    return stats.version;
  } catch (error) {
    console.error("Error fetching version:", error);
    return null;
  }
};
