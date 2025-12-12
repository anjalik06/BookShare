import React, { useState, useEffect, useMemo } from "react";
import type { Book } from "../types/book";
import BookList from "../components/BookList";
import SearchBar from "../components/SearchBar";
import { getBooks } from "../api/books";

const Home: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      const data = await getBooks();
      setBooks(data);
      setLoading(false);
    };
    fetchBooks();
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return books.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.genre.toLowerCase().includes(q)
    );
  }, [books, query]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col items-center py-10 px-4">
      <div className="text-center mb-10 max-w-2xl">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-3">
          Discover & Share <span className="text-blue-600">Books</span>
        </h1>
        <p className="text-gray-600 text-lg">
          Find your next great read in our community-powered library.
        </p>
      </div>

      <div className="w-full max-w-2xl bg-white/70 backdrop-blur-md shadow-md rounded-2xl p-5 mb-8 border border-gray-100">
        <SearchBar query={query} setQuery={setQuery} />
      </div>

      <div className="w-full max-w-4xl">
        {loading ? (
          <p className="text-center text-gray-500 py-10">Loading books...</p>
        ) : filtered.length > 0 ? (
          <BookList books={filtered} />
        ) : (
          <div className="text-center text-gray-500 py-10 bg-white/70 rounded-xl shadow-sm backdrop-blur-md">
            No books found matching <span className="font-semibold text-gray-700">“{query}”</span>.
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
