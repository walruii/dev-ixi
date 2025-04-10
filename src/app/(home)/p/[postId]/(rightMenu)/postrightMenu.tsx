import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TBlog } from "@/models/blog";
import Footer from "../../../footer";
import FollowButton from "./followButton";
import { checkFollowed } from "@/serveractions/follow";
import { auth } from "@/auth";

export default async function PostRightMenu({
  className,
  blog,
}: {
  blog: TBlog;
  className?: string;
}) {
  const { author_image, author_username, author_description } = blog;
  const isfollowed = await checkFollowed({ userId: blog.author_id });
  const session = await auth();

  return (
    <div className={` ${className}`}>
      <div className="bg-white dark:bg-zinc-900 rounded-xl w-full shadow p-5 flex flex-col gap-2">
        <div className="flex gap-4 items-center mb-5">
          <Avatar className="w-16 h-16">
            <AvatarImage src={author_image} />
            <AvatarFallback>AN</AvatarFallback>
          </Avatar>
          <h1 className="text-3xl">{author_username}</h1>
        </div>
        <FollowButton
          isfollowed={isfollowed}
          author_id={blog.author_id}
          session={session}
        />
        <div className="border-t w-full pb-5 mt-5" />
        {author_description ? (
          <div>{author_description}</div>
        ) : (
          <div>Hello!</div>
        )}
      </div>
      <Footer />
    </div>
  );
}
