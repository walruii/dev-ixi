"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePostEditor } from "@/hooks/useBlogEditor";
import EditView from "./editView";
import { PreviewView } from "./previewView";

export default function MD() {
  const [viewMode, setViewMode] = useState<"compare" | "single">("compare");
  const [singleViewMode, setSingleViewMode] = useState<"edit" | "preview">(
    "edit"
  );
  const { post, setPost, handlePost, isLoading } = usePostEditor();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setViewMode("single");
      }
    };

    handleResize(); // Check on initial render
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <form className="max-w-screen-2xl m-auto w-full h-full">
      <div className="mb-2 flex justify-between">
        <div>
          <Button
            variant={"default"}
            type="button"
            className="mr-2"
            onClick={() =>
              setViewMode((prev) => (prev === "compare" ? "single" : "compare"))
            }
            disabled={viewMode === "single" && window.innerWidth < 768}
          >
            {viewMode === "compare" ? "Single View" : "Compare View"}
          </Button>
          {viewMode === "single" && (
            <Button
              variant={"secondary"}
              onClick={() =>
                setSingleViewMode((prev) =>
                  prev === "edit" ? "preview" : "edit"
                )
              }
              type="button"
            >
              {singleViewMode === "edit" ? "Preview" : "Edit"}
            </Button>
          )}
        </div>
        <Button
          variant={"outline"}
          disabled={isLoading}
          onClick={(e) => {
            e.preventDefault();
            handlePost();
          }}
        >
          {isLoading ? "Creating..." : "Create Post"}
        </Button>
      </div>
      <Input
        className="font-bold text-3xl py-8 bg-white"
        value={post.title}
        onChange={(e) =>
          setPost((prev) => ({ ...prev, title: e.target.value }))
        }
      />
      <div className="w-full h-full flex">
        {viewMode === "compare" ? (
          <>
            <div className="w-1/2 h-full pr-2">
              <EditView post={post} setPost={setPost} />
            </div>
            <div className="w-1/2 h-full pl-2">
              <PreviewView post={post} />
            </div>
          </>
        ) : (
          <div className="w-full h-full">
            {singleViewMode === "edit" ? (
              <EditView post={post} setPost={setPost} />
            ) : (
              <PreviewView post={post} />
            )}
          </div>
        )}
      </div>
    </form>
  );
}
