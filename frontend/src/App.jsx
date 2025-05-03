import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

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

// Import ticket and payment components
import TicketsList from './pages/user/TicketsList';
import TicketDetail from './pages/user/TicketDetail';
import TicketForm from './pages/user/TicketForm';
import PaymentsList from './pages/user/PaymentsList';
import PaymentForm from './pages/user/PaymentForm';
import PricePlan from './pages/user/PricePlan';
import FAQ from './pages/user/FAQ';
import Support from './pages/user/Support';

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
    console.log(`Access denied: Required role ${requiredRole}, user has role ${userObj.role || 'none'}`);
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
        {/* Dark overlay applied to background image */}
        <div className="min-h-screen bg-cover bg-center bg-opacity-50 relative" style={{ backgroundImage: "url('bg.jpg')" }}>
          {/* Dark overlay for professional look */}
          <div className="absolute inset-0 bg-black/70 z-0"></div>
          
          {/* Content with z-index to appear above the overlay */}
          <div className="relative z-10">
            <Navbar />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected User Routes */}
              <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
              
              {/* Note Routes */}
              <Route path="/notes/:id" element={<ProtectedRoute element={<NoteDetail />} />} />
              <Route path="/notes/create" element={<ProtectedRoute element={<NoteForm />} />} />
              <Route path="/notes/edit/:id" element={<ProtectedRoute element={<NoteForm />} />} />
              
              {/* Ticket Routes */}
              <Route path="/tickets" element={<ProtectedRoute element={<TicketsList />} />} />
              <Route path="/tickets/:id" element={<ProtectedRoute element={<TicketDetail />} />} />
              <Route path="/tickets/create" element={<ProtectedRoute element={<TicketForm />} />} />
              <Route path="/tickets/edit/:id" element={<ProtectedRoute element={<TicketForm />} />} />
              <Route path="/support" element={<ProtectedRoute element={<Support />} />} />

              {/* Payment Routes */}
              <Route path="/payments" element={<ProtectedRoute element={<PaymentsList />} />} />
              <Route path="/payment/create" element={<ProtectedRoute element={<PaymentForm />} />} />
              <Route path="/pricing" element={<ProtectedRoute element={<PricePlan />} />} />
              <Route path="/profile" element={<ProtectedRoute element={<UserProfile />} />} />
              <Route path="/faq" element={<ProtectedRoute element={<FAQ />} />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<ProtectedRoute element={<AdminPanel />} requiredRolefaq="admin" />} />
            </Routes>
          </div>
        </div>
      </AuthProvider>
    </Router>
  )
}

export default App
