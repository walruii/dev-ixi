"use server";
import { signIn } from "@/auth";
import { TResponse } from "@/models/response";
import { TUser } from "@/models/user";
import { neon } from "@neondatabase/serverless";
import { compareSync, hashSync } from "bcryptjs";

export const serverSideLogin = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  try {
    const response = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    console.log(response);
  } catch (error) {
    console.error("Error during sign-in:", error);
    return error;
  }
};

export const getAllUsers = async (): Promise<TUser[] | null> => {
  try {
    const sql = await neon(process.env.DATABASE_URL as string);
    const response = await sql`SELECT * FROM "USER"`;
    if (response.length === 0) {
      console.log("No users found");
      return [];
    }
    const users: TUser[] = response.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      created_at: user.created_at,
    }));
    return users;
  } catch (error) {
    console.error(error);
    return null;
  }
};

type TUserData = {
  name: string;
  email: string;
  password: string;
};
export const createUser = async ({
  name,
  email,
  password,
}: TUserData): Promise<TResponse<string[]>> => {
  if (!name || !email || !password)
    return { status: 400, error: "Missing required fields" };
  try {
    const sql = await neon(process.env.DATABASE_URL as string);
    const passwordHashed = hashSync(password, 10);
    const createdAt = new Date().toISOString();
    await sql`INSERT INTO "USER" (name, email, password, created_at) VALUES (${name}, ${email}, ${passwordHashed}, ${createdAt})`;
    return { status: 200 };
  } catch (error) {
    console.error("Error inserting user:", error);
    return {
      status: 409,
      error: "Internal Error inserting User",
    };
  }
};
export const checkPassword = async ({
  userId,
  password,
}: {
  userId: number;
  password: string;
}) => {
  if (!userId || !password)
    return { status: 400, error: "Missing required fields" };
  try {
    const sql = await neon(process.env.DATABASE_URL as string);
    const response =
      await sql`SELECT password FROM "USER" WHERE id = ${userId}`;
    console.log(response);
    if (response.length === 0) {
      return { status: 404, error: "User not found" };
    }
    const user = response[0];
    const isValidPassword = compareSync(password, user.password);
    return { status: 200, data: isValidPassword };
  } catch (error) {
    console.error("Error checking password:", error);
    return {
      status: 409,
      error: "Internal Error checking password",
    };
  }
};

export const deleteUserById = async (
  id: number
): Promise<TResponse<string[]>> => {
  if (!id) return { status: 400, error: "Missing required fields" };
  try {
    const sql = await neon(process.env.DATABASE_URL as string);
    const response = await sql`SELECT * FROM "USER" WHERE id = ${id}`;
    if (response.length === 0) return { status: 404, error: "User Not Found" };
    await sql`DELETE FROM "USER" WHERE id = ${id}`;
    return { status: 200 };
  } catch (error) {
    console.error("Error deleting user:", error);
    return {
      status: 409,
      error: "Internal Error deleting User",
    };
  }
};
