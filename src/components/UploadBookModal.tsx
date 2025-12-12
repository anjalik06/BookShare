import React, { useState } from "react";
import axios from "axios";

interface Props {
  userId: string;
  onClose: () => void;
  onUploaded?: () => void;
}

const UploadBookModal: React.FC<Props> = ({ userId, onClose, onUploaded }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [description, setDescription] = useState("");
  const [cover, setCover] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Load preview
  const handleFileChange = (file: File) => {
    setCover(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!title || !author || !genre) {
      alert("Please fill all required fields");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    formData.append("genre", genre);
    formData.append("description", description);
    formData.append("userId", userId);

    if (cover) formData.append("cover", cover);

    try {
      setLoading(true);
      await axios.post("/api/books/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      alert("Book uploaded!");
      onUploaded?.();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Upload error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[1000]">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">

        <h2 className="text-2xl font-bold text-center mb-4">Upload New Book</h2>

        {/* Modern Upload Box */}
        <div
          className="border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition"
          onClick={() => document.getElementById("coverInput")?.click()}
        >
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="w-40 h-40 object-cover rounded-lg shadow-md"
            />
          ) : (
            <>
              <div className="w-20 h-20 bg-gray-200 rounded-xl flex items-center justify-center text-gray-500">
                📘
              </div>
              <p className="text-gray-600 mt-2">Click to upload cover photo</p>
            </>
          )}
        </div>

        {/* Hidden input */}
        <input
          id="coverInput"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) =>
            e.target.files && handleFileChange(e.target.files[0])
          }
        />

        {/* Inputs */}
        <input
          type="text"
          placeholder="Title *"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded mt-4"
        />

        <input
          type="text"
          placeholder="Author *"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="w-full p-2 border rounded mt-3"
        />

        <input
          type="text"
          placeholder="Genre *"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="w-full p-2 border rounded mt-3"
        />

        <textarea
          placeholder="Short description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded mt-3"
          rows={3}
        />

        {/* Footer */}
        <div className="flex justify-between mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>

          <button
            onClick={handleUpload}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadBookModal;
