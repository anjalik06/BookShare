import React from "react";
import type { User } from "../types/user";

interface Props {
  user: User;
  onUpload?: () => void;
  onEditProfilePic?: () => void;
}

const ProfileCard: React.FC<Props> = ({ user, onUpload, onEditProfilePic }) => (
  <div className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl shadow-lg p-6 max-w-md mx-auto">

    <div className="flex flex-col items-center text-center relative">

      {/* Edit Button */}
      <button
        onClick={onEditProfilePic}
        className="absolute top-1 right-1 text-xs text-amber-50 bg-blue-500 px-2 py-1 rounded shadow hover:bg-gray-100 hover:text-black"
      >
        Edit
      </button>

      {/* Profile Picture */}
      <div className="w-24 h-24 rounded-full overflow-hidden shadow mb-3">
        {user.profilePic ? (
          <img src={user.profilePic} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-tr from-blue-200 to-purple-200 flex items-center justify-center text-xl font-bold">
            {user.name.charAt(0)}
          </div>
        )}
      </div>

      <h2 className="font-bold text-2xl text-gray-900">{user.name}</h2>
      <p className="text-sm text-gray-500">{user.email}</p>
      {user.bio && <p className="mt-2 text-gray-700">{user.bio}</p>}
    </div>

    {/* Stats */}
    <div className="mt-6 grid grid-cols-3 text-center border-t border-gray-200 pt-4">
      <div>
        <p className="font-bold text-blue-600 text-lg">{user.points}</p>
        <p className="text-xs text-gray-500">Points</p>
      </div>
      <div>
        <p className="font-bold text-lg">{user.booksShared}</p>
        <p className="text-xs text-gray-500">Shared</p>
      </div>
      <div>
        <p className="font-bold text-lg">{user.booksBorrowed}</p>
        <p className="text-xs text-gray-500">Borrowed</p>
      </div>
    </div>

    {/* Upload Book Button */}
    <div className="mt-6 flex justify-center">
      <button
        onClick={onUpload}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
      >
        Upload Book
      </button>
    </div>
  </div>
);

export default ProfileCard;
