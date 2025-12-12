import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { User, LogOut, BookOpen, Trophy } from "lucide-react";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-6 py-3 flex items-center justify-between">
        
        <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition">
          BookShare
        </Link>

        <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-700">
          <Link to="/feed" className="flex items-center gap-1 hover:text-blue-600 transition">
            <BookOpen className="w-4 h-4" /> Feed
          </Link>
          
          <Link to="/leaderboard" className="flex items-center gap-1 hover:text-blue-600 transition">
            <Trophy className="w-4 h-4" /> Leaderboard
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => nav(`/profile/${user._id}`)}  // FIXED
                className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
              >
                <User className="w-4 h-4" />
                {user.name}
              </button>

              <button
                onClick={logout}
                className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link to="/login" className="px-3 py-1 rounded-lg hover:bg-gray-100 transition">
                Login
              </Link>
              <Link
                to="/register"
                className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
