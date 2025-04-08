"use server";

import { auth } from "@/auth";
import { TBlog } from "@/models/blog";
import { neon } from "@neondatabase/serverless";

export async function createPost({
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

export async function getPostById(id: string): Promise<TBlog | null> {
  if (!Number.isInteger(Number(id))) {
    return null;
  }

  try {
    const sql = await neon(process.env.DATABASE_URL as string);
    const [post] =
      await sql`SELECT "USER".username, "BLOG".id, "BLOG".title, "BLOG".content, "BLOG".created_at
              FROM "USER"
              RIGHT JOIN "BLOG" on "USER".id = "BLOG".author_id
              WHERE "BLOG".id = ${id}`;
    if (!post) return null;
    return {
      id: post.id as number,
      title: post.title as string,
      content: post.content as string,
      author_id: post.author_id as string,
      author_username: post.username as string,
      created_at: post.created_at as Date,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}

// TODO: Add Pagination
export async function getAllPosts({ limit = 7, page = 0 } = {}): Promise<
  TBlog[]
> {
  try {
    const sql = await neon(process.env.DATABASE_URL as string);
    const blogs =
      await sql`SELECT u.username, b.id, b.title, b.content, b.created_at 
                FROM "BLOG" b
                JOIN "USER" u on u.id = b.author_id
                ORDER BY b.created_at DESC
                LIMIT ${limit} OFFSET ${page * limit}`;
    if (!blogs) return [];
    return blogs.map((blog) => ({
      id: blog.id,
      title: blog.title,
      content: blog.content,
      author_id: blog.author_id,
      author_username: blog.username,
      created_at: blog.created_at,
    }));
  } catch (error) {
    console.log(error);
    return [];
  }
}

// TODO: Add Pagination
// export async function getUserPosts() {
//   try {
//     const sql = await neon(process.env.DATABASE_URL as string);
//     const session = await auth();
//     if (!session?.user) {
//       return { status: 401, error: "Unauthorized" };
//     }
//     const userId = session.user.userId;
//     const response =
//       await sql`SELECT * FROM "BLOG" WHERE author_id = ${userId}`;
//     return { status: 200, data: response };
//   } catch (error) {
//     console.log(error);
//     return { status: 500, error: "Internal Server Error" };
//   }
// }
