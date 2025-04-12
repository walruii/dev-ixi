import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TComment } from "@/models/comment";
import CommentLikeDislike from "./commentLikeDislike";

export default function Comment({ comment }: { comment: TComment }) {
  return (
    <div className="">
      <div className="flex gap-2">
        <Avatar className="w-10 h-10">
          <AvatarImage src={comment.image} />
          <AvatarFallback>AN</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="font-bold">{comment.username}</span>
          <p>{comment.content}</p>
          <div className="text-sm text-zinc-500 flex items-center mt-2 gap-4">
            <CommentLikeDislike
              commentId={comment.id}
              likes={comment.likes}
              dislikes={comment.dislikes}
              has_disliked={comment.has_disliked}
              has_liked={comment.has_liked}
            />
          </div>
        </div>
      </div>
      <div className="border-b my-2 w-full" />
    </div>
  );
}
