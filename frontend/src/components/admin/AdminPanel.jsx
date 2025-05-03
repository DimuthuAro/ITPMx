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
    return (
      <div className="w-full overflow-x-auto">
        <h2 className="text-xl font-bold mb-4">User Management</h2>

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
            {users && users.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-4 px-6 border-b border-gray-600 text-center text-gray-400">
                  No users found
                </td>
              </tr>
            ) : (
              users.map(user => (
                <tr key={user._id}>
                  <td className="py-2 px-4 border-b border-gray-600">{user.username}</td>
                  <td className="py-2 px-4 border-b border-gray-600">{user.email}</td>
                  <td className="py-2 px-4 border-b border-gray-600">{user.role || 'user'}</td>
                  <td className="py-2 px-4 border-b border-gray-600">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-600">
                    <button
                      onClick={() => handleEditUser(user)}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    );
  };

  // Render ticket list
  const renderTickets = () => {
    return (
      <div className="w-full overflow-x-auto">
        <h2 className="text-xl font-bold mb-4">Ticket Management</h2>

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
            {tickets && tickets.length === 0 ? (
              <tr>
                <td colSpan="8" className="py-4 px-6 border-b border-gray-600 text-center text-gray-400">
                  No tickets found
                </td>
              </tr>
            ) : (
              tickets.map(ticket => (
                <tr key={ticket._id}>
                  <td className="py-2 px-4 border-b border-gray-600">{ticket.name}</td>
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
                    <button
                      onClick={() => handleEditTicket(ticket)}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTicket(ticket._id)}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded mr-2"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleViewTicket(ticket._id)}
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    );
  };

  // Render payment list
  const renderPayments = () => {
    return (
      <div className="w-full overflow-x-auto">
        <h2 className="text-xl font-bold mb-4">Payment Management</h2>
        
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
            {payments && payments.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-4 px-6 border-b border-gray-600 text-center text-gray-400">
                  No payments found
                </td>
              </tr>
            ) : (
              payments.map(payment => (
                <tr key={payment._id}>
                  <td className="py-2 px-4 border-b border-gray-600">
                    {payment.user?.username || 'Unknown'}
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
                    <button
                      onClick={() => handleEditPayment(payment)}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeletePayment(payment._id)}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    );
  };

  // Render note list
  const renderNotes = () => {
    return (
      <div className="w-full overflow-x-auto">
        <h2 className="text-xl font-bold mb-4">Note Management</h2>

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
            {notes && notes.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-4 px-6 border-b border-gray-600 text-center text-gray-400">
                  No notes found
                </td>
              </tr>
            ) : (
              notes.map(note => (
                <tr key={note._id}>
                  <td className="py-2 px-4 border-b border-gray-600">{note.title}</td>
                  <td className="py-2 px-4 border-b border-gray-600">
                    {note.content?.length > 50
                      ? `${note.content.substring(0, 50)}...`
                      : note.content}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-600">{note.category || 'Uncategorized'}</td>
                  <td className="py-2 px-4 border-b border-gray-600">
                    {note.user?.username || 'Unknown'}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-600">
                    {new Date(note.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-600">
                    <button
                      onClick={() => handleEditNote(note)}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteNote(note._id)}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
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
