import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

interface Community {
  _id: string;
  name: string;
  icon: string;
}

const CommunitySidebar: React.FC = () => {
  const { user, loading: authLoading } = useAuth(); // get auth loading
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true); // loading for communities
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return setLoading(false);

    const fetchCommunities = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/api/communities/my", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("bookshare_token")}`,
          },
        });
        setCommunities(res.data);
      } catch (err) {
        console.error(err);
        setCommunities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCommunities();
  }, [user]);

  if (authLoading || loading) {
    return (
      <p className="text-gray-500 text-sm italic text-center mt-4">Loading communities...</p>
    );
  }

  if (!user) {
    return (
      <p className="text-gray-500 text-sm italic text-center mt-4">
        You must be logged in to view your communities.
      </p>
    );
  }

  return (
    <aside className="w-64 bg-white/90 backdrop-blur-lg border border-gray-200 rounded-2xl shadow-lg p-4 flex flex-col gap-4 sticky top-20">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">📚 My Communities</h2>

      {communities.length === 0 ? (
        <p className="text-gray-500 text-sm italic">You are not following any communities yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {communities.map((c) => (
            <button
              key={c._id}
              onClick={() => navigate(`/community/${c._id}`)}
              className="flex items-center gap-3 p-3 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow duration-200 transform hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 text-white text-lg font-bold">
                {c.icon || c.name.charAt(0).toUpperCase()}
              </div>
              <span className="font-medium text-gray-800">{c.name}</span>
            </button>
          ))}
        </div>
      )}
    </aside>
  );
};

export default CommunitySidebar;
