import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './services/UseAuth.jsx';
import Login from './pages/auth/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/crud/users/Users';
import Notes from './pages/crud/notes/Notes';
import AppContainer from './components/layout/AppContainer';
import ErrorBoundary from './components/ErrorBoundary';
import CreateUser from './pages/crud/users/CreateUser';
import EditUser from './pages/crud/users/EditUser';
import CreateNote from './pages/crud/notes/CreateNote';
import EditNote from './pages/crud/notes/EditNote';
import Payments from './pages/crud/payments/Payments';
import CreatePayment from './pages/crud/payments/CreatePayment';
import EditPayment from './pages/crud/payments/EditPayment';
import Tickets from './pages/crud/tickets/Tickets';
import CreateTicket from './pages/crud/tickets/CreateTicket';
import EditTicket from './pages/crud/tickets/EditTicket';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Profile from './pages/auth/Profile';

// Import layout components
import Navbar from './components/navbar';
import Header from './components/header';
import Footer from './components/footer';
import Sidebar from './components/sidebar';

//CRUD
import NotAutherized from './pages/NotAuthorized.jsx';

// Protected Route Component
const ProtectedRoute = () => {
  const { currentUser, isAuthenticated, loading } = useAuth();
  
  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // Debug authentication status
  console.log('ProtectedRoute - Auth Check:', { 
    isAuthenticated: isAuthenticated(), 
    currentUser: currentUser ? 'Exists' : 'Null' 
  });
  
  // If not authenticated, redirect to login
  if (!isAuthenticated()) {
    console.log('Not authenticated, redirecting to login');
    return <Navigate to="/login" />;
  }
  
  // User is authenticated, render the protected content
  console.log('User authenticated, rendering protected content');
  return <Outlet />;
};

// Public Route - Redirect to dashboard if already authenticated
const PublicRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  
  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // If authenticated, redirect to dashboard
  return isAuthenticated() ? <Navigate to="/dashboard" /> : <Outlet />;
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <ErrorBoundary>
          <Routes>
            {/* Public Routes */}
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
            </Route>
            
            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AppContainer />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                
                {/* Users */}
                <Route path="/users" element={<Users />} />
                <Route path="/create-user" element={<CreateUser />} />
                <Route path="/users/edit/:id" element={<EditUser />} />
                
                {/* Notes */}
                <Route path="/notes" element={<Notes />} />
                <Route path="/create-note" element={<CreateNote />} />
                <Route path="/notes/edit/:id" element={<EditNote />} />
                
                {/* Payments */}
                <Route path="/payments" element={<Payments />} />
                <Route path="/payments/create" element={<CreatePayment />} />
                <Route path="/payments/edit/:id" element={<EditPayment />} />
                
                {/* Tickets */}
                <Route path="/tickets" element={<Tickets />} />
                <Route path="/tickets/create" element={<CreateTicket />} />
                <Route path="/tickets/edit/:id" element={<EditTicket />} />
              </Route>
            </Route>
            
            {/* Default Redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </ErrorBoundary>
      </AuthProvider>
    </Router>
  );
};

export default App;
