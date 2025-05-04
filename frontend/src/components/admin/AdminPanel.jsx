import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getUsers, deleteUser, updateUser,
  getTickets, deleteTicket,
  getPayments, deletePayment,
  getNotes, deleteNote
} from '../../services/api';
import UserForm from '../admin/UserForm';
import TicketForm from '../admin/TicketForm';
import PaymentForm from '../admin/PaymentForm';
import NoteForm from '../admin/NoteForm';
import { useAuth } from '../../context/AuthContext';
// Import jspdf and jspdf-autotable for PDF generation
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const AdminPanel = () => {
  const navigate = useNavigate();
  const { currentUser, isAdmin } = useAuth();
  
  // Log authentication status for debugging
  useEffect(() => {
    console.log("AdminPanel - Current user:", currentUser);
    console.log("AdminPanel - Is admin:", isAdmin);
    
    if (!currentUser) {
      console.error("User not logged in, redirecting to login");
      navigate('/login');
      return;
    }
    
    if (!isAdmin) {
      console.error("User is not an admin, should be redirected by ProtectedRoute");
    }
  }, [currentUser, isAdmin, navigate]);

  // State for different data types
  const [users, setUsers] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [payments, setPayments] = useState([]);
  const [notes, setNotes] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Search state
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [paymentSearchQuery, setPaymentSearchQuery] = useState('');
  const [ticketSearchQuery, setTicketSearchQuery] = useState('');
  const [noteSearchQuery, setNoteSearchQuery] = useState('');

  // State for editing items
  const [editingUser, setEditingUser] = useState(null);
  const [editingTicket, setEditingTicket] = useState(null);
  const [editingPayment, setEditingPayment] = useState(null);
  const [editingNote, setEditingNote] = useState(null);

  // Fetch data based on active tab
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const userData = await getUsers(); 
        const ticketData = await getTickets();
        const paymentData = await getPayments();
        const noteData = await getNotes();

        // Ensure all data is initialized as arrays even if API returns null/undefined
        setUsers(Array.isArray(userData) ? userData : []);
        setTickets(Array.isArray(ticketData) ? ticketData : []);
        setPayments(Array.isArray(paymentData) ? paymentData : []);
        setNotes(Array.isArray(noteData) ? noteData : []);

        console.log('Data fetched successfully');
      } catch (err) {
        // Set empty arrays when error occurs
        setUsers([]);
        setTickets([]);
        setPayments([]);
        setNotes([]);
        setError(err.message || 'An error occurred while fetching data');
        console.error('Error fetching data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  const handleViewTicket = (ticketId) => {
    navigate(`/tickets/${ticketId}`);
  }

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  // User Management Handlers
  const handleUserCreated = (newUser) => {
    // Handle both response formats (direct or with data property)
    const userData = newUser.data || newUser;
    setUsers([...users, userData]);
  };

  const handleUserUpdated = (updatedUser) => {
    // Handle both response formats (direct or with data property)
    const userData = updatedUser.data || updatedUser;
    setUsers(users.map(user => user._id === userData._id ? userData : user));
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(id);
        setUsers(users.filter(user => user._id !== id));
      } catch (error) {
        setError("Failed to delete user: " + error.message);
      }
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
  };
  // Ticket Management Handlers
  const handleTicketCreated = (newTicket) => {
    // Handle both response formats (direct or with data property)
    const ticketData = newTicket.data || newTicket;
    setTickets([...tickets, ticketData]);
  };

  const handleTicketUpdated = (updatedTicket) => {
    // Handle both response formats (direct or with data property)
    const ticketData = updatedTicket.data || updatedTicket;
    setTickets(tickets.map(ticket => ticket._id === ticketData._id ? ticketData : ticket));
  };

  const handleDeleteTicket = async (id) => {
    if (window.confirm("Are you sure you want to delete this ticket?")) {
      try {
        await deleteTicket(id);
        setTickets(tickets.filter(ticket => ticket._id !== id));
      } catch (error) {
        setError("Failed to delete ticket: " + error.message);
      }
    }
  };

  const handleEditTicket = (ticket) => {
    setEditingTicket(ticket);
  };
  // Payment Management Handlers
  const handlePaymentCreated = (newPayment) => {
    // Handle both response formats (direct or with data property)
    const paymentData = newPayment.data || newPayment;
    setPayments([...payments, paymentData]);
  };

  const handlePaymentUpdated = (updatedPayment) => {
    // Handle both response formats (direct or with data property)
    const paymentData = updatedPayment.data || updatedPayment;
    setPayments(payments.map(payment => payment._id === paymentData._id ? paymentData : payment));
  };

  const handleDeletePayment = async (id) => {
    if (window.confirm("Are you sure you want to delete this payment?")) {
      try {
        await deletePayment(id);
        setPayments(payments.filter(payment => payment._id !== id));
      } catch (error) {
        setError("Failed to delete payment: " + error.message);
      }
    }
  };

  const handleEditPayment = (payment) => {
    setEditingPayment(payment);
  };
  // Note Management Handlers
  const handleNoteCreated = (newNote) => {
    // Handle both response formats (direct or with data property)
    const noteData = newNote.data || newNote;
    setNotes([...notes, noteData]);
  };

  const handleNoteUpdated = (updatedNote) => {
    // Handle both response formats (direct or with data property)
    const noteData = updatedNote.data || updatedNote;
    setNotes(notes.map(note => note._id === noteData._id ? noteData : note));
  };

  const handleDeleteNote = async (id) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      try {
        await deleteNote(id);
        setNotes(notes.filter(note => note._id !== id));
      } catch (error) {
        setError("Failed to delete note: " + error.message);
      }
    }
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
  };

  // Render dashboard
  const renderDashboard = () => {
    // Get ticket statistics
    const openTickets = tickets.filter(ticket => ticket.status === 'open').length;
    const inProgressTickets = tickets.filter(ticket => ticket.status === 'in_progress').length;
    const resolvedTickets = tickets.filter(ticket => ticket.status === 'resolved').length;
    
    // Get payment statistics
    const completedPayments = payments.filter(payment => payment.status === 'completed').length;
    const pendingPayments = payments.filter(payment => payment.status === 'pending').length;
    const totalPaymentAmount = payments.reduce((sum, payment) => sum + (payment.amount || 0), 0);

    return (
      <div className="space-y-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gray-800/90 backdrop-blur-sm border border-gray-700 rounded-lg shadow p-6 transition-all duration-300 hover:shadow-lg hover:border-blue-500">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1 text-gray-200">Users</h3>
                <div className="text-3xl font-bold text-blue-400">{users.length}</div>
                <p className="text-gray-400 text-sm mt-1">Total registered accounts</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/90 backdrop-blur-sm border border-gray-700 rounded-lg shadow p-6 transition-all duration-300 hover:shadow-lg hover:border-green-500">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1 text-gray-200">Tickets</h3>
                <div className="text-3xl font-bold text-green-400">{tickets.length}</div>
                <p className="text-gray-400 text-sm mt-1">
                  <span className="inline-block px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 mr-1">{openTickets} open</span>
                  <span className="inline-block px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">{inProgressTickets} in progress</span>
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/90 backdrop-blur-sm border border-gray-700 rounded-lg shadow p-6 transition-all duration-300 hover:shadow-lg hover:border-purple-500">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1 text-gray-200">Payments</h3>
                <div className="text-3xl font-bold text-purple-400">${totalPaymentAmount.toFixed(2)}</div>
                <p className="text-gray-400 text-sm mt-1">
                  <span className="inline-block px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800 mr-1">{payments.length} total</span>
                  <span className="inline-block px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">{pendingPayments} pending</span>
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/90 backdrop-blur-sm border border-gray-700 rounded-lg shadow p-6 transition-all duration-300 hover:shadow-lg hover:border-orange-500">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1 text-gray-200">Notes</h3>
                <div className="text-3xl font-bold text-orange-400">{notes.length}</div>
                <p className="text-gray-400 text-sm mt-1">User documentation entries</p>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recent Tickets */}
          <div className="bg-gray-800/90 backdrop-blur-sm border border-gray-700 rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-200 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              Recent Tickets
            </h3>
            <div className="space-y-3">
              {tickets.slice(0, 5).map(ticket => (
                <div key={ticket._id} className="border-l-4 border-green-500 pl-4 py-2">
                  <p className="font-medium text-gray-300">{ticket.title}</p>
                  <div className="flex items-center mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs mr-2 ${
                      ticket.status === 'open' ? 'bg-green-100 text-green-800' :
                      ticket.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : 
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {ticket.status}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(ticket.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
              {tickets.length === 0 && (
                <p className="text-gray-400 text-center py-4">No tickets found</p>
              )}
            </div>
          </div>

          {/* Recent Payments */}
          <div className="bg-gray-800/90 backdrop-blur-sm border border-gray-700 rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-200 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Recent Payments
            </h3>
            <div className="space-y-3">
              {payments.slice(0, 5).map(payment => (
                <div key={payment._id} className="border-l-4 border-purple-500 pl-4 py-2">
                  <div className="flex justify-between">
                    <p className="font-medium text-gray-300">${payment.amount?.toFixed(2)}</p>
                    <p className="text-sm text-gray-400">{payment.payment_method}</p>
                  </div>
                  <div className="flex items-center mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs mr-2 ${
                      payment.status === 'completed' ? 'bg-green-100 text-green-800' :
                      payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {payment.status}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(payment.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
              {payments.length === 0 && (
                <p className="text-gray-400 text-center py-4">No payments found</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render user list
  const renderUsers = () => {
    // Filter users based on search query
    const filteredUsers = users.filter(user => {
      // If no search query, return all users
      if (!userSearchQuery) {
        return true;
      }
      
      const query = userSearchQuery.toLowerCase();
      const matchesQuery = (
        (user.username && user.username.toLowerCase().includes(query)) ||
        (user.email && user.email.toLowerCase().includes(query)) ||
        (user.role && user.role.toLowerCase().includes(query))
      );
      
      return matchesQuery;
    });
    
    // Download individual user record as PDF
    const handleDownloadSinglePDF = (user) => {
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text("User Record", 105, 15, { align: 'center' });
      
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text("ITPMx System", 105, 22, { align: 'center' });
      doc.text(`Generated on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 105, 28, { align: 'center' });
      
      doc.setLineWidth(0.5);
      doc.line(20, 32, 190, 32);
      
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(14);
      doc.text("User Details", 20, 42);
      
      // User information
      const startY = 50;
      const lineHeight = 8;
      
      doc.setFontSize(11);
      doc.text(`User ID: ${user._id || 'N/A'}`, 20, startY);
      doc.text(`Username: ${user.username || 'N/A'}`, 20, startY + lineHeight);
      doc.text(`Email: ${user.email || 'N/A'}`, 20, startY + lineHeight * 2);
      doc.text(`Role: ${user.role || 'user'}`, 20, startY + lineHeight * 3);
      doc.text(`Date Created: ${new Date(user.created_at).toLocaleDateString()}`, 20, startY + lineHeight * 4);
      
      if (user.last_login) {
        doc.text(`Last Login: ${new Date(user.last_login).toLocaleDateString()} ${new Date(user.last_login).toLocaleTimeString()}`, 20, startY + lineHeight * 5);
      }
      
      // Footer
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text('This is an official document from ITPMx System.', 105, 280, { align: 'center' });
      
      doc.save(`user_${user._id}.pdf`);
    };
    
    // Download all users as PDF
    const handleDownloadAllPDF = () => {
      const doc = new jsPDF();
      
      doc.setFontSize(16);
      doc.text("Users Report", 105, 15, { align: 'center' });
      
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text("ITPMx System", 105, 22, { align: 'center' });
      doc.text(`Generated on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 105, 28, { align: 'center' });
      doc.text(`Total Users: ${filteredUsers.length}`, 105, 34, { align: 'center' });
      
      doc.setLineWidth(0.5);
      doc.line(20, 38, 190, 38);
      
      // Create table with autoTable plugin
      doc.autoTable({
        startY: 45,
        head: [['Username', 'Email', 'Role', 'Created Date']],
        body: filteredUsers.map(user => [
          user.username || 'N/A',
          user.email || 'N/A',
          user.role || 'user',
          new Date(user.created_at).toLocaleDateString()
        ]),
        theme: 'striped',
        headStyles: {
          fillColor: [66, 66, 66],
          textColor: [250, 250, 250]
        },
        alternateRowStyles: {
          fillColor: [240, 240, 240]
        }
      });
      
      // Footer
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text('This is an official document from ITPMx System.', 105, 280, { align: 'center' });
      
      // Save the PDF with a custom name
      doc.save(`users_report_${new Date().toISOString().slice(0, 10)}.pdf`);
    };

    return (
      <div className="w-full overflow-x-auto">
        <h2 className="text-xl font-bold mb-4">User Management</h2>
        
        {/* Search bar and download all button */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative w-full md:w-1/2">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
              </svg>
            </div>
            <input 
              type="search" 
              className="bg-gray-700 border border-gray-600 text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5" 
              placeholder="Search by username, email, role..." 
              value={userSearchQuery}
              onChange={(e) => setUserSearchQuery(e.target.value)}
            />
          </div>
          <button
            onClick={handleDownloadAllPDF}
            className="bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg text-sm px-5 py-2.5 flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            Download Users PDF
          </button>
        </div>

        <UserForm
          onUserCreated={handleUserCreated}
          onUserUpdated={handleUserUpdated}
          editingUser={editingUser}
          setEditingUser={setEditingUser}
        />

        <table className="min-w-full bg-gray-800 text-gray-200 border border-gray-700">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b border-gray-600 bg-gray-900 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Username
              </th>
              <th className="py-2 px-4 border-b border-gray-600 bg-gray-900 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Email
              </th>
              <th className="py-2 px-4 border-b border-gray-600 bg-gray-900 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Role
              </th>
              <th className="py-2 px-4 border-b border-gray-600 bg-gray-900 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Created
              </th>
              <th className="py-2 px-4 border-b border-gray-600 bg-gray-900 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-4 px-6 border-b border-gray-600 text-center text-gray-400">
                  {users.length === 0 ? "No users found" : "No users match your search criteria"}
                </td>
              </tr>
            ) : (
              filteredUsers.map(user => (
                <tr key={user._id}>
                  <td className="py-2 px-4 border-b border-gray-600">{user.username}</td>
                  <td className="py-2 px-4 border-b border-gray-600">{user.email}</td>
                  <td className="py-2 px-4 border-b border-gray-600">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                      user.role === 'manager' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {user.role || 'user'}
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b border-gray-600">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-600">
                    <div className="flex flex-row items-center space-x-1">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                        title="Edit User"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                        title="Delete User"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDownloadSinglePDF(user)}
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded"
                        title="Download as PDF"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        
        {/* User statistics summary */}
        {filteredUsers.length > 0 && (
          <div className="mt-4 p-4 bg-gray-700/50 rounded-lg text-sm">
            <div className="flex flex-wrap gap-4">
              <div>
                <span className="font-semibold">Total Users:</span> {filteredUsers.length}
              </div>
              <div>
                <span className="font-semibold">Admins:</span> {filteredUsers.filter(u => u.role === 'admin').length}
              </div>
              <div>
                <span className="font-semibold">Regular Users:</span> {filteredUsers.filter(u => u.role !== 'admin').length}
              </div>
              <div>
                <span className="font-semibold">Recent Users:</span> {filteredUsers.filter(u => {
                  const thirtyDaysAgo = new Date();
                  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                  return new Date(u.created_at) > thirtyDaysAgo;
                }).length} (last 30 days)
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render ticket list
  const renderTickets = () => {
    // Filter tickets based on search query
    const filteredTickets = tickets.filter(ticket => {
      // If no search query, return all tickets
      if (!ticketSearchQuery) {
        return true;
      }
      
      const query = ticketSearchQuery.toLowerCase();
      const matchesQuery = (
        (ticket.name && ticket.name.toLowerCase().includes(query)) ||
        (ticket.email && ticket.email.toLowerCase().includes(query)) ||
        (ticket.status && ticket.status.toLowerCase().includes(query)) ||
        (ticket.priority && ticket.priority.toLowerCase().includes(query)) ||
        (ticket.inquiry_type && ticket.inquiry_type.toLowerCase().includes(query))
      );
      
      return matchesQuery;
    });
    
    // Download individual ticket record as PDF
    const handleDownloadSinglePDF = (ticket) => {
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text("Ticket Record", 105, 15, { align: 'center' });
      
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text("ITPMx System", 105, 22, { align: 'center' });
      doc.text(`Generated on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 105, 28, { align: 'center' });
      
      doc.setLineWidth(0.5);
      doc.line(20, 32, 190, 32);
      
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(14);
      doc.text("Ticket Details", 20, 42);
      
      // Ticket information
      const startY = 50;
      const lineHeight = 8;
      
      doc.setFontSize(11);
      doc.text(`Ticket ID: ${ticket._id || 'N/A'}`, 20, startY);
      doc.text(`Name: ${ticket.name || 'N/A'}`, 20, startY + lineHeight);
      doc.text(`Email: ${ticket.email || 'N/A'}`, 20, startY + lineHeight * 2);
      doc.text(`Type: ${ticket.inquiry_type?.replace('_', ' ') || 'N/A'}`, 20, startY + lineHeight * 3);
      doc.text(`Status: ${ticket.status || 'N/A'}`, 20, startY + lineHeight * 4);
      doc.text(`Priority: ${ticket.priority || 'N/A'}`, 20, startY + lineHeight * 5);
      doc.text(`Date: ${new Date(ticket.created_at).toLocaleDateString()}`, 20, startY + lineHeight * 6);
      
      if (ticket.message) {
        doc.text("Message:", 20, startY + lineHeight * 7);
        
        // Handle long messages with wrapping
        const splitMessage = doc.splitTextToSize(ticket.message, 170);
        doc.text(splitMessage, 20, startY + lineHeight * 8);
      }
      
      // Footer
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text('This is an official document from ITPMx System.', 105, 280, { align: 'center' });
      
      doc.save(`ticket_${ticket._id}.pdf`);
    };

    return (
      <div className="w-full overflow-x-auto">
        <h2 className="text-xl font-bold mb-4">Ticket Management</h2>
        
        {/* Search bar */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative w-full md:w-1/2">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
              </svg>
            </div>
            <input 
              type="search" 
              className="bg-gray-700 border border-gray-600 text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5" 
              placeholder="Search by name, email, status, priority..." 
              value={ticketSearchQuery}
              onChange={(e) => setTicketSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Only render the TicketForm when editing a ticket */}
        {editingTicket && (
          <TicketForm
            onTicketUpdated={handleTicketUpdated}
            editingTicket={editingTicket}
            setEditingTicket={setEditingTicket}
          />
        )}

        <table className="min-w-full bg-gray-800 text-gray-200 border border-gray-700">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b border-gray-600 bg-gray-900 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Name
              </th>
              <th className="py-2 px-4 border-b border-gray-600 bg-gray-900 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Email
              </th>
              <th className="py-2 px-4 border-b border-gray-600 bg-gray-900 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Type
              </th>
              <th className="py-2 px-4 border-b border-gray-600 bg-gray-900 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="py-2 px-4 border-b border-gray-600 bg-gray-900 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Priority
              </th>
              <th className="py-2 px-4 border-b border-gray-600 bg-gray-900 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Date
              </th>
              <th className="py-2 px-4 border-b border-gray-600 bg-gray-900 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-4 px-6 border-b border-gray-600 text-center text-gray-400">
                  {tickets.length === 0 ? "No tickets found" : "No tickets match your search criteria"}
                </td>
              </tr>
            ) : (
              filteredTickets.map(ticket => (
                <tr key={ticket._id}>
                  <td className="py-2 px-4 border-b border-gray-600">
                    {/* Use username if user object exists, otherwise fall back to ticket.name */}
                    {ticket.name || ticket.name || 'Unknown'}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-600">{ticket.email}</td>
                  <td className="py-2 px-4 border-b border-gray-600">
                    <span className={`px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800`}>
                      {ticket.inquiry_type?.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b border-gray-600">
                    <span className={`px-2 py-1 rounded-full text-xs ${ticket.status === 'open' ? 'bg-green-100 text-green-800' :
                      ticket.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                        ticket.status === 'resolved' ? 'bg-gray-100 text-gray-800' :
                          'bg-red-100 text-red-800'
                      }`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b border-gray-600">
                    <span className={`px-2 py-1 rounded-full text-xs ${ticket.priority === 'low' ? 'bg-gray-100 text-gray-800' :
                      ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        ticket.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'
                      }`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b border-gray-600">
                    {new Date(ticket.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-600">
                    <div className="flex flex-row items-center space-x-1">
                      <button
                        onClick={() => handleEditTicket(ticket)}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                        title="Edit Ticket"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteTicket(ticket._id)}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                        title="Delete Ticket"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                      </button>
                      <button
                        onClick={() => handleViewTicket(ticket._id)}
                        className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-1 px-2 rounded"
                        title="View Ticket Details"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDownloadSinglePDF(ticket)}
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded"
                        title="Download as PDF"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        
        {/* Ticket summary */}
        <div className="mt-4 p-4 bg-gray-700/50 rounded-lg text-sm">
          <div className="flex flex-wrap gap-4">
            <div>
              <span className="font-semibold">Total Tickets:</span> {filteredTickets.length}
            </div>
            <div>
              <span className="font-semibold">Open:</span> {filteredTickets.filter(t => t.status === 'open').length}
            </div>
            <div>
              <span className="font-semibold">In Progress:</span> {filteredTickets.filter(t => t.status === 'in_progress').length}
            </div>
            <div>
              <span className="font-semibold">Resolved:</span> {filteredTickets.filter(t => t.status === 'resolved').length}
            </div>
            <div>
              <span className="font-semibold">High Priority:</span> {filteredTickets.filter(t => t.priority === 'high').length}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render payment list
  const renderPayments = () => {
    // Filter payments based on search query only (removing filter)
    const filteredPayments = payments.filter(payment => {
      // If no search query, return all payments
      if (!paymentSearchQuery) {
        return true;
      }
      
      const query = paymentSearchQuery.toLowerCase();
      const matchesQuery = (
        (payment.user?.username && payment.user.username.toLowerCase().includes(query)) ||
        (payment.payment_method && payment.payment_method.toLowerCase().includes(query)) ||
        (payment.status && payment.status.toLowerCase().includes(query)) ||
        (payment.amount && payment.amount.toString().includes(query))
      );
      
      return matchesQuery;
    });

    // Download individual payment record as PDF
    const handleDownloadSinglePDF = (payment) => {
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text("Payment Record", 105, 15, { align: 'center' });
      
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text("ITPMx System", 105, 22, { align: 'center' });
      doc.text(`Generated on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 105, 28, { align: 'center' });
      
      doc.setLineWidth(0.5);
      doc.line(20, 32, 190, 32);
      
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(14);
      doc.text("Payment Details", 20, 42);
      
      // Payment information
      const startY = 50;
      const lineHeight = 8;
      
      doc.setFontSize(11);
      doc.text(`Payment ID: ${payment._id || 'N/A'}`, 20, startY);
      doc.text(`User: ${payment.user?.username || 'Unknown'}`, 20, startY + lineHeight);
      doc.text(`Amount: $${payment.amount?.toFixed(2) || '0.00'}`, 20, startY + lineHeight * 2);
      doc.text(`Payment Method: ${payment.payment_method || 'N/A'}`, 20, startY + lineHeight * 3);
      doc.text(`Status: ${payment.status || 'N/A'}`, 20, startY + lineHeight * 4);
      doc.text(`Date: ${new Date(payment.created_at).toLocaleDateString()}`, 20, startY + lineHeight * 5);
      
      if (payment.description) {
        doc.text(`Description: ${payment.description}`, 20, startY + lineHeight * 6);
      }
      
      // Footer
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text('This is an official document from ITPMx System.', 105, 280, { align: 'center' });
      
      doc.save(`payment_${payment._id}.pdf`);
    };

    return (
      <div className="w-full overflow-x-auto">
        <h2 className="text-xl font-bold mb-4">Payment Management</h2>
        
        {/* Search bar without filter */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative w-full md:w-1/2">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
              </svg>
            </div>
            <input 
              type="search" 
              className="bg-gray-700 border border-gray-600 text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5" 
              placeholder="Search by username, payment method, amount..." 
              value={paymentSearchQuery}
              onChange={(e) => setPaymentSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        {/* Only render the PaymentForm when editing a payment */}
        {editingPayment && (
          <PaymentForm
            onPaymentUpdated={handlePaymentUpdated}
            editingPayment={editingPayment}
            setEditingPayment={setEditingPayment}
          />
        )}

        <table className="min-w-full bg-gray-800 text-gray-200 border border-gray-700">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b border-gray-600 bg-gray-900 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                User
              </th>
              <th className="py-2 px-4 border-b border-gray-600 bg-gray-900 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Amount
              </th>
              <th className="py-2 px-4 border-b border-gray-600 bg-gray-900 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Payment Method
              </th>
              <th className="py-2 px-4 border-b border-gray-600 bg-gray-900 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="py-2 px-4 border-b border-gray-600 bg-gray-900 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Date
              </th>
              <th className="py-2 px-4 border-b border-gray-600 bg-gray-900 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-4 px-6 border-b border-gray-600 text-center text-gray-400">
                  {payments.length === 0 ? "No payments found" : "No payments match your search criteria"}
                </td>
              </tr>
            ) : (
              filteredPayments.map(payment => (
                <tr key={payment._id}>
                  <td className="py-2 px-4 border-b border-gray-600">
                    {payment.name || 'Unknown'}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-600">
                    ${payment.amount?.toFixed(2)}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-600">
                    {payment.payment_method}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-600">
                    <span className={`px-2 py-1 rounded-full text-xs ${payment.status === 'completed' ? 'bg-green-100 text-green-800' :
                      payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        payment.status === 'failed' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                      }`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b border-gray-600">
                    {new Date(payment.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-600">
                    <div className="flex flex-row items-center space-x-1">
                      <button
                        onClick={() => handleEditPayment(payment)}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                        title="Edit Payment"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeletePayment(payment._id)}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                        title="Delete Payment"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDownloadSinglePDF(payment)}
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded"
                        title="Download as PDF"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        
        {/* Payment summary */}
        <div className="mt-4 p-4 bg-gray-700/50 rounded-lg text-sm">
          <div className="flex flex-wrap gap-4">
            <div>
              <span className="font-semibold">Total Payments:</span> {filteredPayments.length}
            </div>
            <div>
              <span className="font-semibold">Total Amount:</span> ${filteredPayments.reduce((sum, payment) => sum + (payment.amount || 0), 0).toFixed(2)}
            </div>
            <div>
              <span className="font-semibold">Completed:</span> {filteredPayments.filter(p => p.status === 'completed').length}
            </div>
            <div>
              <span className="font-semibold">Pending:</span> {filteredPayments.filter(p => p.status === 'pending').length}
            </div>
            <div>
              <span className="font-semibold">Failed:</span> {filteredPayments.filter(p => p.status === 'failed').length}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render note list
  const renderNotes = () => {
    // Filter notes based on search query
    const filteredNotes = notes.filter(note => {
      // If no search query, return all notes
      if (!noteSearchQuery) {
        return true;
      }
      
      const query = noteSearchQuery.toLowerCase();
      const matchesQuery = (
        (note.title && note.title.toLowerCase().includes(query)) ||
        (note.content && note.content.toLowerCase().includes(query)) ||
        (note.category && note.category.toLowerCase().includes(query)) ||
        (note.user?.username && note.user.username.toLowerCase().includes(query))
      );
      
      return matchesQuery;
    });

    // Download individual note as PDF
    const handleDownloadSinglePDF = (note) => {
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text("Note Record", 105, 15, { align: 'center' });
      
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text("ITPMx System", 105, 22, { align: 'center' });
      doc.text(`Generated on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 105, 28, { align: 'center' });
      
      doc.setLineWidth(0.5);
      doc.line(20, 32, 190, 32);
      
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(14);
      doc.text("Note Details", 20, 42);
      
      // Note information
      const startY = 50;
      const lineHeight = 8;
      
      doc.setFontSize(11);
      doc.text(`Note ID: ${note._id || 'N/A'}`, 20, startY);
      doc.text(`Title: ${note.title || 'N/A'}`, 20, startY + lineHeight);
      doc.text(`Category: ${note.category || 'Uncategorized'}`, 20, startY + lineHeight * 2);
      doc.text(`User: ${note.user?.username || 'Unknown'}`, 20, startY + lineHeight * 3);
      doc.text(`Date: ${new Date(note.created_at).toLocaleDateString()}`, 20, startY + lineHeight * 4);
      
      doc.text("Content:", 20, startY + lineHeight * 6);
      
      // Handle long content with wrapping
      const splitContent = doc.splitTextToSize(note.content || 'No content', 170);
      doc.text(splitContent, 20, startY + lineHeight * 7);
      
      // Footer
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text('This is an official document from ITPMx System.', 105, 280, { align: 'center' });
      
      doc.save(`note_${note._id}.pdf`);
    };

    return (
      <div className="w-full overflow-x-auto">
        <h2 className="text-xl font-bold mb-4">Note Management</h2>
        
        {/* Search bar */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative w-full md:w-1/2">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
              </svg>
            </div>
            <input 
              type="search" 
              className="bg-gray-700 border border-gray-600 text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5" 
              placeholder="Search by title, content, category, username..." 
              value={noteSearchQuery}
              onChange={(e) => setNoteSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <NoteForm
          onNoteAdded={handleNoteCreated}
          onNoteUpdated={handleNoteUpdated}
          editingNote={editingNote}
          setEditingNote={setEditingNote}
        />

        <table className="min-w-full bg-gray-800 text-gray-200 border border-gray-700">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b border-gray-600 bg-gray-900 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Title
              </th>
              <th className="py-2 px-4 border-b border-gray-600 bg-gray-900 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Content
              </th>
              <th className="py-2 px-4 border-b border-gray-600 bg-gray-900 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Category
              </th>
              <th className="py-2 px-4 border-b border-gray-600 bg-gray-900 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                User
              </th>
              <th className="py-2 px-4 border-b border-gray-600 bg-gray-900 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Date
              </th>
              <th className="py-2 px-4 border-b border-gray-600 bg-gray-900 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredNotes.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-4 px-6 border-b border-gray-600 text-center text-gray-400">
                  {notes.length === 0 ? "No notes found" : "No notes match your search criteria"}
                </td>
              </tr>
            ) : (
              filteredNotes.map(note => (
                <tr key={note._id}>
                  <td className="py-2 px-4 border-b border-gray-600">{note.title}</td>
                  <td className="py-2 px-4 border-b border-gray-600">
                    {note.content?.length > 50
                      ? `${note.content.substring(0, 50)}...`
                      : note.content}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-600">
                    <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                      {note.category || 'Uncategorized'}
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b border-gray-600">
                    {note.user?.username || 'Unknown'}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-600">
                    {new Date(note.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-600">
                    <div className="flex flex-row items-center space-x-1">
                      <button
                        onClick={() => handleEditNote(note)}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                        title="Edit Note"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteNote(note._id)}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                        title="Delete Note"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDownloadSinglePDF(note)}
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded"
                        title="Download as PDF"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        
        {/* Note summary */}
        <div className="mt-4 p-4 bg-gray-700/50 rounded-lg text-sm">
          <div className="flex flex-wrap gap-4">
            <div>
              <span className="font-semibold">Total Notes:</span> {filteredNotes.length}
            </div>
            <div>
              <span className="font-semibold">With Categories:</span> {filteredNotes.filter(n => n.category && n.category.trim() !== '').length}
            </div>
            <div>
              <span className="font-semibold">Uncategorized:</span> {filteredNotes.filter(n => !n.category || n.category.trim() === '').length}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render loading and error states
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 m-4" role="alert">
        <p className="font-bold">Error</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-200">Admin Panel</h1>

      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="w-full md:w-1/5">
          <div className="bg-gray-800/90 backdrop-blur-sm border border-gray-700 shadow rounded-md overflow-hidden">
            <div className="p-4 bg-gray-900 text-white">
              <h2 className="text-xl font-bold">Navigation</h2>
            </div>
            <div className="py-2">
              <button
                className={`w-full text-left py-2 px-4 hover:bg-gray-700 text-gray-200 ${activeTab === 'dashboard' ? 'bg-blue-900/80 font-bold text-blue-200' : ''}`}
                onClick={() => handleTabChange('dashboard')}
              >
                Dashboard
              </button>
              <button
                className={`w-full text-left py-2 px-4 hover:bg-gray-700 text-gray-200 ${activeTab === 'users' ? 'bg-blue-900/80 font-bold text-blue-200' : ''}`}
                onClick={() => handleTabChange('users')}
              >
                Users
              </button>
              <button
                className={`w-full text-left py-2 px-4 hover:bg-gray-700 text-gray-200 ${activeTab === 'tickets' ? 'bg-blue-900/80 font-bold text-blue-200' : ''}`}
                onClick={() => handleTabChange('tickets')}
              >
                Tickets
              </button>
              <button
                className={`w-full text-left py-2 px-4 hover:bg-gray-700 text-gray-200 ${activeTab === 'payments' ? 'bg-blue-900/80 font-bold text-blue-200' : ''}`}
                onClick={() => handleTabChange('payments')}
              >
                Payments
              </button>
              <button
                className={`w-full text-left py-2 px-4 hover:bg-gray-700 text-gray-200 ${activeTab === 'notes' ? 'bg-blue-900/80 font-bold text-blue-200' : ''}`}
                onClick={() => handleTabChange('notes')}
              >
                Notes
              </button>
            </div>
          </div>
        </div>

        <div className="w-full md:w-4/5">
          <div className="bg-gray-800/90 backdrop-blur-sm border border-gray-700 shadow rounded-md p-6 text-gray-200">
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'users' && renderUsers()}
            {activeTab === 'tickets' && renderTickets()}
            {activeTab === 'payments' && renderPayments()}
            {activeTab === 'notes' && renderNotes()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
