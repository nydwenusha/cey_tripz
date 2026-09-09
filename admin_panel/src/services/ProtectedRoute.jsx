import { Box, CircularProgress } from "@mui/material";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./auth/AuthState";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Box sx={{ p: 4 }} role="status"><CircularProgress aria-label="Checking session" /></Box>;
  }

  if (!user || user.role !== 'admin' || user.status !== 'active') {
    return <Navigate to="/login" state={{ from: location }} replace />;

  }

  return children;

};

export default ProtectedRoute;