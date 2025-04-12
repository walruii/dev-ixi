import Link from "next/link";
import { TfiComment } from "react-icons/tfi";

export default function CommentLink({ comments }: { comments: number }) {
  return (
    <div className="flex flex-col justify-center items-center gap-2">
      <Link
        href={"#comments"}
        className="flex justify-center items-center cursor-pointer"
      >
        <TfiComment size={30} />
      </Link>
      <p className="font-stretch-ultra-expanded text-sm">{comments}</p>
    </div>
  );
}
