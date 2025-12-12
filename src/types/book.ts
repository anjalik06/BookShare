export interface BookUser {
  _id: string;
  name: string;
  email: string;
}

// Book type
export interface Book {
  _id: string;
  title: string;
  author: string;
  genre: string;
  cover?: string;
  description?: string;
  available?: boolean;
  user?: BookUser;       // owner
  requests?: BookUser[]; // users who requested this book
  borrower?: BookUser;   // optional, who borrowed
  returnDate?: string;   // optional return/expiry date
}