// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPages from "./pages/AuthPages";
import MyBookings from "./pages/MyBookings";
import RenterDashboard from "./pages/RenterDashboard"; // 👈 import this

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPages />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/dashboard" element={<RenterDashboard />} /> {/* 👈 renter dashboard */}
      </Routes>
    </Router>
  );
}

export default App;
