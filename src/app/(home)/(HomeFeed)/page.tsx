import { Suspense } from "react";
import Feed from "../feed";
import Loading from "../../loading";

export default async function Home() {
  return (
    <>
      <h1 className="font-bold text-xl font-stretch-extra-expanded px-5 mb-4">
        HOME
      </h1>
      <Suspense fallback={<Loading />}>
        <Feed />
      </Suspense>
    </>
  );
}
