import Comments from "./comments";
import CreateComment from "./createComment";

export default function CommentSection({
  blogId,
  className,
}: {
  className?: string;
  blogId: number;
}) {
  return (
    <div id="comments" className={` ${className}`}>
      <h1 className="font-bold text-3xl">Discussion</h1>
      <CreateComment blogId={blogId} />
      <Comments blogId={blogId} />
    </div>
  );
}
