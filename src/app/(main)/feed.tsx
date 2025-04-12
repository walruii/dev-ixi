"use client";
import { useState, useEffect, useRef } from "react";
import { TBlogFeed } from "@/models/blog";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { GoHeart } from "react-icons/go";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAllBlogs } from "@/serveractions/blog";
import { FeedEnum } from "@/models/feedenum";
import { TfiComment } from "react-icons/tfi";

function Post({
  post: {
    id,
    author_username,
    title,
    b_created_at,
    author_image,
    like_count,
    comment_count,
  },
}: {
  post: TBlogFeed;
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
            <div className="text-sm text-zinc-500 flex gap-2 ml-auto items-center justify-center">
              <GoHeart size={20} />
              <p>{like_count}</p>
              <TfiComment size={20} />
              <p>{comment_count}</p>
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

export default function Feed({
  type = FeedEnum.HOME,
  userId,
}: {
  type?: FeedEnum;
  userId?: number | string;
}) {
  const [posts, setPosts] = useState<TBlogFeed[]>([]);
  const [lastSeen, setLastSeen] = useState<{
    time: Date;
    blog_id: number;
    like_count: number;
  }>({
    time: new Date(),
    blog_id: 0,
    like_count: 0,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (loading || !hasMore) return;

    const fetchPosts = async () => {
      setLoading(true);
      try {
        let newPosts: TBlogFeed[] = [];
        if (type === FeedEnum.HOME) {
          newPosts = await getAllBlogs({ lastSeen });
        } else if (type === FeedEnum.FOLLOWING && userId) {
          newPosts = await getAllBlogs({
            lastSeen,
            type: FeedEnum.FOLLOWING,
            userId,
          });
        } else if (type === FeedEnum.TRENDING) {
          newPosts = await getAllBlogs({ lastSeen, type: FeedEnum.TRENDING });
        } else if (type === FeedEnum.PROFILE && userId) {
          newPosts = await getAllBlogs({
            lastSeen,
            type: FeedEnum.PROFILE,
            userId,
          });
        }
        setPosts((prev) => [...prev, ...newPosts]);
        setHasMore(newPosts.length > 0);

        if (newPosts.length > 0) {
          const lastBlog = newPosts[newPosts.length - 1];
          setLastSeen({
            time: lastBlog.b_created_at,
            blog_id: lastBlog.id,
            like_count: lastBlog.like_count,
          });
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
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
  }, [hasMore, loading, lastSeen, posts, type, userId]);

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
        <p className="text-center text-zinc-500 mb-20">
          No more posts available.
        </p>
      )}
    </>
  );
}
