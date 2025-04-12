import { TComment } from "@/models/comment";
import { getCommentsByBlog } from "@/serveractions/comment";
import Comment from "./comment";

export default async function Comments({ blogId }: { blogId: number }) {
  const comments: TComment[] = await getCommentsByBlog({ blogId });
  return (
    <div className="flex flex-col gap-2">
      <div className="border-b my-2" />
      <h1>Comments</h1>
      {comments.map((comment) => (
        <Comment key={comment.id} comment={comment} />
      ))}
    </div>
  );
}
