"use client";
import { likeBlog } from "@/serveractions/blog";
import { useState } from "react";
import { GoHeart, GoHeartFill } from "react-icons/go";

export default function LikeButton({
  likes,
  blogId,
  isLikedByUser,
}: {
  likes: number;
  blogId: number;
  isLikedByUser: boolean;
}) {
  const [isLiked, setIsLiked] = useState(isLikedByUser);
  const [likeCount, setLikeCount] = useState<number>(Number(likes));
  const [isLoading, setIsLoading] = useState(false);

  const handleLike = async () => {
    if (isLoading) return;
    setIsLoading(true);
    await likeBlog({ blogId });
    setIsLiked(!isLiked);
    setLikeCount(likeCount + (isLiked ? -1 : 1));
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col justify-center items-center gap-2">
      <div
        className="flex justify-center items-center cursor-pointer"
        onClick={handleLike}
      >
        {isLiked ? (
          <GoHeartFill size={30} className="inline" />
        ) : (
          <GoHeart size={30} className="inline" />
        )}
      </div>
      <p className="font-stretch-ultra-expanded text-sm">{likeCount}</p>
    </div>
  );
}
