export default function LeftMenu({ className }: { className?: string }) {
  return (
    <div className={` ${className}`}>
      <div className="bg-white dark:bg-zinc-900 rounded-xl w-full shadow p-5">
        <h1>Home</h1>
        <div className="border-b my-2" />
        <h1>Newest First</h1>
        <div className="border-b my-2" />
        <h1>Following</h1>
      </div>
    </div>
  );
}
