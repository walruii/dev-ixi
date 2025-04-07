"use server";
import { auth, unstable_update } from "@/auth";
import { TResponse } from "@/models/response";
import { neon } from "@neondatabase/serverless";
import { hashSync } from "bcryptjs";

type TUserData = {
  username: string;
  email: string;
  password: string;
};

export const createUser = async ({
  username,
  email,
  password,
}: TUserData): Promise<TResponse<string[]>> => {
  if (!username || !email || !password)
    return { status: 400, error: "Missing required fields" };
  try {
    const sql = await neon(process.env.DATABASE_URL as string);
    const passwordHashed = hashSync(password, 10);
    const createdAt = new Date().toISOString();
    await sql`INSERT INTO "USER" (name, username, email, password, created_at) 
              VALUES (${username}, ${username}, ${email}, ${passwordHashed}, ${createdAt})`;
    return { status: 200 };
  } catch (error) {
    console.error("Error inserting user:", error);
    return {
      status: 409,
      error: "Internal Error inserting User",
    };
  }
};

export const createUserGoogle = async ({
  username,
}: {
  username: string;
}): Promise<TResponse<string[]>> => {
  try {
    const { user } = (await auth()) ?? {};
    if (!user) return { status: 401, error: "Unauthorized" };
    const { email, userId, image } = user;
    const sql = await neon(process.env.DATABASE_URL as string);
    const createdAt = new Date().toISOString();
    const response =
      await sql`INSERT INTO "USER" (name, username, email, google_id, image, created_at) 
                VALUES (${username}, ${username}, ${email}, ${userId}, ${image}, ${createdAt}) RETURNING *`;
    await unstable_update({
      user: {
        username,
        isRegistered: true,
        userId: response[0].id,
        image: image,
      },
    });
    return { status: 200 };
  } catch (error) {
    console.error("Error inserting user:", error);
    return {
      status: 409,
      error: "Internal Error inserting User",
    };
  }
};

export const checkUsername = async ({ username }: { username: string }) => {
  try {
    const sql = await neon(process.env.DATABASE_URL as string);
    const [existingUsername] =
      await sql`SELECT * FROM "USER" WHERE username = ${username}`;
    if (existingUsername) {
      return { status: 409, error: "Username already exists" };
    }
    return { status: 200 };
  } catch (error) {
    console.error("Error checking username:", error);
    return { status: 500, error: "Internal Error" };
  }
};

export const checkEmail = async ({ email }: { email: string }) => {
  try {
    const sql = await neon(process.env.DATABASE_URL as string);
    const response = await sql`SELECT * FROM "USER" WHERE email = ${email}`;
    if (response.length === 0) {
      return { status: 200 };
    }
    return { status: 409, error: "Username already exists" };
  } catch (error) {
    console.error("Error checking username:", error);
    return { status: 500, error: "Internal Error" };
  }
};
