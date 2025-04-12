"use server";

import { auth } from "@/auth";
import { neon } from "@neondatabase/serverless";

export async function likeBlog({ blogId }: { blogId: string | number }) {
  if (!blogId) {
    return { status: 400, error: "Post ID is required" };
  }

  try {
    const sql = await neon(process.env.DATABASE_URL as string);
    const session = await auth();
    if (!session?.user) {
      return { status: 401, error: "Unauthorized" };
    }
    const userId = session.user.userId;
    const [existingLike] = await sql`
    SELECT * FROM "BLOG_LIKE" 
    WHERE blog_id = ${blogId} AND user_id = ${userId}
    `;
    if (existingLike) {
      await sql`
      DELETE FROM "BLOG_LIKE"
      WHERE blog_id = ${blogId} AND user_id = ${userId}`;
      return { status: 200, message: "Post unliked successfully" };
    }
    await sql`INSERT INTO "BLOG_LIKE" (blog_id, user_id) 
              VALUES (${blogId}, ${userId})`;
    return { status: 201, message: "Post liked successfully" };
  } catch (error) {
    console.error("Error liking post:", error);
    return { status: 500, error: "Internal Server Error" };
  }
}

export async function likedByUser({ blogId }: { blogId: string | number }) {
  if (!blogId) {
    return false;
  }

  try {
    const sql = await neon(process.env.DATABASE_URL as string);
    const session = await auth();
    if (!session?.user) {
      return false;
    }
    const userId = session.user.userId;
    const [existingLike] = await sql`
    SELECT * FROM "BLOG_LIKE" 
    WHERE blog_id = ${blogId} AND user_id = ${userId}
    `;
    if (existingLike) {
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error checking like status:", error);
    return false;
  }
}
