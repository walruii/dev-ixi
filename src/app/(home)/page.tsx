import { Suspense } from "react";
import Feed from "./feed";
import Loading from "../loading";
import RightMenu from "./rightMenu";
import LeftMenu from "./leftMenu";

export default function Home() {
  return (
    <main className="my-8 max-w-screen-2xl mx-auto flex px-4">
      <LeftMenu className="hidden sm:block w-48 shrink-0 ml-auto" />
      <section className="flex-col items-center justify-center w-full sm:mx-4">
        <Suspense fallback={<Loading />}>
          <Feed />
        </Suspense>
      </section>
      <RightMenu className="hidden lg:block w-150 grow-0 mr-auto" />
    </main>
  );
}
