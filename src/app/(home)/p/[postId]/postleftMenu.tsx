import { TBlog } from "@/models/blog";
import LikeButton from "./like";
import CommentButton from "./commentButton";
import ShareButton from "./shareButton";

export default function PostLeftMenu({
  className,
}: {
  blog: TBlog;
  className?: string;
}) {
  return (
    <div className={`flex-col items-center fixed h-1/2 ${className}`}>
      <div className="h-32" />
      <div className="p-4">
        <LikeButton />
      </div>
      <div className="p-4">
        <CommentButton />
      </div>
      <div className="p-4">
        <ShareButton />
      </div>
    </div>
  );
}
