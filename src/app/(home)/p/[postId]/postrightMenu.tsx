import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { TBlog } from "@/models/blog";
import Footer from "../../footer";

export default function PostRightMenu({
  className,
  blog,
}: {
  blog: TBlog;
  className?: string;
}) {
  const { author_image, author_username, author_description } = blog;
  return (
    <div className={` ${className}`}>
      <div className="bg-white dark:bg-zinc-900 rounded-xl w-full shadow p-5 flex flex-col gap-2">
        <div className="flex gap-4 items-center">
          <Avatar className="w-16 h-16">
            <AvatarImage src={author_image} />
            <AvatarFallback>AN</AvatarFallback>
          </Avatar>
          <h1 className="text-3xl">{author_username}</h1>
        </div>
        <Button variant={"default"}>Follow</Button>
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
