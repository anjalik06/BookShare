import React, { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://https://yourapp.onrender.com");

const ChatFloatingButton: React.FC = () => {
  const nav = useNavigate();
  const [totalUnread, setTotalUnread] = useState(0);

  // 🔥 Load unread count on mount
  useEffect(() => {
    const token = localStorage.getItem("bookshare_token");
    if (token) axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    axios.get(`${import.meta.env.VITE_API_URL}/api/chat/unread/all`).then((res) => {
      const counts = res.data;
      const values = Object.values(counts) as number[];
const sum = values.reduce((a, b) => a + b, 0);
      setTotalUnread(sum);
    });
  }, []);

  // 🔥 Update unread count on live new message
  useEffect(() => {
    const handler = (msg: any) => {
      // Only count messages FROM OTHER USERS
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
      className="
        fixed bottom-6 right-6 
        bg-blue-600 text-white 
        p-4 rounded-full shadow-xl 
        hover:bg-blue-700 transition 
        flex items-center justify-center
      "
      style={{
        boxShadow: "0px 4px 20px rgba(0,0,0,0.25)",
      }}
    >
      {/* Floating Chat Icon */}
      <MessageCircle className="w-7 h-7" />

      {/* 🔴 UNREAD BADGE */}
      {totalUnread > 0 && (
        <span
          className="
            absolute -top-1 -right-1 
            bg-red-600 text-white 
            text-xs font-bold 
            w-5 h-5 rounded-full
            flex items-center justify-center
          "
        >
          {totalUnread}
        </span>
      )}
    </button>
  );
};

export default ChatFloatingButton;
