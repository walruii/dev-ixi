import LeftProfileMenu from "./leftProfileMenu";
import RightProfileMenu from "./rightProfileMenu";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="my-8 max-w-screen-2xl mx-auto flex px-4">
      <LeftProfileMenu className="hidden sm:block w-48 shrink-0 ml-auto" />
      <section className="flex-col items-center justify-center w-full sm:mx-4">
        {children}
      </section>
      <RightProfileMenu className="hidden lg:block w-150 grow-0 mr-auto" />
    </main>
  );
}
