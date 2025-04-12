"use server";

import { auth } from "@/auth";
import { neon } from "@neondatabase/serverless";

export async function likeComment({
  commentId,
}: {
  commentId: string | number;
}) {
  if (!commentId) {
    return { status: 400, error: "Comment ID is required" };
  }

  try {
    const sql = await neon(process.env.DATABASE_URL as string);
    const session = await auth();
    if (!session?.user) {
      return { status: 401, error: "Unauthorized" };
    }
    const userId = session.user.userId;

    const [existingLike] = await sql`
    SELECT * FROM "COMMENT_LIKE" 
    WHERE comment_id = ${commentId} AND user_id = ${userId}
    `;
    if (existingLike && existingLike.type === true) {
      await sql`
      DELETE FROM "COMMENT_LIKE"
      WHERE comment_id = ${commentId} AND user_id = ${userId}`;
      return { status: 204, message: "comment unliked successfully" };
    }
    if (existingLike && existingLike.type === false) {
      await sql`
        UPDATE "COMMENT_LIKE" 
        SET type = ${true}
        WHERE comment_id = ${commentId} AND user_id = ${userId}`;
      return { status: 200, message: "comment liked successfully" };
    }
    await sql`INSERT INTO "COMMENT_LIKE" (comment_id, user_id, type) 
              VALUES (${commentId}, ${userId}, ${true})`;

    return { status: 201, message: "Post liked successfully" };
  } catch (error) {
    console.error("Error liking post:", error);
    return { status: 500, error: "Internal Server Error" };
  }
}

export async function dislikeComment({
  commentId,
}: {
  commentId: string | number;
}) {
  if (!commentId) {
    return { status: 400, error: "Comment ID is required" };
  }

  try {
    const sql = await neon(process.env.DATABASE_URL as string);
    const session = await auth();
    if (!session?.user) {
      return { status: 401, error: "Unauthorized" };
    }
    const userId = session.user.userId;

    const [existingLike] = await sql`
    SELECT * FROM "COMMENT_LIKE" 
    WHERE comment_id = ${commentId} AND user_id = ${userId}
    `;
    if (existingLike && existingLike.type === false) {
      await sql`
      DELETE FROM "COMMENT_LIKE"
      WHERE comment_id = ${commentId} AND user_id = ${userId}`;
      return { status: 204, message: "comment un-disliked successfully" };
    }
    if (existingLike && existingLike.type === true) {
      await sql`
        UPDATE "COMMENT_LIKE" 
        SET type = ${false}
        WHERE comment_id = ${commentId} AND user_id = ${userId}`;
      return { status: 200, message: "comment disliked successfully" };
    }
    await sql`INSERT INTO "COMMENT_LIKE" (comment_id, user_id, type) 
              VALUES (${commentId}, ${userId}, ${false})`;

    return { status: 201, message: "Post disliked successfully" };
  } catch (error) {
    console.error("Error liking post:", error);
    return { status: 500, error: "Internal Server Error" };
  }
}
