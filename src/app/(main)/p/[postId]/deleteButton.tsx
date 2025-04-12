"use client";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { useContext, useState } from "react";
import { deleteBlog } from "@/serveractions/blog";
import { redirect, useRouter } from "next/navigation";
import { AlertContext } from "@/context/alertContextProvider";
import { deleteComment } from "@/serveractions/comment";

export default function DeleteButton({
  id,
  mode,
}: {
  id: string | number;
  mode: "comment" | "blog";
}) {
  const [loading, setLoading] = useState(false);
  const alertContext = useContext(AlertContext);
  const router = useRouter();
  const handleClick = async () => {
    setLoading(true);
    if (mode === "blog") {
      const response = await deleteBlog({ blogId: id });
      if (response.status !== 204) {
        setLoading(false);
        return;
      }
      alertContext?.setAlertDialog({
        variant: "default",
        title: "Post Deleted Successfully",
        description: "You will be redirected to Home page now",
      });
      redirect("/");
    } else {
      const response = await deleteComment({ commentId: id });
      if (response.status !== 204) {
        setLoading(false);
        return;
      }
      alertContext?.setAlertDialog({
        variant: "default",
        title: "Comment Deleted Successfully",
        description: "you can not reverse it now",
      });
      router.refresh();
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild className="">
        <Button variant="default">{loading ? "DELETING..." : "DELETE"}</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to DELETE your {mode}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your{" "}
            {mode}.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleClick}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
