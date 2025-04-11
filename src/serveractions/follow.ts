"use server";

import { auth } from "@/auth";
import { TUserPartial } from "@/models/user";
import { neon } from "@neondatabase/serverless";

export async function followUser({ userId }: { userId: number | string }) {
  if (!userId) {
    return { status: 400, error: "User ID is required" };
  }
  try {
    const sql = await neon(process.env.DATABASE_URL as string);
    const session = await auth();

    if (!session?.user) {
      return { status: 401, error: "Unauthorized" };
    }
    const currentUserId = session.user.userId;
    if (currentUserId === userId) {
      return { status: 400, error: "Cannot follow yourself" };
    }
    const [existingFollow] = await sql`
      SELECT * FROM "FOLLOW" f
      WHERE f."user_id_SRC" = ${currentUserId} AND f."user_id_DES" = ${userId}
    `;
    if (existingFollow) {
      await sql`
        DELETE FROM "FOLLOW" f
        WHERE f."user_id_SRC" = ${currentUserId} AND f."user_id_DES" = ${userId}
      `;
      return { status: 200, message: "Unfollowed successfully" };
    }
    const created_at = new Date().toISOString();
    await sql`
      INSERT INTO "FOLLOW" ("user_id_SRC", "user_id_DES", "created_at")
      VALUES (${currentUserId}, ${userId}, ${created_at})
    `;
    return { status: 201, message: "Followed successfully" };
  } catch (error) {
    console.error("Error following user:", error);
    return { status: 500, error: "Internal Server Error" };
  }
}

export async function checkFollowed({ userId }: { userId: number | string }) {
  if (!userId) {
    return false;
  }
  try {
    const sql = await neon(process.env.DATABASE_URL as string);
    const session = await auth();
    if (!session?.user) {
      return false;
    }

    const currentUserId = session.user.userId;
    const [existingFollow] = await sql`
      SELECT * FROM "FOLLOW" f
      WHERE f."user_id_SRC" = ${currentUserId} AND f."user_id_DES" = ${userId}
    `;
    if (existingFollow) {
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error checking follow status:", error);
    return false;
  }
}

export async function getFollowingUsers() {
  try {
    const sql = await neon(process.env.DATABASE_URL as string);
    const session = await auth();
    if (!session?.user) {
      return [];
    }
    const currentUserId = session.user.userId;
    const followingUsers = await sql`
      SELECT u.id, u.username, u.image, u.description
      FROM "FOLLOW" f
      JOIN "USER" u ON f."user_id_DES" = u.id
      WHERE f."user_id_SRC" = ${currentUserId}
    `;

    const formattedFollowingUsers: TUserPartial[] = followingUsers.map(
      (user) => ({
        id: user.id,
        username: user.username,
        image: user.image,
        description: user.description,
      })
    );
    return formattedFollowingUsers;
  } catch (error) {
    console.error("Error fetching following users:", error);
    return [];
  }
}
