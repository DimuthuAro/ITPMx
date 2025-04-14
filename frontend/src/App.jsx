import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from './services/apiConfig';
import { AuthProvider, useAuth } from './services/UseAuth.jsx';

// Pages imports
import NotAutherized from './pages/NotAuthorized.jsx';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// Admin imports
import Dashboard from './pages/admin/Dashboard.jsx';
import Users from './pages/admin/users/Users.jsx';
import Notes from './pages/admin/notes/Notes.jsx';
import CreateUser from './pages/admin/users/CreateUser.jsx';
import EditUser from './pages/admin/users/EditUser';
import CreateNote from './pages/admin/notes/CreateNote';
import EditNote from './pages/admin/notes/EditNote';
import Payments from './pages/admin/payments/Payments';
import CreatePayment from './pages/admin/payments/CreatePayment';
import EditPayment from './pages/admin/payments/EditPayment';
import Tickets from './pages/admin/tickets/Tickets';
import CreateTicket from './pages/admin/tickets/CreateTicket';
import EditTicket from './pages/admin/tickets/EditTicket';

// User-side imports
import UserDashboard from './pages/user/Dashboard.jsx';
import UserNotes from './pages/user/notes/UserNotes';
import CreateUserNote from './pages/user/notes/CreateUserNote';
import EditUserNote from './pages/user/notes/EditUserNote';
import UserTickets from './pages/user/tickets/UserTickets';
import CreateUserTicket from './pages/user/tickets/CreateUserTicket';
import UserProfile from './pages/user/profile/UserProfile';

// Import layout components
import AppContainer from './components/layout/AppContainer';
import ErrorBoundary from './components/ErrorBoundary';

// Set default base URL for all axios requests
axios.defaults.baseURL = API_BASE_URL;

// Protected Route wrapper for Admin routes
const AdminRoute = () => {
  const { currentUser, isAuthenticated } = useAuth();
  
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  
  if (currentUser?.role !== 'admin') {
    return <Navigate to="/not-authorized" replace />;
  }
  
  return <Outlet />;
};

// Protected Route wrapper for User routes
const UserRoute = () => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  
  return <Outlet />;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <ErrorBoundary>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/not-authorized" element={<NotAutherized />} />
            <Route path="/" element={<Navigate to="/login" />} />

            {/* Admin routes - All wrapped in AdminRoute for protection */}
            <Route path="/admin" element={<AppContainer />}>
              <Route element={<AdminRoute />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="users" element={<Users />} />
                <Route path="users/create" element={<CreateUser />} />
                <Route path="users/edit/:id" element={<EditUser />} />
                <Route path="notes" element={<Notes />} />
                <Route path="notes/create" element={<CreateNote />} />
                <Route path="notes/edit/:id" element={<EditNote />} />
                <Route path="payments" element={<Payments />} />
                <Route path="payments/create" element={<CreatePayment />} />
                <Route path="payments/edit/:id" element={<EditPayment />} />
                <Route path="tickets" element={<Tickets />} />
                <Route path="tickets/create" element={<CreateTicket />} />
                <Route path="tickets/edit/:id" element={<EditTicket />} />
              </Route>
            </Route>

            {/* User routes - All wrapped in UserRoute for protection */}
            <Route path="/user" element={<AppContainer />}>
              <Route element={<UserRoute />}>
                <Route path="profile" element={<UserProfile />} />
                <Route path="notes" element={<UserNotes />} />
                <Route path="notes/create" element={<CreateUserNote />} />
                <Route path="notes/edit/:id" element={<EditUserNote />} />
                <Route path="tickets" element={<UserTickets />} />
                <Route path="tickets/create" element={<CreateUserTicket />} />
              </Route>
            </Route>

            {/* Dashboard redirects based on user role */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedDashboardRoute />
              } 
            />

            {/* 404 route */}
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </ErrorBoundary>
      </Router>
    </AuthProvider>
  );
};

// ProtectedDashboardRoute to redirect users to the appropriate dashboard based on role
const ProtectedDashboardRoute = () => {
  const { currentUser, isAuthenticated } = useAuth();
  
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  
  if (currentUser?.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }
  
  return <Navigate to="/user/profile" replace />;
};

export default App;
