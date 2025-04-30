import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Import components
import Navbar from './components/Navbar';
import AdminPanel from './components/admin/AdminPanel';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Import user-side components
import Home from './pages/Home';
import Dashboard from './pages/user/Dashboard';
import NoteDetail from './pages/user/NoteDetail';
import NoteForm from './pages/user/NoteForm';
import UserProfile from './pages/user/UserProfile';

// Import AuthProvider
import { AuthProvider } from './context/AuthContext';

// Protected Route Component
const ProtectedRoute = ({ element, requiredRole = null }) => {
  // Check if user is logged in
  const currentUser = localStorage.getItem('currentUser');
  const userObj = currentUser ? JSON.parse(currentUser) : null;

  if (!userObj) {
  // Not logged in, redirect to login
    return <Navigate to="/login" replace />;
  }
  
  // If a specific role is required, check it
  if (requiredRole && userObj.role !== requiredRole) {
    // User doesn't have required role, redirect to dashboard
    return <Navigate to="/dashboard" replace />;
  }
  
  // User is authenticated and has required role (if any)
  return element;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<AdminPanel />} />
            {/* Protected User Routes */}
            <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
            <Route path="/notes/:id" element={<ProtectedRoute element={<NoteDetail />} />} />
            <Route path="/notes/create" element={<ProtectedRoute element={<NoteForm />} />} />
            <Route path="/notes/edit/:id" element={<ProtectedRoute element={<NoteForm />} />} />
            <Route path="/profile" element={<ProtectedRoute element={<UserProfile />} />} />
            
            {/* Admin Routes */}

          </Routes>
        </div>
      </AuthProvider>
    </Router>
  )
}

export default App
