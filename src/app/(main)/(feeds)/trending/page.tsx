import Loading from "@/app/(main)/loading";
import { Suspense } from "react";
import Feed from "../../feed";
import { FeedEnum } from "@/models/feedenum";

export default function Treanding() {
  return (
    <>
      <h1 className="font-bold text-xl font-stretch-extra-expanded px-5 mb-4">
        Trending
      </h1>
      <Suspense fallback={<Loading />}>
        <Feed type={FeedEnum.TRENDING} />
      </Suspense>
    </>
  );
}
