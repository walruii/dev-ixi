import Footer from "../../../components/custom/footer";

export default function RightProfileMenu({
  className,
}: {
  className?: string;
}) {
  return (
    <div className={` ${className}`}>
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow p-5">
        <h1 className="font-bold">You can edit your profile here</h1>
      </div>
      <Footer />
    </div>
  );
}
