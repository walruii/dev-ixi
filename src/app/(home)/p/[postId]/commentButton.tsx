"use client";
import { useState } from "react";
import { TfiComment } from "react-icons/tfi";

export default function CommentButton() {
  const [commentCount, setCommentCount] = useState(0);
  return (
    <div className="flex flex-col justify-center items-center gap-2">
      <div
        className="flex justify-center items-center cursor-pointer"
        onClick={() => setCommentCount(0)}
      >
        <TfiComment size={30} />
      </div>
      <p className="font-stretch-ultra-expanded text-sm">{commentCount}</p>
    </div>
  );
}
