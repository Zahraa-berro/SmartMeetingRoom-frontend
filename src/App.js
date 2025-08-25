import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import BookingPage from './pages/BookingPage';
import MeetingPage from './pages/MeetingPage';
import MinutesPage from './pages/MinutesPage';
import AdminPage from './pages/AdminPage';
import password from './components/Auth/ForgotPassword';
import './App.css';
import ForgotPassword from './components/Auth/ForgotPassword';
//         <Route path="/meeting/:id" element={<MeetingPage />} />
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/Admin" element={<AdminPage />} />
        <Route path="/meeting/:id" element={<MeetingPage />} />
        <Route path="/BookingPage" element={<BookingPage />} />
        <Route path="/minutes" element={<MinutesPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </Router>
  );
}

export default App;
