import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, requiredRoles = [] }) => {
  const token = localStorage.getItem("authToken");
  const role = localStorage.getItem("role");

  // Not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Logged in, but wrong role
  if (!requiredRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;