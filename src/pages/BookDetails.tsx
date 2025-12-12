import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react"; 
import { getBookById } from "../api/books";
import type { Book } from "../types/book";
import { useAuth } from "../context/AuthContext";

const BookDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser } = useAuth(); // use AuthContext
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [requestSent, setRequestSent] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchBook = async () => {
      try {
        const data = await getBookById(id);
        setBook(data);
      } catch (err) {
        console.error("Failed to fetch book:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const handleRequest = async () => {
    if (!book || !currentUser) return;

    try {
      const response = await fetch(`/api/books/${book._id}/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("bookshare_token")}`, // send token
        },
        body: JSON.stringify({ requesterId: currentUser._id }),
      });

      if (!response.ok) throw new Error("Request failed");

      alert("Request sent to the owner!");
      setRequestSent(true);
    } catch (err) {
      console.error(err);
      alert("Failed to send request.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-600">
        <p>Loading book details...</p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-600">
        <p>Book not found.</p>
      </div>
    );
  }

  // Check if current user is the owner
  const isOwner = book.user && currentUser
    ? book.user._id.toString() === currentUser._id.toString()
    : false;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-3xl bg-white/70 backdrop-blur-lg border border-gray-200 rounded-2xl shadow-lg p-8">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-blue-600 hover:underline mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Home
        </Link>

        <div className="flex flex-col sm:flex-row gap-6">
          {/* Book Cover */}
          <div className="sm:w-1/3 flex justify-center">
            {book.cover ? (
              <img
                src={book.cover}
                alt={book.title}
                className="w-40 h-56 object-cover rounded-lg shadow-md"
              />
            ) : (
              <div className="w-40 h-56 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 italic">
                No Cover
              </div>
            )}
          </div>

          {/* Book Info */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{book.title}</h1>
            <p className="text-gray-600 mb-3">by {book.author}</p>
            <p className="text-gray-700 mb-5 leading-relaxed">{book.description}</p>

            <div className="flex items-center justify-between">
              <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-700 font-medium">
                {book.genre}
              </span>
              <span
                className={`font-semibold text-sm ${
                  book.available ? "text-green-600" : "text-red-600"
                }`}
              >
                {book.available ? "Available for Borrowing" : "Currently Borrowed"}
              </span>
            </div>

            {/* Posted By */}
            {book.user && (
              <p className="mt-4 text-gray-500 text-sm">
                Posted by: <span className="font-medium">{book.user.name}</span>
              </p>
            )}

            {/* Request to Borrow Button */}
            {!isOwner && book.user && (
              <div className="mt-4">
                <button
                  onClick={handleRequest}
                  disabled={!book.available || requestSent}
                  className={`mt-2 px-4 py-2 rounded-lg font-medium ${
                    book.available && !requestSent
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {requestSent
                    ? "Request Pending"
                    : book.available
                    ? "Request to Borrow"
                    : "Not Available"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
