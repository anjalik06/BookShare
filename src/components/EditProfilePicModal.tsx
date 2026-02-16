import React, { useState } from "react";
import axios from "axios";

interface Props {
  userId: string;
  onClose: () => void;
  onUpdated: () => void;
}

const EditProfilePicModal: React.FC<Props> = ({ userId, onClose, onUpdated }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
    if (f) setPreview(URL.createObjectURL(f));
  };

  const handleUpload = async () => {
    if (!file) return alert("Select an image!");

    const formData = new FormData();
    formData.append("profilePic", file);

    await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/profile-picture/${userId}`, formData);
    onUpdated();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-[380px] animate-fadeIn">
        
        <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">
          Update Profile Picture
        </h2>

        {/* Image Preview */}
        <div className="flex justify-center mb-4">
          <div className="w-28 h-28 rounded-full overflow-hidden shadow-md bg-gray-100">
            {preview ? (
              <img
                src={preview}
                className="w-full h-full object-cover"
                alt="preview"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                No Image
              </div>
            )}
          </div>
        </div>

        {/* Custom File Upload */}
        <label
          className="block w-full cursor-pointer text-center bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg transition mb-4"
        >
          Select Image
          <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </label>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            disabled={!file}
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePicModal;
