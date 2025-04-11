import { COMPONENTS } from "@/lib/reactMarkdown";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function PreviewView({
  post,
}: {
  post: { title: string; content: string };
}) {
  return (
    <div
      className={`prose prose-sm p-4 overflow-y-scroll h-full w-full dark:bg-zinc-900 mx-auto rounded-lg max-w-screen-md bg-white
       dark:text-white dark:prose-headings:text-white dark:prose-blockquote:text-white dark:prose-a:text-white dark:prose-em:text-white dark:prose-strong:text-white dark:prose-li:text-white dark:prose-code:text-white dark:prose-ol:text-white dark:prose-ul:text-white`}
    >
      <Markdown remarkPlugins={[remarkGfm]} components={COMPONENTS}>
        {post.content}
      </Markdown>
    </div>
  );
}
