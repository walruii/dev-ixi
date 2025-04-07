"use client";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import Markdown from "react-markdown";
import gfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createPost } from "@/serveractions/blog";

export default function MD() {
  const [post, setPost] = useState<{ title: string; content: string }>({
    title: "Your Title Here",
    content: "# Hello World",
  });
  const [diffMode, setDiffMode] = useState<boolean>(false);
  const [isPreview, setIsPreview] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem("post", JSON.stringify(post));
    }, 2000);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [post]);

  useEffect(() => {
    const storedPost = localStorage.getItem("post");
    if (storedPost) {
      const localPost = JSON.parse(storedPost);
      if (localPost.title !== "" && localPost.content !== "") {
        setPost(JSON.parse(storedPost));
      }
    }
  }, []);

  const handlePost = async () => {
    if (isLoading) return;

    if (!post.title.trim() || !post.content.trim()) {
      alert("Please enter a title and content.");
      return;
    }

    try {
      setIsLoading(true);
      const response = await createPost(post);

      if (response.status === 201) {
        alert("Post created successfully.");
        setPost({ title: "", content: "" });
      } else {
        alert("Error creating post. Please try again.");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className=" max-w-screen-xl m-auto w-full h-full">
      <div className="mb-2 flex justify-between">
        <div>
          <Button
            variant={"default"}
            type="button"
            className="mr-2"
            onClick={() => setDiffMode(!diffMode)}
          >
            Diff Mode
          </Button>
          {diffMode && (
            <Button
              variant={"secondary"}
              onClick={() => setIsPreview(!isPreview)}
              type="button"
            >
              Preview Mode
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
        className="font-bold text-3xl py-8"
        value={post.title}
        onChange={(e) =>
          setPost((prev) => ({ ...prev, title: e.target.value }))
        }
      />
      {!diffMode ? (
        <div className="w-full h-full flex">
          <Textarea
            className={`h-full dark:text-white bg-zinc-100`}
            onChange={(e) =>
              setPost((prev) => ({ ...prev, content: e.target.value }))
            }
            value={post.content}
          />
          <div
            className={`prose prose-sm p-4 overflow-y-scroll h-full w-full dark:bg-zinc-900 mx-auto rounded-lg max-w-none bg-zinc-100
       dark:text-white dark:prose-headings:text-white dark:prose-blockquote:text-white dark:prose-a:text-white dark:prose-em:text-white dark:prose-strong:text-white dark:prose-li:text-white dark:prose-code:text-white dark:prose-ol:text-white dark:prose-ul:text-white`}
          >
            <Markdown
              remarkPlugins={[gfm]}
              components={{
                img: ({ src, alt }) =>
                  src ? <img src={src} alt={alt || "Image"} /> : null,
              }}
            >
              {post.content}
            </Markdown>
          </div>
        </div>
      ) : (
        <div className="w-full h-full flex">
          {isPreview ? (
            <Textarea
              className={`h-full dark:text-white bg-zinc-100`}
              onChange={(e) =>
                setPost((prev) => ({ ...prev, content: e.target.value }))
              }
              value={post.content}
            />
          ) : (
            <div
              className={`prose p-4 prose-sm overflow-y-scroll h-full w-full dark:bg-zinc-900 mx-auto rounded-lg max-w-none bg-zinc-100
       dark:text-white dark:prose-headings:text-white dark:prose-blockquote:text-white dark:prose-a:text-white dark:prose-em:text-white dark:prose-strong:text-white dark:prose-li:text-white dark:prose-code:text-white dark:prose-ol:text-white dark:prose-ul:text-white`}
            >
              <Markdown remarkPlugins={[gfm]}>{post.content}</Markdown>
            </div>
          )}
        </div>
      )}
    </form>
  );
}
