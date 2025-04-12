"use client";
import { useLikeComment } from "@/hooks/useLikeComment";
import { ThumbsDown, ThumbsUp } from "lucide-react";

export default function CommentLikeDislike({
  likes,
  dislikes,
  has_disliked,
  has_liked,
  commentId,
}: {
  commentId: number;
  dislikes: number;
  likes: number;
  has_liked: boolean;
  has_disliked: boolean;
}) {
  const { optimisticState, handleLike, handleDislike } = useLikeComment({
    commentId,
    likes,
    dislikes,
    has_disliked,
    has_liked,
  });

  return (
    <>
      <button
        className="flex flex-col items-center justify-center gap-1 cursor-pointer"
        onClick={handleLike}
      >
        {optimisticState.liked === "liked" ? (
          <ThumbsUp size={20} className="text-white" fill="white" />
        ) : (
          <ThumbsUp size={20} />
        )}
        <p>{optimisticState.likeCount}</p>
      </button>
      <button
        className="flex flex-col items-center justify-center gap-1 cursor-pointer"
        onClick={handleDislike}
      >
        {optimisticState.liked === "disliked" ? (
          <ThumbsDown size={20} className="text-white" fill="white" />
        ) : (
          <ThumbsDown size={20} />
        )}
        <p>{optimisticState.dislikeCount}</p>
      </button>
    </>
  );
}
