"use server";

import { auth } from "@/auth";
import { TBlog } from "@/models/blog";
import { neon } from "@neondatabase/serverless";
// import { redirect } from "next/navigation";

export async function createBlog({
  title,
  content,
}: {
  title: string;
  content: string;
}) {
  if (!title || !content) {
    return { status: 400, error: "Title and content are required" };
  }

  try {
    const sql = await neon(process.env.DATABASE_URL as string);
    const session = await auth();
    if (!session?.user) {
      // redirect("/signin");
      return { status: 401, error: "Unauthorized" };
    }
    const userId = session.user.userId;
    const created_at = new Date().toISOString();
    const [existingPost] = await sql`SELECT 1 FROM "BLOG" 
                                     WHERE title = ${title.trim()} AND author_id = ${userId}`;
    if (existingPost) {
      return { status: 409, error: "Post already exists" };
    }
    await sql`INSERT INTO "BLOG" (title, content, author_id, created_at) 
              VALUES (${title}, ${content}, ${userId}, ${created_at})`;
    return { status: 201, message: "Post created successfully" };
  } catch (error) {
    console.error("Error creating post:", error);
    return { status: 500, error: "Internal Server Error" };
  }
}

export async function getBlogById(id: string): Promise<TBlog | null> {
  if (!Number.isInteger(Number(id))) {
    return null;
  }

  try {
    const sql = await neon(process.env.DATABASE_URL as string);
    const [post] = await sql`
WITH like_counts AS (
  SELECT blog_id, COUNT(*) as like_count
  FROM "BLOG_LIKE"
  GROUP BY blog_id
),
comment_counts AS (
  SELECT blog_id, COUNT(*) AS comment_count
  FROM "COMMENT"
  GROUP BY blog_id
)
SELECT u.username, u.image, u.created_at AS u_created_at, 
       b.id, b.title, b.content, b.created_at AS b_created_at,
      COALESCE(lc.like_count, 0) as like_count,
      COALESCE(cc.comment_count, 0) as comment_count
      FROM "BLOG" b
      JOIN "USER" u on u.id = b.author_id
      LEFT JOIN like_counts lc on b.id = lc.blog_id
      LEFT JOIN comment_counts cc on cc.blog_id = b.id
      WHERE b.id = ${id}
`;
    if (!post) return null;
    return {
      id: post.id as number,
      title: post.title as string,
      content: post.content as string,
      author_id: post.author_id as string,
      author_username: post.username as string,
      author_image: post.image as string,
      b_created_at: post.b_created_at as Date,
      u_created_at: post.b_created_at as Date,
      like_count: post.like_count as number,
      comment_count: post.comment_count as number,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}

// TODO: Add Pagination
export async function getAllBlogs({
  limit = 7,
  lastSeen = { time: new Date(), blog_id: 0 },
}: {
  limit?: number;
  lastSeen: {
    time: Date;
    blog_id: number;
  };
}): Promise<TBlog[]> {
  try {
    const sql = await neon(process.env.DATABASE_URL as string);
    const blogs = await sql`
WITH like_counts AS (
  SELECT blog_id, COUNT(*) as like_count
  FROM "BLOG_LIKE"
  GROUP BY blog_id
),
comment_counts AS (
  SELECT blog_id, COUNT(*) AS comment_count
  FROM "COMMENT"
  GROUP BY blog_id
)
SELECT u.username, u.image, u.created_at AS u_created_at, 
       b.id, b.title, b.content, b.created_at AS b_created_at,
      COALESCE(lc.like_count, 0) as like_count,
      COALESCE(cc.comment_count, 0) as comment_count
      FROM "BLOG" b
      JOIN "USER" u on u.id = b.author_id
      LEFT JOIN like_counts lc on b.id = lc.blog_id
      LEFT JOIN comment_counts cc on cc.blog_id = b.id
      WHERE (b.created_at, b.id) < (${lastSeen.time.toISOString()}, ${
      lastSeen.blog_id
    })
      ORDER BY b.created_at DESC
      LIMIT ${limit}
                `;
    if (!blogs) return [];
    return blogs.map((blog) => ({
      id: blog.id,
      title: blog.title,
      content: blog.content,
      author_id: blog.author_id,
      author_username: blog.username,
      author_image: blog.image,
      u_created_at: blog.u_created_at,
      b_created_at: blog.b_created_at,
      like_count: blog.like_count,
      comment_count: blog.comment_count,
    }));
  } catch (error) {
    console.log(error);
    return [];
  }
}

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
