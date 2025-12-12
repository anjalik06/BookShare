import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import ProfileCard from "../components/ProfileCard";
import BookCard from "../components/BookCard";
import axios from "axios";
import type { Book } from "../types/book";
import type { User } from "../types/user";
import UploadBookModal from "../components/UploadBookModal";
import EditProfilePicModal from "../components/EditProfilePicModal";

// BookRequest type from backend
interface BookRequest {
  bookId: string;
  bookTitle: string;
  cover?: string;
  requester: User;
  returnDate?: string;
}

const Profile: React.FC = () => {
  const { user, refreshUser } = useAuth(); // refreshUser updates profile after upload
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [onLoanBooks, setOnLoanBooks] = useState<BookRequest[]>([]);
  const [borrowedBooks, setBorrowedBooks] = useState<BookRequest[]>([]);
  const [requests, setRequests] = useState<BookRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showUpload, setShowUpload] = useState(false);
  const [showEditPic, setShowEditPic] = useState(false);

  // Fetch all data for this profile
  const fetchProfileData = async () => {
    if (!user) return;

    try {
      const [resAll, resOnLoan, resBorrowed, resRequests] = await Promise.all([
        axios.post<Book[]>("/api/books/user", { userId: user._id }),
        axios.get<BookRequest[]>(`/api/books/onloan/${user._id}`),
        axios.get<BookRequest[]>(`/api/books/borrowed/${user._id}`),
        axios.get<BookRequest[]>(`/api/books/requests/user/${user._id}`)
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

  // Load on component mount
  useEffect(() => {
    fetchProfileData();
  }, [user]);

  // Approve request
  const handleApprove = async (bookId: string, requesterId: string) => {
    try {
      await axios.post(`/api/books/${bookId}/request/${requesterId}/approve`);
      alert("Request approved");
      setRequests(prev =>
        prev.filter(r => r.bookId !== bookId || r.requester._id !== requesterId)
      );
    } catch (err) {
      console.error(err);
      alert("Error approving request");
    }
  };

  // Reject request
  const handleReject = async (bookId: string, requesterId: string) => {
    try {
      await axios.post(`/api/books/${bookId}/request/${requesterId}/reject`);
      alert("Request rejected");
      setRequests(prev =>
        prev.filter(r => r.bookId !== bookId || r.requester._id !== requesterId)
      );
    } catch (err) {
      console.error(err);
      alert("Error rejecting request");
    }
  };

  // If not logged in
  if (!user)
    return (
      <p className="text-center mt-10 text-gray-500">
        Please login to view your profile.
      </p>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">

        {/* PROFILE CARD */}
        <ProfileCard
          user={user}
          onUpload={() => setShowUpload(true)}
          onEditProfilePic={() => setShowEditPic(true)}
        />

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">

          {/* Shared Books */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Shared Books</h2>

            {loading ? (
              <p>Loading...</p>
            ) : allBooks.length ? (
              <div className="space-y-4">
                {allBooks.map(book => (
                  <BookCard
                    key={book._id}
                    book={book}
                    borrower={book.borrower as User}
                    returnDate={book.returnDate?.toString()}
                    className="w-full"
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No shared books yet</p>
            )}
          </div>

          {/* On Loan Books */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">On Loan</h2>

            {loading ? (
              <p>Loading...</p>
            ) : onLoanBooks.length ? (
              <div className="space-y-4">
                {onLoanBooks.map(req => (
                  <BookCard
                    key={req.bookId}
                    book={{
                      _id: req.bookId,
                      title: req.bookTitle,
                      cover: req.cover
                    } as Book}
                    borrower={req.requester}
                    returnDate={req.returnDate}
                    className="w-full"
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No books on loan</p>
            )}
          </div>

          {/* Borrowed Books */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Borrowed Books</h2>

            {loading ? (
              <p>Loading...</p>
            ) : borrowedBooks.length ? (
              <div className="space-y-4">
                {borrowedBooks.map(req => (
                  <BookCard
                    key={req.bookId}
                    book={{
                      _id: req.bookId,
                      title: req.bookTitle,
                      cover: req.cover
                    } as Book}
                    owner={req.requester}
                    returnDate={req.returnDate}
                    className="w-full"
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No borrowed books</p>
            )}
          </div>
        </div>

        {/* Incoming Requests */}
        <div className="mt-10">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Incoming Requests</h2>

          {loading ? (
            <p>Loading...</p>
          ) : !requests.length ? (
            <p className="text-gray-500">No requests at the moment.</p>
          ) : (
            <div className="flex flex-wrap gap-4">
              {requests.map(req => (
                <BookCard
                  key={req.bookId + req.requester._id}
                  book={{
                    _id: req.bookId,
                    title: req.bookTitle,
                    cover: req.cover
                  } as Book}
                  borrower={req.requester}
                  className="w-full sm:w-72"
                >
                  <button
                    className="px-3 py-1 text-white bg-green-600 rounded hover:bg-green-700 text-xs"
                    onClick={e => {
                      e.stopPropagation();
                      handleApprove(req.bookId, req.requester._id);
                    }}
                  >
                    Approve
                  </button>

                  <button
                    className="px-3 py-1 text-white bg-red-600 rounded hover:bg-red-700 text-xs"
                    onClick={e => {
                      e.stopPropagation();
                      handleReject(req.bookId, req.requester._id);
                    }}
                  >
                    Reject
                  </button>
                </BookCard>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* UPLOAD BOOK MODAL */}
      {showUpload && (
        <UploadBookModal
          userId={user._id}
          onClose={() => setShowUpload(false)}
          onUploaded={fetchProfileData}
        />
      )}

      {/* EDIT PROFILE PIC MODAL */}
      {showEditPic && (
        <EditProfilePicModal
          userId={user._id}
          onClose={() => setShowEditPic(false)}
          onUpdated={() => {
            fetchProfileData();
            refreshUser?.(); // Refresh AuthContext
          }}
        />
      )}
    </div>
  );
};

export default Profile;
