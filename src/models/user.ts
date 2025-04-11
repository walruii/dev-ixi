import { TSBlog } from "./blog";

export type TUser = {
  id: number;
  name: string;
  username: string;
  email: string;
  password?: string;
  created_at: Date;
  image?: string;
  googleId?: string;
  description?: string;
};

export type TUserPartial = {
  id: number;
  username: string;
  image?: string;
  description: string;
};

export type TUserProfilePage = {
  id: number;
  username: string;
  image: string;
  description: string;
  created_at: Date;
  followers: number;
  blogs: TSBlog[];
};
