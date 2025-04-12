export type TComment = {
  id: number;
  user_id: number;
  blog_id: number;
  content: string;
  created_at: Date;
  username: string;
  image: string;
  likes: number;
  dislikes: number;
  has_liked: boolean;
  has_disliked: boolean;
};
