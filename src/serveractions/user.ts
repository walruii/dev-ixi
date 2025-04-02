"use server";

import { neon } from "@neondatabase/serverless";

export const getAllUsers = async () => {
  const sql = await neon(process.env.DATABASE_URL as string);
  const response = await sql`SELECT * FROM "USER"`;
  console.log(response);
  return response;
};

export const makeUser = async () => {
  const sql = await neon(process.env.DATABASE_URL as string);
  const name = "inder";
  const email = "walruiix@gmail.com";
  const password = "password";
  const createdAt = new Date().toISOString();
  try {
    const response =
      await sql`INSERT INTO "USER" (name, email, password, created_at) VALUES (${name}, ${email}, ${password}, ${createdAt})`;
    console.log(response);
    return response;
  } catch (error) {
    console.error("Error inserting user:", error);
    return { status: 409, error: "Error inserting user" };
  }
};
