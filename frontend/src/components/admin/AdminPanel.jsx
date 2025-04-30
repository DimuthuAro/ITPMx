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

const AdminPanel = () => {
  const navigate = useNavigate();
  const currentUser = localStorage.getItem('currentUser');

  // State for different data types
  const [users, setUsers] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [payments, setPayments] = useState([]);
  const [notes, setNotes] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check if user is admin
  useEffect(() => {

    
  }, [currentUser]);

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
        const userData = await getUsers(); const ticketData = await getTickets();
        const paymentData = await getPayments();
        const noteData = await getNotes();

        setUsers(userData || []);
        setTickets(ticketData || []);
        setPayments(paymentData || []);
        setNotes(noteData || []);

        console.log('Data fetched successfully');
      } catch (err) {
        setError(err.message || 'An error occurred while fetching data');
        console.error('Error fetching data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

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
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold mb-4">Users</h3>
          <div className="text-3xl font-bold text-blue-600">{users.length}</div>
          <p className="text-gray-600">Total registered users</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold mb-4">Tickets</h3>
          <div className="text-3xl font-bold text-green-600">{tickets.length}</div>
          <p className="text-gray-600">Total tickets</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold mb-4">Payments</h3>
          <div className="text-3xl font-bold text-purple-600">{payments.length}</div>
          <p className="text-gray-600">Total payments</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold mb-4">Notes</h3>
          <div className="text-3xl font-bold text-orange-600">{notes.length}</div>
          <p className="text-gray-600">Total notes</p>
        </div>
      </div>
    )
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

        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Username
              </th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Email
              </th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Role
              </th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Created
              </th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users && users.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-4 px-6 border-b border-gray-200 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
              users.map(user => (
                <tr key={user._id}>
                  <td className="py-2 px-4 border-b border-gray-200">{user.username}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{user.email}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{user.role || 'user'}</td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200">
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

        <TicketForm
          onTicketAdded={handleTicketCreated}
          onTicketUpdated={handleTicketUpdated}
          editingTicket={editingTicket}
          setEditingTicket={setEditingTicket}
        />

        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Title
              </th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Status
              </th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Priority
              </th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                User
              </th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Date
              </th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {tickets && tickets.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-4 px-6 border-b border-gray-200 text-center text-gray-500">
                  No tickets found
                </td>
              </tr>
            ) : (
              tickets.map(ticket => (
                <tr key={ticket._id}>
                  <td className="py-2 px-4 border-b border-gray-200">{ticket.title}</td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    <span className={`px-2 py-1 rounded-full text-xs ${ticket.status === 'open' ? 'bg-green-100 text-green-800' :
                      ticket.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                        ticket.status === 'resolved' ? 'bg-gray-100 text-gray-800' :
                          'bg-red-100 text-red-800'
                      }`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    <span className={`px-2 py-1 rounded-full text-xs ${ticket.priority === 'low' ? 'bg-gray-100 text-gray-800' :
                      ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        ticket.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'
                      }`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    {ticket.user?.username || 'Unknown'}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    {new Date(ticket.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    <button
                      onClick={() => handleEditTicket(ticket)}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTicket(ticket._id)}
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

  // Render payment list
  const renderPayments = () => {
    return (
      <div className="w-full overflow-x-auto">
        <h2 className="text-xl font-bold mb-4">Payment Management</h2>

        <PaymentForm
          onPaymentAdded={handlePaymentCreated}
          onPaymentUpdated={handlePaymentUpdated}
          editingPayment={editingPayment}
          setEditingPayment={setEditingPayment}
        />

        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                User
              </th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Amount
              </th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Payment Method
              </th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Status
              </th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Date
              </th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {payments && payments.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-4 px-6 border-b border-gray-200 text-center text-gray-500">
                  No payments found
                </td>
              </tr>
            ) : (
              payments.map(payment => (
                <tr key={payment._id}>
                  <td className="py-2 px-4 border-b border-gray-200">
                    {payment.user?.username || 'Unknown'}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    ${payment.amount?.toFixed(2)}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    {payment.payment_method}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    <span className={`px-2 py-1 rounded-full text-xs ${payment.status === 'completed' ? 'bg-green-100 text-green-800' :
                      payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        payment.status === 'failed' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                      }`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    {new Date(payment.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200">
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

        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Title
              </th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Content
              </th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Category
              </th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                User
              </th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Date
              </th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {notes && notes.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-4 px-6 border-b border-gray-200 text-center text-gray-500">
                  No notes found
                </td>
              </tr>
            ) : (
              notes.map(note => (
                <tr key={note._id}>
                  <td className="py-2 px-4 border-b border-gray-200">{note.title}</td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    {note.content?.length > 50
                      ? `${note.content.substring(0, 50)}...`
                      : note.content}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200">{note.category || 'Uncategorized'}</td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    {note.user?.username || 'Unknown'}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    {new Date(note.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200">
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
      <h1 className="text-3xl font-bold mb-8 text-center">Admin Panel</h1>

      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="w-full md:w-1/5">
          <div className="bg-white shadow rounded-md overflow-hidden">
            <div className="p-4 bg-gray-800 text-white">
              <h2 className="text-xl font-bold">Navigation</h2>
            </div>
            <div className="py-2">
              <button
                className={`w-full text-left py-2 px-4 hover:bg-gray-100 ${activeTab === 'dashboard' ? 'bg-blue-100 font-bold' : ''}`}
                onClick={() => handleTabChange('dashboard')}
              >
                Dashboard
              </button>
              <button
                className={`w-full text-left py-2 px-4 hover:bg-gray-100 ${activeTab === 'users' ? 'bg-blue-100 font-bold' : ''}`}
                onClick={() => handleTabChange('users')}
              >
                Users
              </button>
              <button
                className={`w-full text-left py-2 px-4 hover:bg-gray-100 ${activeTab === 'tickets' ? 'bg-blue-100 font-bold' : ''}`}
                onClick={() => handleTabChange('tickets')}
              >
                Tickets
              </button>
              <button
                className={`w-full text-left py-2 px-4 hover:bg-gray-100 ${activeTab === 'payments' ? 'bg-blue-100 font-bold' : ''}`}
                onClick={() => handleTabChange('payments')}
              >
                Payments
              </button>
              <button
                className={`w-full text-left py-2 px-4 hover:bg-gray-100 ${activeTab === 'notes' ? 'bg-blue-100 font-bold' : ''}`}
                onClick={() => handleTabChange('notes')}
              >
                Notes
              </button>
            </div>
          </div>
        </div>

        <div className="w-full md:w-4/5">
          <div className="bg-white shadow rounded-md p-6">
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
