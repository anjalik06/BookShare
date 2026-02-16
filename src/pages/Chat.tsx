import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { io, Socket } from "socket.io-client";
import { useLocation } from "react-router-dom";

// socket connect
const socket: Socket = io("http://https://yourapp.onrender.com");

// ---------- TYPES ----------
interface Member {
  _id: string;
  name: string;
  profilePic?: string;
}

interface Message {
  _id: string;
  chatId: string;
  text: string;
  sender: Member;
  createdAt: string;
  fileUrl?: string;
  fileName?: string;
  readBy?: string[];
}

interface ChatRoom {
  _id: string;
  members: Member[];
}
// ----------------------------

const Chat = () => {
  const location = useLocation();
  const { user } = useAuth();

  const [chats, setChats] = useState<ChatRoom[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);

  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);

  /* -----------------------------
     Load Token for API
  ------------------------------ */
  useEffect(() => {
    const token = localStorage.getItem("bookshare_token");
    if (token) axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }, []);

  /* -----------------------------
     Detect ?open=ChatId
  ------------------------------ */
  useEffect(() => {
    const chatId = new URLSearchParams(location.search).get("open");
    if (chatId) setActiveChat(chatId);
  }, [location]);

  /* -----------------------------
     Load Chat List
  ------------------------------ */
  useEffect(() => {
    if (!user) return;
    axios.get("/api/chat").then((res) => setChats(res.data));
  }, [user]);

  /* -----------------------------
     Load Messages + Join Room
  ------------------------------ */
  useEffect(() => {
    if (!activeChat) return;

    // join socket room
    socket.emit("joinChat", activeChat);

    // load old messages
    axios.get(`/api/chat/${activeChat}/messages`).then((res) => {
      setMessages(res.data);
    });

    const handler = (msg: Message) => {
      if (msg.chatId === activeChat) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on("newMessage", handler);

    // ⭐ correct cleanup
    return () => {
      socket.off("newMessage", handler);
    };
  }, [activeChat]);

  /* -----------------------------
     SEND MESSAGE
  ------------------------------ */
  const sendMessage = async () => {
    if (!text.trim() && !file) return;
    if (!activeChat) return;

    const form = new FormData();
    form.append("text", text);
    if (file) form.append("file", file);

    const res = await axios.post(`/api/chat/${activeChat}/send`, form, {
      headers: { "Content-Type": "multipart/form-data" }
    });

    socket.emit("sendMessage", res.data);

    setText("");
    setFile(null);
  };

  return (
    <div className="flex h-screen w-full bg-gray-100">

      {/* LEFT CHAT LIST */}
      <div className="w-1/3 bg-white border-r p-4">
        <h2 className="text-xl font-bold border-b pb-2">Messages</h2>

        <div className="overflow-y-auto">
          {chats.map((c) => {
            const partner = c.members.find((m) => m._id !== user?._id);

            // ⭐ count unread messages for this chat
            const unread = messages.filter(
              (m) =>
                m.chatId === c._id &&
                m.sender._id !== user?._id &&
                !m.readBy?.includes(user?._id || "")
            ).length;

            return (
              <div
                key={c._id}
                onClick={() => setActiveChat(c._id)}
                className={`p-3 flex items-center justify-between cursor-pointer hover:bg-gray-100 ${
                  activeChat === c._id ? "bg-blue-100" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={partner?.profilePic || "/default.jpg"}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <p className="font-medium">{partner?.name}</p>
                </div>

                {/* ⭐ RED BADGE */}
                {unread > 0 && (
                  <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                    {unread}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT CHAT WINDOW */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {activeChat ? (
          <>
            {/* MESSAGE LIST */}
            <div className="flex-1 p-4 overflow-y-auto">
              {messages.map((msg) => (
                <div
                  key={msg._id}
                  className={`mb-4 flex ${
                    msg.sender._id === user?._id ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`p-3 rounded-xl max-w-xs ${
                      msg.sender._id === user?._id
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    {msg.text && <p>{msg.text}</p>}

                    {msg.fileUrl && (
                      <a
                        href={msg.fileUrl}
                        target="_blank"
                        className="mt-2 block underline text-sm"
                      >
                        📄 {msg.fileName || "View PDF"}
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* INPUT BAR */}
            <div className="p-4 border-t flex gap-3 items-center bg-white">

              {/* PDF Preview */}
              {file && (
                <div className="flex items-center gap-2 bg-gray-200 px-3 py-1 rounded-lg">
                  <span className="text-sm">📄 {file.name}</span>
                  <button
                    onClick={() => setFile(null)}
                    className="text-red-500 font-bold"
                  >
                    ✖
                  </button>
                </div>
              )}

              {/* Select PDF */}
              <label className="bg-purple-600 px-3 py-2 rounded text-white cursor-pointer hover:bg-purple-700">
                📄 Upload PDF
                <input
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
              </label>

              {/* TEXT INPUT */}
              <input
                className="flex-1 border px-3 py-2 rounded-xl"
                placeholder="Type a message..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />

              {/* SEND */}
              <button
                onClick={sendMessage}
                className="bg-blue-600 text-white px-4 py-2 rounded-xl"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 text-xl">
            Select a chat
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
