import BottomMenu from "./(nav)/BottomMenu";
import Navbar from "./(nav)/navbar";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
      <BottomMenu />
    </>
  );
}
