import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./components/login/login.js";
import Home from "./components/home/Home.js";
import "./App.css";

import ProtectedRoute from "./ProtectedRoute.js";
import PublicRoute from "./publicRoute";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<PublicRoute element={<Login />} />} />

        <Route path="/home" element={<ProtectedRoute element={<Home />} />} />
      </Routes>
    </div>
  );
}

export default App;
