"use server";
import { auth, unstable_update } from "@/auth";
import { TResponse } from "@/models/response";
import { TUserProfilePage } from "@/models/user";
import { neon } from "@neondatabase/serverless";
import { hashSync } from "bcryptjs";

type TUserData = {
  name: string;
  username: string;
  email: string;
  password: string;
};

export const createUser = async ({
  name,
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
    const description = "Hello, I am using DEV_IXI!";
    const image =
      "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fpluspng.com%2Fimg-png%2Fpng-user-icon-circled-user-icon-2240.png&f=1&nofb=1&ipt=eab9e2e1c4a417a5010a79ef55dd826010816a63220b65ff24f002f762a5740c";
    await sql`INSERT INTO "USER" (name, username, email, description, image, password, created_at) 
              VALUES (${name}, ${username}, ${email}, ${description}, ${image}, ${passwordHashed}, ${createdAt})`;
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
    const { email, userId: userId, image } = user;
    const sql = await neon(process.env.DATABASE_URL as string);
    const createdAt = new Date().toISOString();
    const response =
      await sql`INSERT INTO "USER" (name, username, email, description, google_id, image, created_at) 
                VALUES (${username}, ${username}, ${email}, ${"Hello, I am using DEV_IXI!"}, ${userId}, ${image}, ${createdAt}) RETURNING *`;
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

export const getUser = async ({
  userId,
}: {
  userId: string | number;
}): Promise<TUserProfilePage | null> => {
  if (!userId) {
    return null;
  }
  try {
    const sql = await neon(process.env.DATABASE_URL as string);
    const [user] = await sql`
  WITH follower_counts AS (
    SELECT f."user_id_DES" as user_id, COUNT(*) as follow_count
    FROM "FOLLOW" f
    WHERE f."user_id_DES" = ${userId}
    GROUP BY f."user_id_DES"
  )
  SELECT 
    u.id, 
    u.username, 
    u.description, 
    u.created_at, 
    u.image,
    COALESCE(fc.follow_count, 0) as follow_count,
    COALESCE(json_agg(json_build_object('id', b.id, 'title', b.title, 'created_at', b.created_at))
             FILTER (WHERE b.id IS NOT NULL), '[]') as blogs
  FROM "USER" u
  LEFT JOIN follower_counts fc ON fc.user_id = u.id
  LEFT JOIN "BLOG" b ON b."author_id" = u.id
  WHERE u.id = ${userId}
  GROUP BY u.id, u.username, u.description, u.created_at, u.image, fc.follow_count
`;
    if (!user) {
      return null;
    }
    const userWithBlogs: TUserProfilePage = {
      id: user.id,
      username: user.username,
      image: user.image,
      description: user.description,
      created_at: user.created_at,
      followers: user.follow_count,
      blogs: user.blogs.map(
        (blog: { id: number; title: string; created_at: Date }) => ({
          id: blog.id,
          title: blog.title,
          created_at: blog.created_at,
        })
      ),
    };
    return userWithBlogs;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};

export const changeUsername = async (username: string) => {
  if (!username || username.trim() === "") {
    return { status: 400, message: "Username not provided" };
  }

  try {
    const sql = await neon(process.env.DATABASE_URL as string);
    const check = await checkUsername({ username });
    const session = await auth();
    if (!session?.user) {
      return { status: 401, message: "Unauthorized" };
    }
    if (check.status !== 200) {
      return { status: 409, message: "Username Already in use" };
    }
    const [existingUser] = await sql`
    SELECT 1 
    FROM "USER" 
    WHERE id = ${session.user.userId}
    `;
    if (!existingUser) {
      return { status: 404, message: "User Not Found" };
    }

    await sql`
    UPDATE "USER"
    SET username = ${username}
    WHERE id = ${session.user.userId}
    `;
    await unstable_update({
      user: {
        username,
      },
    });
    return { status: 200, message: "Username Changed" };
  } catch (error) {
    console.log(error);
    return { status: 500, message: "Internal Error. Try Again Later." };
  }
};
