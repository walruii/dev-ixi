import { getAllBlogs } from "@/serveractions/blog";
import Footer from "../../../components/custom/footer";
import { FeedEnum } from "@/models/feedenum";
import { TBlogFeed } from "@/models/blog";
import Link from "next/link";
import { Suspense } from "react";
import Loading from "../loading";

function Trending({ blog }: { blog: TBlogFeed }) {
  return (
    <Link href={`/p/${blog.id}`} passHref>
      <div className="border-b my-2" />
      <h1 className="mb-1">{blog.title}</h1>
      <div className="flex text-zinc-500 justify-between">
        <p>{blog.b_created_at.toLocaleDateString()}</p>
        <p>-{blog.author_username}</p>
      </div>
    </Link>
  );
}

async function TrendingBlogs() {
  const blogs = await getAllBlogs({
    lastSeen: { time: new Date(), blog_id: 0 },
    type: FeedEnum.TRENDING,
  });
  return (
    <>
      {blogs.map((blog) => (
        <Trending key={blog.id} blog={blog} />
      ))}
    </>
  );
}

export default function RightMenu({ className }: { className?: string }) {
  return (
    <div className={` ${className}`}>
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow p-5">
        <h1 className="font-bold">Trending Discussions</h1>
        <Suspense fallback={<Loading />}>
          <TrendingBlogs />
        </Suspense>
      </div>
      <Footer />
    </div>
  );
}
