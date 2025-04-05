"use client";

import { useEffect, useState } from "react";

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState<boolean>(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let savedTheme = localStorage.getItem("theme");
    if (!savedTheme) {
      savedTheme = "dark";
      localStorage.setItem("theme", savedTheme);
    }
    if (savedTheme) {
      document.body.classList.toggle("dark", savedTheme === "dark");
    } else {
      document.body.classList.toggle("dark", true);
    }
  });

  if (!mounted) return null;

  return <>{children}</>;
}
