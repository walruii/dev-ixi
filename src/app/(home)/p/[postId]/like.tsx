"use client";
import { useState } from "react";
import { GoHeart, GoHeartFill } from "react-icons/go";

export default function LikeButton() {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(1001);
  return (
    <div className="flex flex-col justify-center items-center gap-2">
      <div
        className="flex justify-center items-center cursor-pointer"
        onClick={() => {
          setIsLiked(!isLiked);
          setLikeCount(likeCount + 1);
        }}
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
