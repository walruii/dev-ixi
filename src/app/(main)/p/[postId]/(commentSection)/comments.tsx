import { TComment } from "@/models/comment";
import { getCommentsByBlog } from "@/serveractions/comment";
import Comment from "./comment";

export default async function Comments({
  blogId,
  sessionUserId,
}: {
  blogId: number;
  sessionUserId: string | number;
}) {
  const comments: TComment[] = await getCommentsByBlog({ blogId });
  return (
    <div className="flex flex-col gap-2">
      <div className="border-b my-2" />
      <h1>Comments</h1>
      {comments.map((comment) => (
        <Comment
          key={comment.id}
          comment={comment}
          sessionUserId={sessionUserId}
        />
      ))}
    </div>
  );
}
