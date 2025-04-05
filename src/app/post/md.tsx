"use client";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import Markdown from "react-markdown";
import gfm from "remark-gfm";
import { Button } from "@/components/ui/button";

export default function MD() {
  const [markdown, setMarkdown] = useState<string>("# Hello World");
  const [diffMode, setDiffMode] = useState<boolean>(false);
  const [isPreview, setIsPreview] = useState<boolean>(false);
  return (
    <>
      <Button variant={"default"} onClick={() => setDiffMode(!diffMode)}>
        Diff Mode
      </Button>
      {diffMode && (
        <Button variant={"secondary"} onClick={() => setIsPreview(!isPreview)}>
          Preview Mode
        </Button>
      )}
      {!diffMode ? (
        <div className="w-full h-full flex">
          <Textarea
            className={`h-full dark:text-white bg-zinc-100`}
            onChange={(e) => setMarkdown(e.target.value)}
            value={markdown}
          />
          <div
            className={`prose prose-lg p-4 overflow-y-scroll h-full w-full dark:bg-zinc-900 mx-auto rounded-lg max-w-none bg-zinc-100
       dark:text-white dark:prose-headings:text-white dark:prose-blockquote:text-white dark:prose-a:text-white dark:prose-em:text-white dark:prose-strong:text-white dark:prose-li:text-white dark:prose-code:text-white dark:prose-ol:text-white dark:prose-ul:text-white`}
          >
            <Markdown remarkPlugins={[gfm]}>{markdown}</Markdown>
          </div>
        </div>
      ) : (
        <div className="w-full h-full flex">
          {isPreview ? (
            <Textarea
              className={`h-full dark:text-white bg-zinc-100`}
              onChange={(e) => setMarkdown(e.target.value)}
              value={markdown}
            />
          ) : (
            <div
              className={`prose prose-lg p-4 overflow-y-scroll h-full w-full dark:bg-zinc-900 mx-auto rounded-lg max-w-none bg-zinc-100
       dark:text-white dark:prose-headings:text-white dark:prose-blockquote:text-white dark:prose-a:text-white dark:prose-em:text-white dark:prose-strong:text-white dark:prose-li:text-white dark:prose-code:text-white dark:prose-ol:text-white dark:prose-ul:text-white`}
            >
              <Markdown remarkPlugins={[gfm]}>{markdown}</Markdown>
            </div>
          )}
        </div>
      )}
    </>
  );
}
