import React from "react";
import { Navigate } from "react-router";

export default function Protection({ children }) {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return children;
}
