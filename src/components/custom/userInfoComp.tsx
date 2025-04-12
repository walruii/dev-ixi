import Feed from "@/app/(main)/feed";
import FollowButton from "@/components/custom/followButton";
import Loading from "@/app/(main)/loading";
import { auth } from "@/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FeedEnum } from "@/models/feedenum";
import { TUserProfilePage } from "@/models/user";
import { Suspense } from "react";

export default async function UserInfoComp({
  user,
  isfollowed = null,
}: {
  user: TUserProfilePage;
  isfollowed?: boolean | null;
}) {
  const session = await auth();
  return (
    <div>
      <div className="bg-white dark:bg-zinc-900 rounded-xl w-full shadow p-5 flex flex-col gap-2 mb-4">
        <div className="flex gap-4 items-center">
          <Avatar className="w-16 h-16">
            <AvatarImage src={user.image} />
            <AvatarFallback>AN</AvatarFallback>
          </Avatar>
          <h1 className="text-3xl">{user.username}</h1>
          <h1>{user.followers} Followers</h1>
        </div>
        {isfollowed && (
          <FollowButton
            isfollowed={isfollowed}
            author_id={user.id}
            session={session}
          />
        )}
        <div className="border-t w-full pb-5 mt-5" />
        <div>{user.description}</div>
      </div>
      <h1 className="mb-4 text-xl font-bold font-stretch-extra-expanded px-5">
        Blogs
      </h1>
      <Suspense fallback={<Loading />}>
        <Feed type={FeedEnum.PROFILE} userId={user.id} />h
      </Suspense>
    </div>
  );
}
