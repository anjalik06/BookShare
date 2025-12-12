import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Heart, MessageCircle } from "lucide-react";

interface Post {
  _id: string;
  user: { name: string };
  content: string;
  image?: string;
  createdAt: string;
  likes: number;
  comments: { _id: string; text: string }[];
}

interface Community {
  _id: string;
  name: string;
  icon: string;
}

const CommunityPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [community, setCommunity] = useState<Community | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchCommunityAndPosts = async () => {
      try {
        // Fetch community info
        const commRes = await axios.get(`/api/communities/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("bookshare_token")}`,
          },
        });
        setCommunity(commRes.data);

        // Fetch posts for this community
        const postRes = await axios.get(`/api/posts/community/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("bookshare_token")}`,
          },
        });
        setPosts(postRes.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCommunityAndPosts();
  }, [id]);

  const likePost = async (postId: string) => {
    try {
      await axios.post(
        `/api/posts/${postId}/like`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("bookshare_token")}` } }
      );
      setPosts(posts.map((p) => (p._id === postId ? { ...p, likes: p.likes + 1 } : p)));
    } catch (err) {
      console.error(err);
    }
  };

  if (!community) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-10 px-4 flex justify-center">
      <div className="w-full max-w-3xl flex flex-col gap-6">
        {/* Community Banner */}
        <div className="bg-white rounded-2xl shadow-md p-5 flex items-center gap-3">
          <div className="text-4xl">{community.icon}</div>
          <h1 className="text-2xl font-bold">{community.name}</h1>
        </div>

        {/* Posts */}
        {posts.length === 0 && (
          <p className="text-gray-500 text-center mt-4">No posts in this community yet.</p>
        )}

        {posts.map((p) => (
          <div key={p._id} className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="flex items-center gap-3 p-3">
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center font-semibold text-gray-700">
                {p.user.name.charAt(0)}
              </div>
              <p className="font-medium text-gray-800">{p.user.name}</p>
            </div>

            {p.image && <img src={p.image} alt={p.content} className="w-full object-cover" />}

            <div className="px-3 pb-3">
              <p className="text-gray-800 mt-1">{p.content}</p>
              <p className="text-xs text-gray-400 mt-1">{new Date(p.createdAt).toLocaleString()}</p>

              <div className="flex gap-4 mt-2 text-sm text-gray-500">
                <button
                  onClick={() => likePost(p._id)}
                  className="flex items-center gap-1 hover:text-red-500 transition"
                >
                  <Heart className="w-4 h-4" /> 
                   <span>{p.likes}</span>
                </button>
                <div className="flex items-center gap-1 hover:text-blue-500 transition">
                  <MessageCircle className="w-4 h-4" /> {p.comments.length}
                </div>
              </div>

              {p.comments.length > 0 && (
                <div className="mt-2 border-t border-gray-200 pt-2 space-y-1">
                  {p.comments.map((c) => (
                    <p key={c._id} className="text-xs text-gray-500 pl-2">
                      • {c.text}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityPage;
