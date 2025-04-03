export type TUser = {
  id: number;
  name: string;
  email: string;
  password?: string;
  created_at: Date;
  image?: string;
  googleId?: string;
};
