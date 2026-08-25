import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./auth/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return null;
  }

  const token = localStorage.getItem("token");
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;

  }

  return children;

};

export default ProtectedRoute;