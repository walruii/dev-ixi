import { TBlog } from "@/models/blog";
import LikeButton from "./like";
import CommentLink from "./commentLink";
import { likedByUser } from "@/serveractions/blog";
import ShareButton from "./shareButton";

export default async function PostLeftMenu({
  className,
  blog,
}: {
  blog: TBlog;
  className?: string;
}) {
  const isLikedByUser = await likedByUser({ blogId: blog.id });
  return (
    <div className={`flex-col items-center fixed h-1/2 ${className}`}>
      <div className="h-32" />
      <div className="p-4">
        <LikeButton
          likes={blog.like_count}
          blogId={blog.id}
          isLikedByUser={isLikedByUser}
        />
      </div>
      <div className="p-4">
        <CommentLink comments={blog.comment_count} />
      </div>
      <div className="p-4">
        <ShareButton />
      </div>
    </div>
  );
}
