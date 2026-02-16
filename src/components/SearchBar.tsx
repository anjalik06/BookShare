import React from "react";
import { Search } from "lucide-react";

interface Props {
  query: string;
  setQuery: (value: string) => void;
}

const SearchBar: React.FC<Props> = ({ query, setQuery }) => (
  <div className="relative w-full max-w-2xl mx-auto">
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search books..."
      className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition placeholder-gray-400"
    />
  </div>
);

export default SearchBar;
