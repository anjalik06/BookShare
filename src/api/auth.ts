import axios from "axios";
import type { User } from "../types/user";

const API_URL = "/api/auth";

export const loginUser = async (email: string, password: string): Promise<{ user: User, token: string }> => {
  const res = await axios.post(`${API_URL}/login`, { email, password });
  return res.data;
};

export const registerUser = async (name: string, email: string, password: string): Promise<{ user: User, token: string }> => {
  const res = await axios.post(`${API_URL}/register`, { name, email, password });
  return res.data;
};
