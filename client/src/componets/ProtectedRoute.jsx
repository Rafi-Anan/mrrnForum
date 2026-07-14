import { Navigate } from "react-router-dom";
import { getStoredUser } from "../utils/authStorage";

function ProtectedRoute({ children, adminOnly = false }) {
  const token = localStorage.getItem("token");
  // const user = JSON.parse(localStorage.getItem("user") || "null");
  const user = getStoredUser();

  if (!token) return <Navigate to="/login" />;

  if (adminOnly && user?.role !== "admin") {
    return <Navigate to="/" />;
  }

  return children;
}

export default ProtectedRoute;
