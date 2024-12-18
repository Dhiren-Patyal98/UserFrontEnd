import React from "react";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ element }) => {
  const token = localStorage.getItem("token");

  const isTokenValid = () => {
    if (!token) return false;
    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      const expiry = decoded.exp * 1000;
      return Date.now() < expiry;
    } catch (error) {
      return false;
    }
  };

  if (isTokenValid()) {
    return <Navigate to="/home" />;
  }

  return element;
};

export default PublicRoute;
