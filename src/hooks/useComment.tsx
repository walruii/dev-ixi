import { AlertContext } from "@/context/alertContextProvider";
import { createComment } from "@/serveractions/comment";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";

export function useComment({ blogId }: { blogId: number }) {
  const alertContext = useContext(AlertContext);
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const handleSubmit = async () => {
    if (loading) return;
    setLoading(true);
    if (content.trim() === "") {
      alertContext?.setAlertDialog({
        variant: "destructive",
        title: "Error",
        description: "Comment cannot be empty!",
      });
      setLoading(false);
      return;
    }
    const resp = await createComment({ blogId, content });
    if (resp.status !== 201) {
      if (resp.status === 401) {
        router.push("/signin");
        return;
      }
      alertContext?.setAlertDialog({
        variant: "destructive",
        title: "Error",
        description: "Failed To Comment",
      });
      setLoading(false);
      return;
    }
    alertContext?.setAlertSidebar({
      variant: "default",
      title: "Success",
      description: "Comment successfully",
    });
    setContent(""); // Clear the textarea after submission
    router.refresh();
    setLoading(false);
  };
  return {
    content,
    setContent,
    loading,
    handleSubmit,
  };
}
