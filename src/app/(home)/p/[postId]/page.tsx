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
    <article className="mt-5 dark:bg-zinc-900 rounded-md bg-white max-w-screen-md mx-auto p-4">
      <div className="pb-5 flex justify-between">
        <p className="text-zinc-400">Post by {post.author_username}</p>
        <p className="text-zinc-400">{post.created_at.toLocaleDateString()}</p>
      </div>
      <h1 className="w-full text-4xl sm:text-5xl font-bold">{post.title}</h1>
      <div className="border-t w-full pb-10" />
      <div
        className={`prose prose-sm overflow-y-scroll h-full w-full max-w-screen-md
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
