import { getPostById } from "@/serveractions/blog";
import gfm from "remark-gfm";
import Markdown from "react-markdown";
import { Suspense } from "react";
import Loading from "@/app/loading";

async function PostPageAsync({
  params,
}: {
  params: Promise<{ username: string; postId: string }>;
}) {
  const { postId } = await params;
  const post = await getPostById(postId);
  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <h1 className="text-3xl font-bold">Post Not Found</h1>
      </div>
    );
  }
  return (
    <article>
      <div
        className={`prose prose-sm max-w-screen-md p-4 overflow-y-scroll h-full w-full dark:bg-zinc-900 mx-auto rounded-lg bg-zinc-100
       dark:text-white dark:prose-headings:text-white dark:prose-blockquote:text-white dark:prose-a:text-white dark:prose-em:text-white dark:prose-strong:text-white dark:prose-li:text-white dark:prose-code:text-white dark:prose-ol:text-white dark:prose-ul:text-white`}
      >
        <h1 className="">{post.author_username}</h1>
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
    </article>
  );
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ username: string; postId: string }>;
}) {
  return (
    <>
      <Suspense fallback={<Loading />}>
        <PostPageAsync params={params} />
      </Suspense>
    </>
  );
}
