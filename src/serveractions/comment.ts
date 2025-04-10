"use server";
import { auth } from "@/auth";
import { neon } from "@neondatabase/serverless";

export async function createComment({
  blogId,
  content,
}: {
  blogId: string | number;
  content: string;
}) {
  if (!blogId || !content) {
    return {
      status: 400,
      error: "Blog ID and content are required.",
    };
  }

  try {
    const sql = await neon(process.env.DATABASE_URL as string);
    const session = await auth();
    if (!session?.user) {
      return {
        status: 401,
        error: "Unauthorized",
      };
    }
    const userId = session.user.userId;
    const created_at = new Date();

    const [result] = await sql`
      INSERT INTO "COMMENT" (blog_id, user_id, content, created_at)
      VALUES (${blogId}, ${userId}, ${content}, ${created_at})
      RETURNING *
    `;
    if (!result) {
      return {
        status: 500,
        error: "Failed to create comment.",
      };
    }
    return {
      status: 201,
      data: result,
    };
  } catch (error) {
    console.error("Error creating comment:", error);
    return {
      status: 500,
      error: "Internal Server Error",
    };
  }
}

export async function getCommentsByBlog({
  blogId,
}: {
  blogId: string | number;
}) {
  if (!blogId) {
    return [];
  }
  try {
    const sql = await neon(process.env.DATABASE_URL as string);
    const comments = await sql`
      SELECT c.*, u.username, u.image
      FROM "COMMENT" c
      JOIN "USER" u ON c.user_id = u.id
      WHERE c.blog_id = ${blogId}
      ORDER BY c.created_at DESC
    `;
    if (!comments) return [];
    return comments.map((comment) => ({
      id: comment.id,
      blog_id: comment.blog_id,
      user_id: comment.user_id,
      content: comment.content,
      created_at: comment.created_at,
      username: comment.username,
      image: comment.image,
    }));
  } catch (error) {
    console.error("Error fetching comments:", error);
    return [];
  }
}
