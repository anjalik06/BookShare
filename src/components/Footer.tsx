import React from "react";
import { Github, Twitter, Instagram } from "lucide-react";

const Footer: React.FC = () => (
  <footer className="bg-white/70 backdrop-blur-md border-t border-gray-200 shadow-inner py-6 mt-8">
    <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
      <p className="text-gray-600 text-sm">
        © {new Date().getFullYear()} BookShare
      </p>

      <div className="flex gap-4">
        <a href="#" className="text-gray-500 hover:text-gray-800 transition">
          <Github className="w-5 h-5" />
        </a>
        <a href="#" className="text-blue-500 hover:text-blue-700 transition">
          <Twitter className="w-5 h-5" />
        </a>
        <a href="#" className="text-pink-500 hover:text-pink-600 transition">
          <Instagram className="w-5 h-5" />
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;
