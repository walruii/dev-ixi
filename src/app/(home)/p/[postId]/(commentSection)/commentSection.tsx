import CreateComment from "./createComment";

export default function CommentSection({ className }: { className?: string }) {
  return (
    <div id="comments" className={` ${className}`}>
      <h1 className="font-bold text-3xl">Discussion</h1>
      <CreateComment />
    </div>
  );
}
