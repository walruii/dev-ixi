import { TBlogPage } from "@/models/blog";
import LikeButton from "./like";
import CommentLink from "./commentLink";
import ShareButton from "./shareButton";

export default async function PostLeftMenu({
  className,
  blog,
}: {
  blog: TBlogPage;
  className?: string;
}) {
  return (
    <div className={`flex-col items-center fixed h-1/2 ${className}`}>
      <div className="h-32" />
      <div className="p-4">
        <LikeButton
          likes={blog.like_count}
          blogId={blog.id}
          isLikedByUser={blog.has_liked}
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
