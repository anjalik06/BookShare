import React from "react";
import type { Book } from "../types/book";
import BookCard from "./BookCard";
import { motion } from "framer-motion";

interface Props {
  books: Book[];
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const BookList: React.FC<Props> = ({ books }) => (
  <motion.div
    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
    variants={containerVariants}
    initial="hidden"
    animate="visible"
  >
    {books.map((b) => (
      <motion.div
        key={b._id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <BookCard book={b} />
      </motion.div>
    ))}
  </motion.div>
);

export default BookList;
