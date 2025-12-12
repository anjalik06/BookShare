import React, { useState } from "react";
import axios from "axios";

interface Props {
  userId: string;
  onClose: () => void;
  onUpdated: () => void;
}

const EditProfilePicModal: React.FC<Props> = ({ userId, onClose, onUpdated }) => {
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = async () => {
    if (!file) return alert("Select an image");

    const formData = new FormData();
    formData.append("profilePic", file);

    await axios.post(`/api/auth/profile-picture/${userId}`, formData);

    onUpdated();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow-xl w-96">
        <h2 className="text-xl font-bold mb-4">Update Profile Picture</h2>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="mb-4"
        />

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
          <button onClick={handleUpload} className="px-4 py-2 bg-blue-600 text-white rounded">
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePicModal;
