import { getPostById } from "@/serveractions/blog";
import gfm from "remark-gfm";
import Markdown from "react-markdown";
import { Suspense } from "react";
import Loading from "@/app/loading";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import PostLeftMenu from "./postleftMenu";
import PostRightMenu from "./postrightMenu";

async function PostPageAsync({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const { postId } = await params;
  const blog = await getPostById(postId);
  if (!blog) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <h1 className="text-3xl font-bold">Post Not Found</h1>
      </div>
    );
  }
  return (
    <div className="flex my-8 px-4 max-w-screen-2xl mx-auto relative">
      <div className="hidden sm:block w-48 shrink-0 ml-auto" />
      <PostLeftMenu
        blog={blog}
        className="hidden sm:flex w-48 shrink-0 ml-auto"
      />
      <article className="dark:bg-zinc-900 rounded-xl bg-white md:px-15 p-5 md:p-10 sm:mx-4 px-6 lg:px-8 w-full">
        <div className="pb-5 flex justify-between">
          <div className="flex gap-2 justify-center items-center">
            <Avatar className="w-10 h-10">
              <AvatarImage src={blog.author_image} alt="User Ima:e" />
              <AvatarFallback>AN</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p className="text-zinc-400">Post by {blog.author_username}</p>
              <p className="text-zinc-400 font-stretch-ultra-expanded">
                {blog.b_created_at.toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
        <h1 className="w-full text-4xl sm:text-5xl font-bold">{blog.title}</h1>
        <div className="border-t w-full pb-5 mt-5" />
        <div
          className={`prose overflow-y-scroll h-full w-full max-w-screen-lg
       dark:text-white dark:prose-headings:text-white dark:prose-blockquote:text-white dark:prose-a:text-white dark:prose-em:text-white dark:prose-strong:text-white dark:prose-li:text-white dark:prose-code:text-white dark:prose-ol:text-white dark:prose-ul:text-white`}
        >
          <Markdown
            remarkPlugins={[gfm]}
            components={{
              img: ({ src, alt }) =>
                src ? (
                  <img
                    src={src}
                    alt={alt || "Image"}
                    className="rounded-lg mx-auto"
                  />
                ) : null,
            }}
          >
            {blog.content}
          </Markdown>
        </div>
      </article>
      <PostRightMenu
        blog={blog}
        className="hidden lg:block w-150 grow-0 mr-auto"
      />
    </div>
  );
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  return (
    <>
      <Suspense fallback={<Loading />}>
        <PostPageAsync params={params} />
      </Suspense>
    </>
  );
}
