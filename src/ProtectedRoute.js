import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";

const isTokenExpired = (token) => {
  if (!token) return true;

  const decoded = JSON.parse(atob(token.split(".")[1]));
  const expiry = decoded.exp * 1000;
  return Date.now() > expiry;
};

const ProtectedRoute = ({ element, ...rest }) => {
  const token = localStorage.getItem("token");
  const location = useLocation();

  useEffect(() => {
    if (token) {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      const expiry = decoded.exp * 1000;
      const remainingTime = expiry - Date.now();

      if (remainingTime > 0) {
        const timeout = setTimeout(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("tokenExpiry");
          window.location.href = "/";
        }, remainingTime);

        return () => clearTimeout(timeout);
      }
    }
  }, [token]);

  if (!token || isTokenExpired(token)) {
    localStorage.removeItem("token");
    return <Navigate to="/" state={{ from: location }} />;
  }

  return element;
};

export default ProtectedRoute;
