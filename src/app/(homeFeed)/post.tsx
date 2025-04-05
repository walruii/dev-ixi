import { Card, CardContent, CardDescription } from "@/components/ui/card";
import Link from "next/link";

export default function Post({
  post,
}: {
  post: {
    id: number;
    author: string;
    title: string;
    content: string;
    date: string;
  };
}) {
  const { author, title, date } = post;
  return (
    <Link href={`/u/${author}/post/${post.id}`} passHref>
      <Card className="w-full my-3 border-0">
        <CardContent>
          <CardDescription className="text-base">{author}</CardDescription>
          <p className="text-xs text-zinc-500">{date}</p>
          <h1 className="text-3xl font-bold">{title}</h1>
        </CardContent>
      </Card>
    </Link>
  );
}
