import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import ProfileCard from "../components/ProfileCard";
import BookCard from "../components/BookCard";
import axios from "axios";
import type { Book } from "../types/book";
import type { User } from "../types/user";
import UploadBookModal from "../components/UploadBookModal";
import EditProfilePicModal from "../components/EditProfilePicModal";

interface BookRequest {
  bookId: string;
  bookTitle: string;
  cover?: string;
  requester: User;
  returnDate?: string;
}

const Profile: React.FC = () => {
  const { user, refreshUser } = useAuth();

  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [onLoanBooks, setOnLoanBooks] = useState<BookRequest[]>([]);
  const [borrowedBooks, setBorrowedBooks] = useState<BookRequest[]>([]);
  const [requests, setRequests] = useState<BookRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedTab, setSelectedTab] =
    useState<"shared" | "loan" | "borrowed" | "requests">("shared");

  const [showUpload, setShowUpload] = useState(false);
  const [showEditPic, setShowEditPic] = useState(false);

  const fetchProfileData = async () => {
    if (!user) return;

    try {
      const [resAll, resOnLoan, resBorrowed, resRequests] = await Promise.all([
        axios.post<Book[]>("/api/books/user", { userId: user._id }),
        axios.get<BookRequest[]>(`/api/books/onloan/${user._id}`),
        axios.get<BookRequest[]>(`/api/books/borrowed/${user._id}`),
        axios.get<BookRequest[]>(`/api/books/requests/user/${user._id}`),
      ]);

      setAllBooks(resAll.data);
      setOnLoanBooks(resOnLoan.data);
      setBorrowedBooks(resBorrowed.data);
      setRequests(resRequests.data);
    } catch (err) {
      console.error("Profile fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [user]);

  const handleApprove = async (bookId: string, requesterId: string) => {
    try {
      await axios.post(`/api/books/${bookId}/request/${requesterId}/approve`);
      alert("Request approved");
      setRequests(prev =>
        prev.filter(r => r.bookId !== bookId || r.requester._id !== requesterId)
      );
    } catch {
      alert("Error approving request");
    }
  };

  const handleReject = async (bookId: string, requesterId: string) => {
    try {
      await axios.post(`/api/books/${bookId}/request/${requesterId}/reject`);
      alert("Request rejected");
      setRequests(prev =>
        prev.filter(r => r.bookId !== bookId || r.requester._id !== requesterId)
      );
    } catch {
      alert("Error rejecting request");
    }
  };

  // ⭐ NEW — RETURN BOOK HANDLER
  const handleReturn = async (bookId: string) => {
    try {
      await axios.post(`/api/books/${bookId}/return`);
      alert("Book returned successfully!");
      setBorrowedBooks(prev => prev.filter(b => b.bookId !== bookId));
    } catch {
      alert("Error returning book");
    }
  };

  if (!user)
    return <p className="text-center mt-10 text-gray-500">Please login first</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <ProfileCard
          user={user}
          onUpload={() => setShowUpload(true)}
          onEditProfilePic={() => setShowEditPic(true)}
        />

        {/* TABS */}
        <div className="flex justify-around mt-10 border-b pb-3">
          {["shared", "loan", "borrowed", "requests"].map(tab => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab as any)}
              className={`font-semibold text-lg capitalize relative ${
                selectedTab === tab
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600"
              }`}
            >
              {tab === "shared" && "Shared Books"}
              {tab === "loan" && "On Loan"}
              {tab === "borrowed" && "Borrowed"}
              {tab === "requests" && (
                <span className="relative">
                  Requests
                  {requests.length > 0 && (
                    <span
                      className="absolute -right-6 -top-2 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full"
                    >
                      {requests.length}
                    </span>
                  )}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ⭐ TAB CONTENT */}
        <div className="mt-8">

          {/* SHARED BOOKS */}
          {selectedTab === "shared" &&
            (loading ? (
              <p>Loading...</p>
            ) : allBooks.length ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {allBooks.map(book => (
                  <BookCard key={book._id} book={book} />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">No shared books yet.</p>
            ))}

          {/* ON LOAN */}
          {selectedTab === "loan" &&
            (loading ? (
              <p>Loading...</p>
            ) : onLoanBooks.length ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {onLoanBooks.map(req => (
                  <BookCard
                    key={req.bookId}
                    book={{ _id: req.bookId, title: req.bookTitle, cover: req.cover } as Book}
                    borrower={req.requester}
                    returnDate={req.returnDate}
                  />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">No books on loan.</p>
            ))}

          {/* BORROWED ⭐ WITH RETURN BUTTON */}
          {selectedTab === "borrowed" &&
            (loading ? (
              <p>Loading...</p>
            ) : borrowedBooks.length ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {borrowedBooks.map(req => (
                  <BookCard
                    key={req.bookId}
                    book={{ _id: req.bookId, title: req.bookTitle, cover: req.cover } as Book}
                    owner={req.requester}
                    returnDate={req.returnDate}
                  >
                    <button
                      className="px-3 py-1 text-white bg-blue-600 rounded text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReturn(req.bookId);
                      }}
                    >
                      Return Book
                    </button>
                  </BookCard>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">No borrowed books.</p>
            ))}

          {/* REQUESTS */}
          {selectedTab === "requests" &&
            (loading ? (
              <p>Loading...</p>
            ) : !requests.length ? (
              <p className="text-center text-gray-500">No requests right now.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {requests.map(req => (
                  <BookCard
                    key={req.bookId + req.requester._id}
                    book={{ _id: req.bookId, title: req.bookTitle, cover: req.cover } as Book}
                    borrower={req.requester}
                  >
                    <div className="flex gap-2 mt-3">
                      <button
                        className="px-3 py-1 text-white bg-green-600 rounded text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApprove(req.bookId, req.requester._id);
                        }}
                      >
                        Approve
                      </button>
                      <button
                        className="px-3 py-1 text-white bg-red-600 rounded text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReject(req.bookId, req.requester._id);
                        }}
                      >
                        Reject
                      </button>
                    </div>
                  </BookCard>
                ))}
              </div>
            ))}

        </div>
      </div>

      {/* MODALS */}
      {showUpload && (
        <UploadBookModal
          userId={user._id}
          onClose={() => setShowUpload(false)}
          onUploaded={fetchProfileData}
        />
      )}

      {showEditPic && (
        <EditProfilePicModal
          userId={user._id}
          onClose={() => setShowEditPic(false)}
          onUpdated={() => {
            fetchProfileData();
            refreshUser?.();
          }}
        />
      )}
    </div>
  );
};

export default Profile;
