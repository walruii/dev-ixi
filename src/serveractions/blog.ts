"use server";

import { auth } from "@/auth";
import { TBlogPage, TBlogFeed } from "@/models/blog";
import { FeedEnum } from "@/models/feedenum";
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
    const [blog] =
      await sql`INSERT INTO "BLOG" (title, content, author_id, created_at) 
              VALUES (${title}, ${content}, ${userId}, ${created_at})
              RETURNING id`;
    return { status: 201, id: blog.id };
  } catch (error) {
    console.error("Error creating post:", error);
    return { status: 500, error: "Internal Server Error" };
  }
}

export async function getBlogById(id: string): Promise<TBlogPage | null> {
  if (!Number.isInteger(Number(id))) {
    return null;
  }

  try {
    const sql = await neon(process.env.DATABASE_URL as string);
    const session = await auth();
    if (session?.user) {
      const userId = session.user.userId;
      const [post] = await sql`
      WITH like_counts AS (
      SELECT blog_id, COUNT(*) AS like_count
      FROM "BLOG_LIKE"
      GROUP BY blog_id
    ),
    comment_counts AS (
      SELECT blog_id, COUNT(*) AS comment_count
      FROM "COMMENT"
      GROUP BY blog_id
    ),
    is_following AS (
      SELECT 1 AS following
      FROM "FOLLOW"
      WHERE "user_id_SRC" = ${userId} AND "user_id_DES" = (
        SELECT author_id FROM "BLOG" WHERE id = ${id}
      )
    ),
    has_liked AS (
      SELECT 1 AS liked
      FROM "BLOG_LIKE"
      WHERE user_id = ${userId} AND blog_id = ${id}
    )

    SELECT 
      u.id AS author_id, 
      u.username, 
      u.image, 
      u.created_at AS u_created_at, 
      u.description AS u_description, 
      b.id, 
      b.title, 
      b.content, 
      b.created_at AS b_created_at,
      COALESCE(lc.like_count, 0) AS like_count,
      COALESCE(cc.comment_count, 0) AS comment_count,
      COALESCE(f.following, 0) AS is_following,
      COALESCE(l.liked, 0) AS has_liked

    FROM "BLOG" b
    JOIN "USER" u ON u.id = b.author_id
    LEFT JOIN like_counts lc ON b.id = lc.blog_id
    LEFT JOIN comment_counts cc ON cc.blog_id = b.id
    LEFT JOIN is_following f ON TRUE
    LEFT JOIN has_liked l ON TRUE
    WHERE b.id = ${id};

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
        author_description: post.u_description as string,
        has_liked: post.has_liked === 1 ? true : false,
        is_following: post.is_following === 1 ? true : false,
      };
    } else {
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
      SELECT u.id as author_id, u.username, u.image, u.created_at AS u_created_at, u.description as u_description, 
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
        author_description: post.u_description as string,
        has_liked: false,
        is_following: false,
      };
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getAllBlogs({
  limit = 7,
  lastSeen = { time: new Date(), blog_id: 0 },
  type = FeedEnum.HOME,
  userId = null,
}: {
  limit?: number;
  lastSeen: {
    time: Date;
    blog_id: number;
  };
  type?: FeedEnum;
  userId?: string | number | null;
}): Promise<TBlogFeed[]> {
  try {
    const sql = await neon(process.env.DATABASE_URL as string);

    let whereClause = sql`
      WHERE (b.created_at, b.id) < (${lastSeen.time.toISOString()}, ${
      lastSeen.blog_id
    })
      `;
    let orderBy = sql`b.created_at DESC`;

    if (type === FeedEnum.TRENDING) {
      whereClause = sql`
      WHERE (b.created_at, b.id) < (${lastSeen.time.toISOString()}, ${
        lastSeen.blog_id
      })
      `;
      orderBy = sql`
      like_count DESC, b.created_at DESC
      `;
    }

    if (type === FeedEnum.PROFILE && userId) {
      whereClause = sql`
      WHERE b.author_id = ${userId} AND (b.created_at, b.id) < (${lastSeen.time.toISOString()}, ${
        lastSeen.blog_id
      })
      `;
    }

    if (type === FeedEnum.FOLLOWING) {
      whereClause = sql`
      WHERE b.author_id IN (
      SELECT "user_id_DES"
      FROM "FOLLOW"
      WHERE "user_id_SRC" = ${userId}
      ) AND (b.created_at, b.id) < (${lastSeen.time.toISOString()}, ${
        lastSeen.blog_id
      })
      `;
    }
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
    SELECT u.username, u.image, u.created_at AS u_created_at, u.description as u_description, 
       b.id, b.title, b.created_at AS b_created_at,
      COALESCE(lc.like_count, 0) as like_count,
      COALESCE(cc.comment_count, 0) as comment_count
      FROM "BLOG" b
      JOIN "USER" u on u.id = b.author_id
      LEFT JOIN like_counts lc on b.id = lc.blog_id
      LEFT JOIN comment_counts cc on cc.blog_id = b.id
      ${whereClause}
      ORDER BY ${orderBy}
      LIMIT ${limit}
    `;
    if (!blogs) return [];
    return blogs.map((blog) => ({
      id: blog.id,
      title: blog.title,
      author_id: blog.author_id,
      author_username: blog.username,
      author_image: blog.image,
      b_created_at: blog.b_created_at,
      like_count: blog.like_count,
      comment_count: blog.comment_count,
    }));
  } catch (error) {
    console.log(error);
    return [];
  }
}
