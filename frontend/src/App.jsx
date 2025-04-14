import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './services/UseAuth.jsx';

// Admin imports
import AdminDashboard from './admin/pages/Dashboard';
import AdminUsers from './admin/pages/crud/users/Users';
import AdminNotes from './admin/pages/crud/notes/Notes';
import AdminCreateUser from './admin/pages/crud/users/CreateUser';
import AdminEditUser from './admin/pages/crud/users/EditUser';
import AdminCreateNote from './admin/pages/crud/notes/CreateNote';
import AdminEditNote from './admin/pages/crud/notes/EditNote';
import AdminPayments from './admin/pages/crud/payments/Payments';
import AdminCreatePayment from './admin/pages/crud/payments/CreatePayment';
import AdminEditPayment from './admin/pages/crud/payments/EditPayment';
import AdminTickets from './admin/pages/crud/tickets/Tickets';
import AdminCreateTicket from './admin/pages/crud/tickets/CreateTicket';
import AdminEditTicket from './admin/pages/crud/tickets/EditTicket';
import AdminProfile from './admin/pages/auth/Profile';

// User-side imports
import UserNotes from './pages/user/notes/UserNotes';
import CreateUserNote from './pages/user/notes/CreateUserNote';
import EditUserNote from './pages/user/notes/EditUserNote';
import UserTickets from './pages/user/tickets/UserTickets';
import CreateUserTicket from './pages/user/tickets/CreateUserTicket';
import UserProfile from './pages/user/profile/UserProfile';

import Login from './pages/auth/Login';
import AppContainer from './components/layout/AppContainer';
import ErrorBoundary from './components/ErrorBoundary';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

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
    isAuthenticated: !isAuthenticated(), 
    currentUser: currentUser ? 'Exists' : 'Null' 
  });
  
  // If not authenticated, redirect to login
  if (isAuthenticated()) {
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

// User route component to check if user role is 'user'
const UserRoute = () => {
  const { currentUser, isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // Check if authenticated and has user role
  if (!isAuthenticated() || !currentUser || currentUser.role !== 'user') {
    return <Navigate to="/login" />;
  }
  
  return <Outlet />;
};

// Admin route component to check if user role is 'admin'
const AdminRoute = () => {
  const { currentUser, isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // Check if authenticated and has admin role
  if (!isAuthenticated() || !currentUser || currentUser.role !== 'admin') {
    return <Navigate to="/not-authorized" />;
  }
  
  return <Outlet />;
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
            
            <Route path="/not-authorized" element={<NotAutherized />} />
            
            {/* Admin Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AdminRoute />}>
                <Route element={<AppContainer />}>
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/profile" element={<AdminProfile />} />
                  
                  {/* Users */}
                  <Route path="/admin/users" element={<AdminUsers />} />
                  <Route path="/admin/users/create" element={<AdminCreateUser />} />
                  <Route path="/admin/users/edit/:id" element={<AdminEditUser />} />
                  
                  {/* Notes */}
                  <Route path="/admin/notes" element={<AdminNotes />} />
                  <Route path="/admin/notes/create" element={<AdminCreateNote />} />
                  <Route path="/admin/notes/edit/:id" element={<AdminEditNote />} />
                  
                  {/* Payments */}
                  <Route path="/admin/payments" element={<AdminPayments />} />
                  <Route path="/admin/payments/create" element={<AdminCreatePayment />} />
                  <Route path="/admin/payments/edit/:id" element={<AdminEditPayment />} />
                  
                  {/* Tickets */}
                  <Route path="/admin/tickets" element={<AdminTickets />} />
                  <Route path="/admin/tickets/create" element={<AdminCreateTicket />} />
                  <Route path="/admin/tickets/edit/:id" element={<AdminEditTicket />} />
                </Route>
              </Route>
            </Route>
            
            {/* User Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<UserRoute />}>
                <Route element={<AppContainer />}>
                  <Route path="/user/profile" element={<UserProfile />} />
                  
                  {/* User Notes */}
                  <Route path="/user/notes" element={<UserNotes />} />
                  <Route path="/user/notes/create" element={<CreateUserNote />} />
                  <Route path="/user/notes/edit/:noteId" element={<EditUserNote />} />
                  
                  {/* User Tickets */}
                  <Route path="/user/tickets" element={<UserTickets />} />
                  <Route path="/user/tickets/create" element={<CreateUserTicket />} />
                </Route>
              </Route>
            </Route>
            
            {/* Default Redirect - Check role and redirect accordingly */}
            <Route path="/" element={
              <RoleBasedRedirect />
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ErrorBoundary>
      </AuthProvider>
    </Router>
  );
};

// Component to redirect based on user role
const RoleBasedRedirect = () => {
  const { currentUser, isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }
  
  // Redirect based on user role
  if (currentUser?.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  } else {
    return <Navigate to="/user/notes" replace />;
  }
};

export default App;
