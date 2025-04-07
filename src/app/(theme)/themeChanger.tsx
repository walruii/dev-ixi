"use client";
import { useState, useEffect } from "react";
import { CiSun } from "react-icons/ci";
import { FaRegMoon } from "react-icons/fa";

export default function ThemeChanger() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    const lTheme = localStorage.getItem("theme");
    if (lTheme) {
      setTheme(lTheme);
    }
  }, []);

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <button onClick={toggleTheme} className="flex items-center justify-center">
      {theme === "light" ? <CiSun size={30} /> : <FaRegMoon size={25} />}
    </button>
  );
}
