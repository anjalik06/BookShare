import React from "react";
import type { Book } from "../types/book";
import type { User } from "../types/user";
import { useNavigate } from "react-router-dom";

interface BookCardProps {
  book: Book;
  borrower?: User;   // For "On Loan" section
  owner?: User;      // For "Borrowed" section
  returnDate?: string;
  children?: React.ReactNode; // optional buttons / actions
  className?: string;         // extra classes for sizing/layout
}

const BookCard: React.FC<BookCardProps> = ({ book, borrower, owner, returnDate, children, className }) => {
  const nav = useNavigate();

  return (
    <div
      className={`bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-md hover:shadow-lg transition cursor-pointer overflow-hidden ${className}`}
      onClick={() => nav(`/book/${book._id}`)}
    >
      {/* Book Cover */}
      <div className="h-40 md:h-56 bg-gray-100 flex items-center justify-center">
        {book.cover ? (
          <img
            src={book.cover}
            alt={book.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-gray-400 text-sm italic">No Cover</span>
        )}
      </div>

      {/* Book Info */}
      <div className="p-3 space-y-1">
        <h3 className="font-semibold text-lg text-gray-900">{book.title}</h3>
        {book.author && <p className="text-sm text-gray-600">{book.author}</p>}
        {book.genre && <p className="text-xs text-gray-500">{book.genre}</p>}
        {book.available !== undefined && (
          <p
            className={`text-xs font-medium mt-1 ${
              book.available ? "text-green-600" : "text-red-500"
            }`}
          >
            {book.available ? "Available" : "On Loan"}
          </p>
        )}

        {borrower && (
          <p className="text-xs text-gray-600">
            Borrowed by: <span className="font-medium">{borrower.name}</span>
          </p>
        )}
        {owner && (
          <p className="text-xs text-gray-600">
            Owner: <span className="font-medium">{owner.name}</span>
          </p>
        )}
        {returnDate && (
          <p className="text-xs text-gray-600">
            Return by: <span className="font-medium">{returnDate}</span>
          </p>
        )}

        {/* Optional actions/buttons */}
        {children && <div className="mt-2 flex gap-2">{children}</div>}
      </div>
    </div>
  );
};

export default BookCard;
