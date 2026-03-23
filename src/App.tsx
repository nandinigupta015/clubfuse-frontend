// src/App.tsx
import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Clubs from "./pages/Clubs";
import ClubDetails from "./pages/ClubDetails";
import Events from "./pages/Events";
import EventRegister from "./pages/EventRegister";
import Achievements from "./pages/Achievements";

import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* 🌐 PUBLIC ROUTES */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/clubs" element={<Clubs />} />
      <Route path="/clubs/:id" element={<ClubDetails />} />
      <Route path="/events" element={<Events />} />

      {/* 🔒 PROTECTED ROUTES */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/achievements"
        element={
          <ProtectedRoute>
            <Achievements />
          </ProtectedRoute>
        }
      />
      <Route
        path="/event-register/:id"
        element={
          <ProtectedRoute>
            <EventRegister />
          </ProtectedRoute>
        }
      />

      {/* FALLBACK */}
      <Route path="*" element={<div>404 | Page Not Found</div>} />
    </Routes>
  );
}

export default App;