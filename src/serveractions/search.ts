"use server";

import { neon } from "@neondatabase/serverless";

// TODO
export const searchSuggestions = async (query: string) => {
  if (!query) {
    return [];
  }
  try {
    const sql = neon(process.env.DATABASE_URL as string);
    const response =
      await sql`SELECT * FROM POST WHERE title ILIKE ${`%${query}%`} LIMIT 5`;
    if (response.length === 0) {
      return [];
    }
    const suggestions = response.map((suggestion) => ({
      id: suggestion.id,
      author: suggestion.author,
      title: suggestion.title,
      content: suggestion.content,
      date: suggestion.date.toLocaleDateString(),
    }));
    return suggestions;
  } catch (error) {
    console.error("Error fetching search suggestions:", error);
    return [];
  }
};
