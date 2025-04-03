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
      userId: string;
      name?: string | null | undefined;
      email?: string | null | undefined;
      image?: string | null | undefined;
    };
    name?: string; // for updating name
  }
  interface User {
    id?: string | undefined;
    name?: string | null | undefined;
    email?: string | null | undefined;
    image?: string | null | undefined;
  }
  interface Profile {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    picture?: any;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
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
            email: response[0].email,
            image: response[0]?.image || "",
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
    }: // trigger,
    // session,
    {
      token: JWT;
      account: Account | null;
      user: User | AdapterUser;
      profile?: Profile | undefined;
      trigger?: "update" | "signIn" | "signUp" | undefined;
      session?: Session;
    }) {
      if (account) {
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image;
        token.userId = user.id;

        if (profile) {
          try {
            const sql = await neon(process.env.DATABASE_URL as string);
            const response =
              await sql`SELECT * FROM "USER" WHERE email = ${profile.email}`;
            if (response.length !== 0) {
              token.userId = response[0].id;
              token.name = response[0].name;
              token.image = response[0].image;
            } else {
              console.log("User not found");
            }
          } catch (error) {
            console.log("Error accessing Database:", error);
          }
          token.email = profile.email;
        }
      }
      // TODO for updating user
      // if (trigger === "update") {
      //   if (session && session.name) {
      //     token.name = session.name;
      //   }
      //   if (session && session.nickname) {
      //     token.nickname = session.nickname;
      //   }
      //   if (session && session.bio) {
      //     token.bio = session.bio;
      //   }
      // }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      session.user.name = token.name as string;
      session.user.userId = token.userId as string;
      session.user.image = token.image as string;
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
            const created_at = new Date().toISOString();
            const createUserRes =
              await sql`INSERT INTO "USER" (email, name, image, google_id, created_at) VALUES (${profile.email}, ${profile.name}, ${profile.picture}, ${account.providerAccountId}, ${created_at}) RETURNING *`;
            const newUser = createUserRes[0];
            console.log(newUser);
          } else if (!userRes[0].google_id) {
            const res =
              await `UPDATE "USER" SET google_id = ${account.providerAccountId} WHERE email = ${profile.email} RETURNING *`;
            console.log(res);
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
