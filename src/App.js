import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import BookingPage from './pages/BookingPage';
import MeetingPage from './pages/MeetingPage';
import MinutesPage from './pages/MinutesPage';
import AdminPage from './pages/AdminPage';
import './App.css';
import ForgotPassword from './components/Auth/ForgotPassword';
import { AuthProvider } from '../src/contexts/AuthContexts';
import Profile from './pages/Profile';
import MomPage from './pages/momPage';
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Home />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/Admin" element={<AdminPage />} />
        <Route path="/meetings/:id" element={<MeetingPage />} />
        <Route path="/BookingPage" element={<BookingPage />} />
        <Route path="/minutes" element={<MinutesPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/manageprofile" element={<Profile />} />
        <Route path="/mom/:meetingId" element={<MomPage />} />
      </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;