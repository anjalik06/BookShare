import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Profile from "../pages/Profile";
import BookDetails from "../pages/BookDetails";
import Community from "../pages/Community";
import Leaderboard from "../pages/Leaderboard";
import Feed from "../pages/Feed";
import ProtectedRoute from "./ProtectedRoute";
import Chat from "../pages/Chat";

const AppRouter: React.FC = () => (
  <Routes>
    {/* Public routes */}
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />

    {/* Protected routes */}
    <Route
      path="/"
      element={
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      }
    />
    <Route
      path="/feed"
      element={
        <ProtectedRoute>
          <Feed />
        </ProtectedRoute>
      }
    />
    <Route
      path="/profile/:id"
      element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      }
    />
    <Route
      path="/book/:id"
      element={
        <ProtectedRoute>
          <BookDetails />
        </ProtectedRoute>
      }
    />
<Route
  path="/community/:id"
  element={
    <ProtectedRoute>
      <Community />
    </ProtectedRoute>
  }
/>

    <Route
      path="/leaderboard"
      element={
        <ProtectedRoute>
          <Leaderboard />
        </ProtectedRoute>
      }
    />
    
    <Route
      path="/chat"
      element={
        <ProtectedRoute>
         <Chat/>
        </ProtectedRoute>
      }
    />
  </Routes>
);


export default AppRouter;
