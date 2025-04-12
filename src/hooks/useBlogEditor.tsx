import { AlertContext } from "@/context/alertContextProvider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { DEFAULT_MARKDOWN } from "@/models/defaultMarkDown";
import { createBlog } from "@/serveractions/blog";
import { Terminal } from "lucide-react";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";

export function usePostEditor() {
  const alertContext = useContext(AlertContext);

  const [post, setPost] = useState({
    title: "Your Title Here",
    content: DEFAULT_MARKDOWN,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem("post", JSON.stringify(post));
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [post]);

  useEffect(() => {
    const stored = localStorage.getItem("post");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.title && parsed.content) {
        setPost(parsed);
      }
    }
  }, []);

  const handlePost = async () => {
    if (isLoading) return;

    if (
      !post.title.trim() ||
      !post.content.trim() ||
      post.title === "Your Title Here"
    ) {
      alertContext?.setAlertDialog({
        variant: "destructive",
        title: "Error",
        description: "Please enter valid title and content",
      });
      return;
    }

    try {
      setIsLoading(true);
      const response = await createBlog(post);

      if (response.status === 201) {
        alertContext?.setAlert(
          <Alert variant="default">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>
              Post created successfully. You can view it
              <Link href={`/p/${response.id}`} passHref>
                <Button>Link to Post</Button>
              </Link>
            </AlertDescription>
          </Alert>
        );
        setPost({ title: "", content: "" });
      } else if (response.status === 401) {
        alertContext?.setAlertDialog({
          variant: "destructive",
          title: "Error",
          description: "Please sign in to create a post",
        });
      } else if (response.status === 409) {
        alertContext?.setAlertDialog({
          variant: "destructive",
          title: "Error",
          description: "Post with the same title already exists",
        });
      }
    } catch (error) {
      console.error("Error creating post:", error);
      alertContext?.setAlertDialog({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while creating the post.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    post,
    setPost,
    handlePost,
    isLoading,
  };
}
