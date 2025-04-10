import Footer from "./footer";

export default function RightMenu({ className }: { className?: string }) {
  return (
    <div className={` ${className}`}>
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow p-5">
        <h1 className="font-bold">Treading Discussions</h1>
        <div className="border-b my-2" />
        <h1>AI Revolution in Tech</h1>
        <div className="border-b my-2" />
        <h1>SpaceX&apos;s Latest Mission</h1>
        <div className="border-b my-2" />
        <h1>Climate Change Innovations</h1>
        <div className="border-b my-2" />
        <h1>Breakthrough in Quantum Computing</h1>
        <div className="border-b my-2" />
        <h1>Top Programming Languages of 2023</h1>
        <div className="border-b my-2" />
        <h1>Advancements in Electric Vehicles</h1>
        <div className="border-b my-2" />
        <h1>Cybersecurity Trends to Watch</h1>
        <div className="border-b my-2" />
        <h1>Metaverse: Hype or Reality?</h1>
        <div className="border-b my-2" />
        <h1>Healthcare Tech Innovations</h1>
        <div className="border-b my-2" />
        <h1>Future of Remote Work</h1>
      </div>
      <Footer />
    </div>
  );
}
