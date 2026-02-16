import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Crown } from "lucide-react";
import axios from "axios";

interface LeaderUser {
  _id: string;
  name: string;
  points: number;
  booksShared: number;
}

const rankColors = ["text-yellow-500", "text-gray-400", "text-amber-600"];

const Leaderboard: React.FC = () => {
  const [users, setUsers] = useState<LeaderUser[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = async () => {
    try {
      const res = await axios.get("/api/leaderboard"); // ⭐ NEW API
      setUsers(res.data);
    } catch (err) {
      console.error("Leaderboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col items-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-2xl bg-white/70 backdrop-blur-lg border border-gray-200 rounded-2xl shadow-lg p-8"
      >
        <div className="flex items-center justify-center mb-6">
          <Crown className="text-yellow-500 w-8 h-8 mr-2" />
          <h2 className="text-2xl font-bold text-gray-800">Top Contributors</h2>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading leaderboard...</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {users.map((u, i) => (
              <motion.li
                key={u._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex justify-between items-center py-3 hover:bg-white/60 rounded-lg px-3 transition-all"
              >
                <div className="flex items-center space-x-3">
                  <span
                    className={`font-semibold text-lg ${
                      rankColors[i] || "text-gray-600"
                    }`}
                  >
                    #{i + 1}
                  </span>
                  <span className="font-medium text-gray-800">{u.name}</span>
                </div>

                <div className="text-sm text-gray-600">
                  {u.booksShared} books • {u.points} pts
                </div>
              </motion.li>
            ))}
          </ul>
        )}
      </motion.div>
    </div>
  );
};

export default Leaderboard;
