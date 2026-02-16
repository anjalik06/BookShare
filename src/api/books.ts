import api from "../api";
import type { Book } from "../types/book";

const API_URL = "/api/books";

export const getBooks = async (): Promise<Book[]> => {
  const res = await api.get(API_URL);
  return res.data;
};

export const getBookById = async (id: string): Promise<Book> => {
  const res = await api.get(`${API_URL}/${id}`);
  return res.data;
};
