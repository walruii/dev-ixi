"use server";
import { auth } from "@/auth";
import { TComment } from "@/models/comment";
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
}): Promise<TComment[] | []> {
  if (!blogId) {
    return [];
  }
  try {
    const sql = await neon(process.env.DATABASE_URL as string);
    const session = await auth();
    if (!session?.user) {
      const comments = await sql`
    WITH comment_reactions AS (
  SELECT comment_id,
         COUNT(*) FILTER (WHERE type = true) AS like_count,
         COUNT(*) FILTER (WHERE type = false) AS dislike_count
  FROM "COMMENT_LIKE"
  GROUP BY comment_id
),
SELECT c.*, u.username, u.image,
COALESCE(cr.like_count, 0) AS likes,
COALESCE(cr.dislike_count, 0) AS dislikes,
FROM "COMMENT" c
JOIN "USER" u ON c.user_id = u.id
LEFT JOIN comment_reactions as cr on c.id = cr.comment_id
LEFT JOIN user_reactions ur ON ur.comment_id = c.id
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
        likes: comment.likes,
        dislikes: comment.dislikes,
        has_liked: false,
        has_disliked: false,
      }));
    }
    const userId = session.user.userId;
    const comments = await sql`
    WITH comment_reactions AS (
  SELECT comment_id,
         COUNT(*) FILTER (WHERE type = true) AS like_count,
         COUNT(*) FILTER (WHERE type = false) AS dislike_count
  FROM "COMMENT_LIKE"
  GROUP BY comment_id
),
user_reactions AS (
  SELECT comment_id,
         MAX(CASE WHEN type = true THEN 1 ELSE 0 END) AS has_liked,
         MAX(CASE WHEN type = false THEN 1 ELSE 0 END) AS has_disliked
  FROM "COMMENT_LIKE"
  WHERE user_id = ${userId}
  GROUP BY comment_id
)
SELECT c.*, u.username, u.image,
COALESCE(cr.like_count, 0) AS likes,
COALESCE(cr.dislike_count, 0) AS dislikes,
COALESCE(ur.has_liked, 0) as has_liked,
COALESCE(ur.has_disliked, 0) as has_disliked
FROM "COMMENT" c
JOIN "USER" u ON c.user_id = u.id
LEFT JOIN comment_reactions as cr on c.id = cr.comment_id
LEFT JOIN user_reactions ur ON ur.comment_id = c.id
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
      likes: comment.likes,
      dislikes: comment.dislikes,
      has_liked: comment.has_liked,
      has_disliked: comment.has_disliked,
    }));
  } catch (error) {
    console.error("Error fetching comments:", error);
    return [];
  }
}

export async function deleteComment({
  commentId,
}: {
  commentId: string | number;
}) {
  if (!commentId) {
    return {
      status: 400,
      error: "Comment ID is required.",
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

    const [result] = await sql`
      DELETE FROM "COMMENT"
      WHERE id = ${commentId} AND user_id = ${userId}
      RETURNING *
    `;
    if (!result) {
      return {
        status: 404,
        error: "Comment not found or you are not the owner.",
      };
    }
    return {
      status: 204,
      message: "Comment deleted successfully.",
    };
  } catch (error) {
    console.error("Error deleting comment:", error);
    return {
      status: 500,
      error: "Internal Server Error",
    };
  }
}
