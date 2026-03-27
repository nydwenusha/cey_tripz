import React, { createContext, useState, useEffect, useContext } from "react";
import api from "../api/api";

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

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
          setUser(response.data.user);
        } catch (error) {
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

  // Register function
  const register = async (data) => {
    try {
      const response = await api.post("/register", data);
      localStorage.setItem("token", response.data.token);
      setUser(response.data.user);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
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
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};