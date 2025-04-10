"use client";
import { AlertContext } from "@/app/(alerts)/alertProvider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createComment } from "@/serveractions/comment";
import { Terminal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";

export default function CreateComment({ blogId }: { blogId: number }) {
  const alertContext = useContext(AlertContext);
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const handleSubmit = async () => {
    if (loading) return;
    setLoading(true);
    if (content.trim() === "") {
      alertContext?.setAlert(
        <Alert variant={"destructive"}>
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Comment cannot be empty!</AlertDescription>
        </Alert>
      );
      setLoading(false);
      return;
    }
    const resp = await createComment({ blogId, content });
    if (resp.status !== 201) {
      if (resp.status === 401) {
        router.push("/signin");
        return;
      }
      alertContext?.setAlert(
        <Alert variant={"destructive"}>
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Failed To Comment</AlertDescription>
        </Alert>
      );
      setLoading(false);
      return;
    }
    alertContext?.setAlert(
      <Alert variant={"default"}>
        <Terminal className="h-4 w-4" />
        <AlertTitle>Success</AlertTitle>
        <AlertDescription>Comment successfully</AlertDescription>
      </Alert>
    );
    setContent(""); // Clear the textarea after submission
    router.refresh();
    setLoading(false);
  };
  return (
    <div className="flex flex-col gap-2">
      <div className="border-b my-2" />
      <Textarea
        value={content}
        placeholder="Write your comment here..."
        className="mb-2"
        onChange={(e) => setContent(e.target.value)}
      />
      <Button
        onClick={handleSubmit}
        variant={"default"}
        disabled={loading}
        className={`${loading ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {loading ? "Submitting..." : "Submit"}
      </Button>
    </div>
  );
}
