import { neon } from "@neondatabase/serverless";
import bycrpt from "bcryptjs";
import NextAuth, { Account, Profile, Session, User } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import { JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

declare module "next-auth" {
  interface Session {
    user: {
      userId: number;
      name: string | null | undefined;
      username: string | null | undefined;
      email: string | null | undefined;
      image: string | null | undefined;
      description: string | null | undefined;
      isRegistered: boolean | null | undefined;
    };
    name?: string; // for updating name
  }
  interface JWT {
    userId: number;
    name: string;
    username: string;
    email: string;
    image: string;
    description: string;
    isRegistered: boolean;
  }
  interface User {
    id?: string;
    name?: string | null;
    username: string | null;
    email?: string | null;
    image?: string | null;
    description: string | null;
    isRegistered: boolean | null;
  }
  interface Profile {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    picture?: any;
  }
}

export const { handlers, signIn, signOut, auth, unstable_update } = NextAuth({
  providers: [
    Google,
    Credentials({
      credentials: {
        email: { label: "Email", type: "text", placeholder: "Email@mail.com" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (
        credentials: Partial<Record<"email" | "password", unknown>>
      ): Promise<User | null> => {
        try {
          if (!credentials) {
            return null;
          }
          const sql = await neon(process.env.DATABASE_URL as string);
          const response =
            await sql`SELECT * FROM "USER" WHERE email = ${credentials.email}`;
          if (response.length === 0) {
            return null;
          }
          if (!response[0].password) {
            return null;
          }
          if (
            !bycrpt.compareSync(
              credentials.password as string,
              response[0].password
            )
          ) {
            return null;
          }
          const userToSubmit: User = {
            id: response[0].id,
            name: response[0].name,
            username: response[0].username,
            email: response[0].email,
            image: response[0].image,
            description: response[0].description,
            isRegistered: true,
          };

          return userToSubmit;
        } catch (error) {
          console.log(error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({
      token,
      account,
      user,
      profile,
      trigger,
      session,
    }: {
      token: JWT;
      account: Account | null;
      user: User | AdapterUser;
      profile?: Profile | undefined;
      trigger?: "update" | "signIn" | "signUp" | undefined;
      session?: Session;
    }) {
      if (account) {
        token.userId = Number(user.id);
        token.name = user.name;
        token.username = user.username;
        token.email = user.email;
        token.image = user.image;
        token.description = user.description;
        token.isRegistered = user.isRegistered;

        if (profile) {
          try {
            const sql = await neon(process.env.DATABASE_URL as string);
            const response =
              await sql`SELECT * FROM "USER" WHERE email = ${profile.email}`;
            if (response.length !== 0) {
              token.userId = Number(response[0].id);
              token.name = response[0].name;
              token.image = response[0].image;
              token.username = response[0].username;
              token.description = response[0].description;
              token.isRegistered = true;
            } else {
              token.isRegistered = false;
            }
          } catch (error) {
            console.log("Error accessing Database:", error);
          }
        }
      }
      if (trigger === "update") {
        if (session) {
          if (session.user.isRegistered) {
            token.isRegistered = session.user.isRegistered;
          }
          if (session.user.username) {
            token.username = session.user.username;
          }
          if (session.user.userId) {
            token.userId = session.user.userId;
          }
          if (session.user.image) {
            token.image = session.user.image;
          }
        }
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      session.user.name = token.name;
      session.user.userId = token.userId as number;
      session.user.image = token.image as string;
      session.user.username = token.username as string;
      session.user.email = token.email as string;
      session.user.description = token.description as string;
      session.user.isRegistered = token.isRegistered as boolean;
      return session;
    },

    async redirect() {
      return `/`;
    },

    async signIn({
      account,
      profile,
    }: {
      account: Account | null;
      profile?: Profile | undefined;
    }): Promise<boolean> {
      if (!account) {
        return false;
      }
      if (account.provider === "google") {
        if (!profile) {
          return false;
        }
        try {
          const sql = await neon(process.env.DATABASE_URL as string);
          const userRes =
            await sql`SELECT * FROM "USER" WHERE email = ${profile.email}`;
          if (!userRes.length) {
            // const created_at = new Date().toISOString();
            // await sql`INSERT INTO "USER" (email, name, image, google_id, created_at) VALUES (${profile.email}, ${profile.name}, ${profile.picture}, ${account.providerAccountId}, ${created_at}) RETURNING *`;
          } else if (!userRes[0].google_id) {
            await `UPDATE "USER" SET google_id = ${account.providerAccountId} WHERE email = ${profile.email} RETURNING *`;
          }
          return true;
        } catch (error) {
          console.log(error);
          return false;
        }
      } else if (account.provider === "credentials") {
        return true;
      }
      return false; // Ensure a boolean is returned if no condition is met
    },
  },
  pages: {
    signIn: "/signin",
  },
});
