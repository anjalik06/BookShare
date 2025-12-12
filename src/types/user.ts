export interface User {
  _id: string; // MongoDB ID
  name: string;
  email: string;
  bio?: string;
  profilePic?: string;
  points: number;
  booksShared: number;
  booksBorrowed: number;
}
