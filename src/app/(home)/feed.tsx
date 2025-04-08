"use client";
import { useState, useEffect, useRef } from "react";
import { getAllPosts } from "@/serveractions/blog";
import { TBlog } from "@/models/blog";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function Post({
  post: { id, author_username, title, b_created_at, author_image },
}: {
  post: TBlog;
}) {
  return (
    <Link href={`/p/${id}`} passHref>
      <Card className="w-full mb-4 border-0">
        <CardContent>
          <CardDescription className="text-base flex items-center gap-2">
            <Avatar>
              <AvatarImage src={author_image}></AvatarImage>
              <AvatarFallback>AN</AvatarFallback>
            </Avatar>
            <div>
              {author_username}
              <p className="text-xs text-zinc-500">
                {b_created_at.toLocaleDateString()}
              </p>
            </div>
          </CardDescription>
          <CardTitle className="text-3xl font-bold pl-10 pt-2">
            {title}
          </CardTitle>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function Feed() {
  const [posts, setPosts] = useState<TBlog[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (loading || !hasMore) return;
    const fetchPosts = async () => {
      console.log(page);
      setLoading(true);
      const newPosts = await getAllPosts({ page }); // Update `getAllPosts` to accept a page parameter
      setPosts((prev) => [...prev, ...newPosts]);
      setHasMore(newPosts.length > 0);
      setLoading(false);
    };
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage((prev) => prev + 1);
          fetchPosts();
        }
      },
      { threshold: 1.0 }
    );

    const currentRef = observerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasMore, loading, page]);

  return (
    <>
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
      {loading && (
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-500"></div>
        </div>
      )}
      <div ref={observerRef} className="h-10" />
      {!hasMore && !loading && (
        <p className="text-center text-zinc-500">No more posts available.</p>
      )}
    </>
  );
}
