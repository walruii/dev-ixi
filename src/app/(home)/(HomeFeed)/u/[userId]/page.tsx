import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { checkFollowed } from "@/serveractions/follow";
import { auth } from "@/auth";
import { getUser } from "@/serveractions/user";
import { TUserProfilePage } from "@/models/user";
import FollowButton from "@/app/(home)/p/[postId]/(rightMenu)/followButton";
import Feed from "@/app/(home)/feed";
import { FeedEnum } from "@/models/feedenum";
import { Suspense } from "react";
import Loading from "@/app/loading";

export default async function UserPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const user: TUserProfilePage | null = await getUser({ userId });
  const isfollowed = await checkFollowed({ userId });
  const session = await auth();
  if (!user) {
    return (
      <div>
        <div className="bg-white dark:bg-zinc-900 rounded-xl w-full shadow p-5 flex flex-col gap-2">
          <h1 className="text-3xl">User not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white dark:bg-zinc-900 rounded-xl w-full shadow p-5 flex flex-col gap-2 mb-4">
        <div className="flex gap-4 items-center mb-5">
          <Avatar className="w-16 h-16">
            <AvatarImage src={user.image} />
            <AvatarFallback>AN</AvatarFallback>
          </Avatar>
          <h1 className="text-3xl">{user.username}</h1>
          <h1>{user.followers} Followers</h1>
        </div>
        <FollowButton
          isfollowed={isfollowed}
          author_id={userId}
          session={session}
        />
        <div className="border-t w-full pb-5 mt-5" />
        <div>{user.description}</div>
      </div>
      <h1 className="mb-4 text-xl font-bold font-stretch-extra-expanded px-5">
        Blogs
      </h1>
      <Suspense fallback={<Loading />}>
        <Feed type={FeedEnum.PROFILE} userId={user.id} />
      </Suspense>
    </div>
  );
}
