"use client";
import { likeBlog } from "@/serveractions/likeBlog";
import { useRouter } from "next/navigation";
import { useOptimistic, useState, useTransition } from "react";
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
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [liked, setLiked] = useState(isLikedByUser);
  const [count, setCount] = useState(Number(likes));

  const [optimisticState, addOptimistic] = useOptimistic(
    { liked, count },
    (state, newState: { liked: boolean }) => {
      const delta = newState.liked ? 1 : -1;
      return {
        liked: newState.liked,
        count: state.count + delta,
      };
    }
  );

  const handleLike = async () => {
    if (isPending) return;
    const nextLiked = !liked;

    startTransition(async () => {
      addOptimistic({ liked: nextLiked });
      const res = await likeBlog({ blogId });

      if (res.status === 401) {
        router.push("/signin");
        return;
      }

      setLiked(nextLiked);
      setCount((prev) => prev + (nextLiked ? 1 : -1));
    });
  };

  return (
    <div className="flex flex-col justify-center items-center gap-2">
      <div
        className="flex justify-center items-center cursor-pointer"
        onClick={handleLike}
      >
        {optimisticState.liked ? (
          <GoHeartFill size={30} className="inline" />
        ) : (
          <GoHeart size={30} className="inline" />
        )}
      </div>
      <p className="font-stretch-ultra-expanded text-sm">
        {optimisticState.count}
      </p>
    </div>
  );
}
