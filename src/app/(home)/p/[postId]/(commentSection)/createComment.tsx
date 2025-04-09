"use client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createComment } from "@/serveractions/comment";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateComment({ blogId }: { blogId: number }) {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const handleSubmit = async () => {
    if (loading) return;
    setLoading(true);
    if (content.trim() === "") {
      alert("Comment cannot be empty");
      setLoading(false);
      return;
    }
    const resp = await createComment({ blogId, content });
    if (resp.status !== 201) {
      if (resp.status === 401) {
        router.push("/signin");
        return;
      }
      alert("Failed to create comment");
      setLoading(false);
      return;
    }
    alert("Comment created successfully");
    setContent(""); // Clear the textarea after submission
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
