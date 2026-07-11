import React from "react";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  // Not logged in
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Logged in but not admin
  if (
    user.role !== "admin" &&
    user.role !== "super_admin"
  ) {
    return <Navigate to="/" replace />;
  }

  // Authorized
  return children;
};

export default AdminRoute;