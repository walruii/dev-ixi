import { AlertContext } from "@/context/alertContextProvider";
import { dislikeComment, likeComment } from "@/serveractions/likeComment";
import { useRouter } from "next/navigation";
import { useContext, useOptimistic, useState, useTransition } from "react";

export function useLikeComment({
  commentId,
  likes,
  dislikes,
  has_liked,
  has_disliked,
}: {
  commentId: number;
  likes: number;
  has_liked: boolean;
  dislikes: number;
  has_disliked: boolean;
}) {
  const alertContext = useContext(AlertContext);

  const router = useRouter();
  const [likeCount, setLikeCount] = useState<number>(Number(likes));
  const [dislikeCount, setDislikeCount] = useState<number>(Number(dislikes));
  const [liked, setLiked] = useState<"liked" | "disliked" | "none">(
    has_liked ? "liked" : has_disliked ? "disliked" : "none"
  );
  const [isPending, startTransition] = useTransition();

  const [optimisticState, setOptimisticState] = useOptimistic(
    {
      likeCount,
      dislikeCount,
      liked,
    },
    (state, action: { liked: "liked" | "disliked" | "none" }) => {
      if (action.liked === "liked") {
        if (liked === "liked") {
          return {
            liked: "none" as const,
            likeCount: state.likeCount - 1,
            dislikeCount,
          };
        } else if (liked === "disliked") {
          return {
            liked: "liked" as const,
            likeCount: state.likeCount + 1,
            dislikeCount: state.dislikeCount - 1,
          };
        } else if (liked === "none") {
          return {
            liked: "liked" as const,
            likeCount: state.likeCount + 1,
            dislikeCount,
          };
        }
      } else if (action.liked === "disliked") {
        if (liked === "liked") {
          return {
            liked: "disliked" as const,
            likeCount: state.likeCount - 1,
            dislikeCount: state.dislikeCount + 1,
          };
        } else if (liked === "disliked") {
          return {
            liked: "none" as const,
            likeCount,
            dislikeCount: state.dislikeCount - 1,
          };
        } else if (liked === "none") {
          return {
            liked: "disliked" as const,
            likeCount,
            dislikeCount: state.dislikeCount + 1,
          };
        }
      }
      return state;
    }
  );

  const handleLike = async () => {
    if (isPending) return;
    startTransition(async () => {
      setOptimisticState({ liked: "liked" });
      const resp = await likeComment({ commentId });
      if (
        !(resp.status === 200 || resp.status === 201 || resp.status === 204)
      ) {
        if (resp.status === 401) {
          router.push("signin");
          return;
        }
        alertContext?.setAlertDialog({
          variant: "destructive",
          title: "Error",
          description: "Failed To Like",
        });
        return;
      }
      if (resp.status === 200) {
        setLikeCount((prev) => prev + 1);
        setDislikeCount((prev) => prev - 1);
        setLiked("liked");
      } else if (resp.status === 201) {
        setLikeCount((prev) => prev + 1);
        setLiked("liked");
      } else if (resp.status === 204) {
        setLikeCount((prev) => prev - 1);
        setLiked("none");
      }
    });
  };
  const handleDislike = async () => {
    if (isPending) return;
    setOptimisticState({ liked: "disliked" });
    const resp = await dislikeComment({ commentId });
    if (!(resp.status === 200 || resp.status === 201 || resp.status === 204)) {
      if (resp.status === 401) {
        router.push("signin");
        return;
      }
      alertContext?.setAlertDialog({
        variant: "destructive",
        title: "Error",
        description: "Failed To Like",
      });
      return;
    }
    if (resp.status === 200) {
      setDislikeCount((prev) => prev + 1);
      setLikeCount((prev) => prev - 1);
      setLiked("disliked");
    } else if (resp.status === 201) {
      setDislikeCount((prev) => prev + 1);
      setLiked("disliked");
    } else if (resp.status === 204) {
      setDislikeCount((prev) => prev - 1);
      setLiked("none");
    }
  };
  return {
    optimisticState,
    handleLike,
    handleDislike,
  };
}
