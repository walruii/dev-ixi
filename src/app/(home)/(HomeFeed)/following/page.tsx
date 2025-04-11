import Loading from "@/app/loading";
import { Suspense } from "react";
import Feed from "../../feed";
import { FeedEnum } from "@/models/feedenum";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Trending() {
  const session = await auth();
  if (!session) {
    redirect("/signin");
  }
  return (
    <>
      <h1 className="font-bold text-xl font-stretch-extra-expanded px-5 mb-4">
        Following
      </h1>
      <Suspense fallback={<Loading />}>
        <Feed type={FeedEnum.FOLLOWING} userId={session.user.userId} />
      </Suspense>
    </>
  );
}
