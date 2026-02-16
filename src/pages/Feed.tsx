import React, { useState } from "react";
import { motion } from "framer-motion";
import { Heart, MessageCircle } from "lucide-react";
import CommunitySidebar from "../components/CommunitySidebar";



const initialPosts = [
  {
    id: 1,
    communityId: 1,
    user: "Priya",
    content: "I just finished reading Sorcerer's Stone! Hogwarts is magical ✨",
    image: "",
    time: "2h ago",
    likes: 3,
    comments: ["Me too!", "Gryffindor forever!"],
  },
  {
    id: 2,
    communityId: 1,
    user: "Ravi",
    content: "The Triwizard Tournament was thrilling! 🏆",
    image: "https://via.placeholder.com/400x250?text=Triwizard+Tournament",
    time: "1d ago",
    likes: 5,
    comments: [],
  },
  {
    id: 3,
    communityId: 2,
    user: "Anjali",
    content: "Middle Earth adventures are amazing! 🗺️",
    image: "https://via.placeholder.com/400x250?text=Fellowship+of+the+Ring",
    time: "3d ago",
    likes: 8,
    comments: ["Sam is the real hero!"],
  },
];

const Feed: React.FC = () => {
  const [posts, setPosts] = useState(initialPosts);

  const likePost = (id: number) => {
    setPosts(posts.map((p) => (p.id === id ? { ...p, likes: p.likes + 1 } : p)));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-10 px-4 flex gap-6 justify-center">
      {/* Sidebar */}
      <CommunitySidebar  />

      {/* Feed */}
      <motion.div className="flex-1 flex flex-col gap-6 max-w-3xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Feed</h2>

        {posts.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl shadow-md overflow-hidden"
          >
            <div className="flex items-center gap-3 p-3">
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center font-semibold text-gray-700">
                {p.user.charAt(0)}
              </div>
              <p className="font-medium text-gray-800">{p.user}</p>
            </div>

            {p.image && <img src={p.image} alt={p.content} className="w-full object-cover" />}

            <div className="px-3 pb-3">
              <p className="text-gray-800 mt-1">{p.content}</p>
              <p className="text-xs text-gray-400 mt-1">{p.time}</p>

              <div className="flex gap-4 mt-2 text-sm text-gray-500">
                <button
                  onClick={() => likePost(p.id)}
                  className="flex items-center gap-1 hover:text-red-500 transition"
                >
                  <Heart className="w-4 h-4" /> {p.likes}
                </button>
                <div className="flex items-center gap-1 hover:text-blue-500 transition">
                  <MessageCircle className="w-4 h-4" /> {p.comments.length}
                </div>
              </div>

              {p.comments.length > 0 && (
                <div className="mt-2 border-t border-gray-200 pt-2 space-y-1">
                  {p.comments.map((c, idx) => (
                    <p key={idx} className="text-xs text-gray-500 pl-2">
                      • {c}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        ))}

        {posts.length === 0 && <p className="text-gray-500">No posts from your communities yet.</p>}
      </motion.div>
    </div>
  );
};

export default Feed;
