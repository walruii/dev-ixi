"use client";
import { CiShare2 } from "react-icons/ci";
export default function ShareButton() {
  const handleClick = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied to clipboard");
  };
  return (
    <div
      className="flex flex-col justify-center items-center gap-2"
      onClick={handleClick}
    >
      <CiShare2 size={35} />
    </div>
  );
}
