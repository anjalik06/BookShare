import React, { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../api"; // ✅ use api instance
import { io } from "socket.io-client";

// ✅ correct socket connection
const socket = io(import.meta.env.VITE_API_URL, {
  transports: ["websocket"],
  withCredentials: true,
});

const ChatFloatingButton: React.FC = () => {
  const nav = useNavigate();
  const [totalUnread, setTotalUnread] = useState(0);

  // 🔥 Load unread count on mount
  useEffect(() => {
    const token = localStorage.getItem("bookshare_token");
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    api.get("/api/chat/unread/all").then((res) => {
      const counts = res.data;
      const values = Object.values(counts) as number[];
      const sum = values.reduce((a, b) => a + b, 0);
      setTotalUnread(sum);
    });
  }, []);

  // 🔥 Live update
  useEffect(() => {
    const handler = (msg: any) => {
      const userId = localStorage.getItem("userId");
      if (msg.sender._id !== userId) {
        setTotalUnread((prev) => prev + 1);
      }
    };

    socket.on("newMessage", handler);

    return () => {
      socket.off("newMessage", handler);
    };
  }, []);

  return (
    <button
      onClick={() => nav("/chat")}
      className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-xl hover:bg-blue-700 transition flex items-center justify-center"
      style={{ boxShadow: "0px 4px 20px rgba(0,0,0,0.25)" }}
    >
      <MessageCircle className="w-7 h-7" />

      {totalUnread > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
          {totalUnread}
        </span>
      )}
    </button>
  );
};

export default ChatFloatingButton;
