"use client";
import { Input } from "@/components/ui/input";
import { searchSuggestions } from "@/serveractions/search";
import { SearchIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Search() {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<
    {
      id: number;
      author: string;
      title: string;
      content: string;
      date: string;
    }[]
  >([]);

  const handleSearch = async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }
    const results = await searchSuggestions(query);
    setSuggestions(results);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch(search);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [search]);

  return (
    <div>
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <div className="relative">
        <SearchIcon className="absolute top-2 left-2 text-gray-400 h-5" />
      </div>
      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        type="search"
        placeholder="Search..."
        className="w-full max-w-xs pl-10"
        id="search"
        name="search"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="none"
      />
      {suggestions.length > 0 && (
        <ul className="mt-2 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-gray-900 rounded shadow-md max-w-xs absolute z-10 w-full">
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.id}
              className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-zinc-600 cursor-pointer border-b"
            >
              <Link
                href={`/p/${suggestion.id}`}
                className="block"
                onClick={() => {
                  setSearch("");
                  setSuggestions([]);
                }}
              >
                <p className="text-sm text-gray-500">{suggestion.author}</p>
                <strong>{suggestion.title}</strong>
                <p className="text-sm text-gray-500">{suggestion.date}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
