import { auth } from "@/auth";
import Comments from "./comments";
import CreateComment from "./createComment";

export default async function CommentSection({
  blogId,
  className,
}: {
  className?: string;
  blogId: number;
}) {
  const session = await auth();
  return (
    <div id="comments" className={` ${className}`}>
      <h1 className="font-bold text-3xl">Discussion</h1>
      <CreateComment blogId={blogId} />
      <Comments sessionUserId={session?.user.userId || ""} blogId={blogId} />
    </div>
  );
}
