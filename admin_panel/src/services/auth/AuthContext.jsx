import React, { useState, useEffect } from "react";
import api from "../api/api";

import { AuthContext } from "./AuthState";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Important for refresh

  // Check token on app start
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await api.get("/profile"); // token added via axios interceptor
          if (response.data.user?.role !== 'admin' || response.data.user?.status !== 'active') {
            throw new Error('An active administrator account is required.');
          }
          setUser(response.data.user);
        } catch {
          localStorage.removeItem("token");
          setUser(null);
        }
      }
      setLoading(false); // unblock ProtectedRoute
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (data) => {
    try {
      const response = await api.post("/login", data);
      if (response.data.user?.role !== 'admin' || response.data.user?.status !== 'active') {
        return { success: false, message: 'An active administrator account is required.' };
      }
      localStorage.setItem("token", response.data.token);
      setUser(response.data.user);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await api.post("/logout"); // optional
    } catch (error) {
      console.error("Logout error:", error);
    }
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
