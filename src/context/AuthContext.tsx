import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api";
import type { User } from "../types/user";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Always attach token on app start
  useEffect(() => {
    const token = localStorage.getItem("bookshare_token");
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    refreshUser().finally(() => setLoading(false));
  }, []);

  const refreshUser = async () => {
    try {
      const res = await api.get("/api/auth/me");
      setUser(res.data.user);
    } catch {
      logout();
    }
  };

  const login = async (email: string, password: string) => {
    const res = await api.post("/api/auth/login", { email, password });

    localStorage.setItem("bookshare_token", res.data.token);
    api.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;

    setUser(res.data.user);
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await api.post("/api/auth/register", {
      name,
      email,
      password,
    });

    localStorage.setItem("bookshare_token", res.data.token);
    api.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;

    setUser(res.data.user);
  };

  const logout = () => {
    localStorage.removeItem("bookshare_token");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
