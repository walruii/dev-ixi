import Post from "./post";

const testSug = [
  {
    id: 1,
    author: "TestAuthor1",
    title: "Test Title 1",
    content: "Test Content 1",
    date: new Date().toLocaleDateString(),
  },
  {
    id: 2,
    author: "TestAuthor2",
    title: "TestTitle2",
    content: "Test Content 2",
    date: new Date().toLocaleDateString(),
  },
  {
    id: 3,
    author: "TestAuthor3",
    title: "TestTitle3",
    content: "TestContent3",
    date: new Date().toLocaleDateString(),
  },
  {
    id: 4,
    author: "TestAuthor3",
    title: "TestTitle3",
    content: "Test Content 3",
    date: new Date().toLocaleDateString(),
  },
  {
    id: 5,
    author: "TestAuthor3",
    title: "TestTitle3",
    content: "TestContent3",
    date: new Date().toLocaleDateString(),
  },
  {
    id: 6,
    author: "TestAuthor3",
    title: "TestTitle3",
    content: "TestContent3",
    date: new Date().toLocaleDateString(),
  },
];
export default function Feed() {
  const posts = testSug;
  // const posts = await getPosts();
  return (
    <div className="max-w-[800px] mx-auto flex-col items-center justify-center py-4 px-4 sm:px-6 lg:px-8">
      <div className="text-2xl font-bold mb-5">Home Feed</div>
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
}
