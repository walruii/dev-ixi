import { Textarea } from "@/components/ui/textarea";

export default function EditView({
  setPost,
  post,
}: {
  setPost: React.Dispatch<
    React.SetStateAction<{
      title: string;
      content: string;
    }>
  >;
  post: {
    title: string;
    content: string;
  };
}) {
  return (
    <Textarea
      className={`h-full dark:text-white bg-white max-screen-md rounded-lg`}
      onChange={(e) =>
        setPost((prev) => ({ ...prev, content: e.target.value }))
      }
      value={post.content}
    />
  );
}
