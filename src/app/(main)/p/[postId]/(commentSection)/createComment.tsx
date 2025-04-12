"use client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useComment } from "@/hooks/useComment";

export default function CreateComment({ blogId }: { blogId: number }) {
  const { content, setContent, handleSubmit, loading } = useComment({ blogId });
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
