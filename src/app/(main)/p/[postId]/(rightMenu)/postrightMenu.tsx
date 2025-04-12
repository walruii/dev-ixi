import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TBlogPage } from "@/models/blog";
import Footer from "@/components/custom/footer";
import { auth } from "@/auth";
import Link from "next/link";
import FollowButton from "@/components/custom/followButton";

export default async function PostRightMenu({
  className,
  blog,
}: {
  blog: TBlogPage;
  className?: string;
}) {
  const { author_image, author_username, author_description, author_id } = blog;
  const session = await auth();

  return (
    <div className={` ${className}`}>
      <div className="bg-white dark:bg-zinc-900 rounded-xl w-full shadow p-5 flex flex-col gap-2">
        <Link href={`/u/${author_id}`} className="flex gap-4 items-center">
          <Avatar className="w-16 h-16">
            <AvatarImage src={author_image} />
            <AvatarFallback>AN</AvatarFallback>
          </Avatar>
          <h1 className="text-3xl">{author_username}</h1>
        </Link>
        <FollowButton
          isfollowed={blog.is_following}
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
