import { useState,useEffect } from "react";
import { Navigate } from "react-router-dom";
import api from "./api/api";

const ProtectedRoute = ({ children }) => {

  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" />;

  }

  return children;

};

export default ProtectedRoute;