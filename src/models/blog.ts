export type TBlogPage = {
  id: number;
  title: string;
  content: string;
  author_id: string;
  author_username: string;
  author_image: string;
  u_created_at: Date;
  b_created_at: Date;
  like_count: number;
  comment_count: number;
  author_description: string;
  has_liked: boolean;
  is_following: boolean;
};

export type TBlogFeed = {
  id: number;
  title: string;
  author_id: string;
  author_username: string;
  author_image: string;
  b_created_at: Date;
  like_count: number;
  comment_count: number;
};

export type TSBlog = {
  id: number;
  title: string;
  created_at: Date;
};
