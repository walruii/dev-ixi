import { Avatar } from "@/components/ui/avatar";
import { TComment } from "@/models/comment";
import { getCommentsByBlog } from "@/serveractions/comment";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

function Comment({ comment }: { comment: TComment }) {
  return (
    <div className="">
      <div className="flex gap-2 mb-4 py-4">
        <Avatar className="w-10 h-10">
          <AvatarImage src={comment.image} />
          <AvatarFallback>AN</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="font-bold">{comment.username}</span>
          <p>{comment.content}</p>
        </div>
      </div>
      <div className="border-b my-2 w-full" />
    </div>
  );
}
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
