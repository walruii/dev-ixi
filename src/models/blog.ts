export type TBlog = {
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
  author_description?: string;
};

export type TBlogPartial = {
  id: number;
  title: string;
  author_id: string;
  author_username: string;
  author_image: string;
  b_created_at: Date;
  like_count: number;
  comment_count: number;
};
