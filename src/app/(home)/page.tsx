import { Suspense } from "react";
import Feed from "./feed";
import Loading from "../loading";

export default function Home() {
  return (
    <section className="max-w-[800px] mx-auto flex-col items-center justify-center py-4 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold mb-5">Home Feed</h1>
      <Suspense fallback={<Loading />}>
        <Feed />
      </Suspense>
    </section>
  );
}
