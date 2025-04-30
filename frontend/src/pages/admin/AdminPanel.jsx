import { useState, useEffect } from 'react';
import {
  getUsers, deleteUser,
  getTickets, deleteTicket,
  getPayments, deletePayment,
  getNotes, deleteNote
} from '../../services/api';
import UserForm from '../../components/admin/UserForm';

const AdminPanel = () => {
  // State for different data types
  const [users, setUsers] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [payments, setPayments] = useState([]);
  const [notes, setNotes] = useState([]);
  const [activeTab, setActiveTab] = useState('users');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  // Fetch data based on active tab
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        switch (activeTab) {
          case 'users':
            const userData = await getUsers();
            setUsers(userData);
            break;
          case 'tickets':
            const ticketData = await getTickets();
            setTickets(ticketData);
            break;
          case 'payments':
            const paymentData = await getPayments();
            setPayments(paymentData);
            break;
          case 'notes':
            const noteData = await getNotes();
            setNotes(noteData);
            break;
          case 'dashboard':
            // For dashboard, we need all data
            const dashUsers = await getUsers();
            setUsers(dashUsers);
            const dashTickets = await getTickets();
            setTickets(dashTickets);
            const dashPayments = await getPayments();
            setPayments(dashPayments);
            const dashNotes = await getNotes();
            setNotes(dashNotes);
            break;
          default:
            const defaultData = await getUsers();
            setUsers(defaultData);
        }
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
  
  // Delete handlers
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
  // Handle adding a new user
  const handleUserCreated = (newUser) => {
    setUsers([...users, newUser]);
  };

  // Render user list
  const renderUsers = () => {
    return (
      <div className="w-full overflow-x-auto">
        <h2 className="text-xl font-bold mb-4">User Management</h2>
        <UserForm onUserCreated={handleUserCreated} />
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Username</th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Role</th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Created At</th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user._id}>
                  <td className="py-2 px-4 border-b border-gray-200">{user.username}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{user.email}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{user.role}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{new Date(user.created_at).toLocaleDateString()}</td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2">
                      Edit
                    </button>
                    <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-4 text-center">No users found</td>
              </tr>
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
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Title</th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Priority</th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Created At</th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tickets.length > 0 ? (
              tickets.map((ticket) => (
                <tr key={ticket._id}>
                  <td className="py-2 px-4 border-b border-gray-200">{ticket.title}</td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    <span className={`px-2 py-1 rounded-full text-xs 
                      ${ticket.status === 'open' ? 'bg-green-100 text-green-800' :
                        ticket.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                        ticket.status === 'resolved' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'}`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    <span className={`px-2 py-1 rounded-full text-xs
                      ${ticket.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                        ticket.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                        ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'}`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200">{new Date(ticket.created_at).toLocaleDateString()}</td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2">
                      Edit
                    </button>
                    <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-4 text-center">No tickets found</td>
              </tr>
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
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Method</th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.length > 0 ? (
              payments.map((payment) => (
                <tr key={payment._id}>
                  <td className="py-2 px-4 border-b border-gray-200">${payment.amount.toFixed(2)}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{payment.payment_method}</td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    <span className={`px-2 py-1 rounded-full text-xs 
                      ${payment.status === 'completed' ? 'bg-green-100 text-green-800' :
                        payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        payment.status === 'failed' ? 'bg-red-100 text-red-800' :
                        'bg-purple-100 text-purple-800'}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200">{new Date(payment.payment_date).toLocaleDateString()}</td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2">
                      Edit
                    </button>
                    <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-4 text-center">No payments found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };

  // Render notes list
  const renderNotes = () => {
    return (
      <div className="w-full overflow-x-auto">
        <h2 className="text-xl font-bold mb-4">Note Management</h2>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Title</th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Created At</th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Content Preview</th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {notes.length > 0 ? (
              notes.map((note) => (
                <tr key={note._id}>
                  <td className="py-2 px-4 border-b border-gray-200">{note.title}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{note.category || 'Uncategorized'}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{new Date(note.created_at).toLocaleDateString()}</td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    {note.content.length > 50 ? `${note.content.substring(0, 50)}...` : note.content}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2">
                      Edit
                    </button>
                    <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-4 text-center">No notes found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };

  // Render dashboard stats
  const renderDashboard = () => {
    return (
      <div>
        <h2 className="text-xl font-bold mb-4">Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-gray-500 text-sm">Total Users</p>
                <p className="text-2xl font-semibold">{users.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-gray-500 text-sm">Total Tickets</p>
                <p className="text-2xl font-semibold">{tickets.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-gray-500 text-sm">Total Payments</p>
                <p className="text-2xl font-semibold">{payments.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-gray-500 text-sm">Total Notes</p>
                <p className="text-2xl font-semibold">{notes.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow rounded-lg">
        <div className="flex flex-col md:flex-row">
          {/* Sidebar */}
          <div className="w-full md:w-64 bg-gray-800 md:min-h-screen p-4">
            <div className="text-white text-2xl font-bold mb-8">Admin Panel</div>
            <nav>
              <ul>
                <li className="mb-2">
                  <button 
                    onClick={() => handleTabChange('dashboard')} 
                    className={`w-full text-left py-2 px-4 rounded ${activeTab === 'dashboard' 
                      ? 'bg-blue-500 text-white' 
                      : 'text-gray-300 hover:bg-gray-700'}`}
                  >
                    Dashboard
                  </button>
                </li>
                <li className="mb-2">
                  <button 
                    onClick={() => handleTabChange('users')} 
                    className={`w-full text-left py-2 px-4 rounded ${activeTab === 'users' 
                      ? 'bg-blue-500 text-white' 
                      : 'text-gray-300 hover:bg-gray-700'}`}
                  >
                    Users
                  </button>
                </li>
                <li className="mb-2">
                  <button 
                    onClick={() => handleTabChange('tickets')} 
                    className={`w-full text-left py-2 px-4 rounded ${activeTab === 'tickets' 
                      ? 'bg-blue-500 text-white' 
                      : 'text-gray-300 hover:bg-gray-700'}`}
                  >
                    Tickets
                  </button>
                </li>
                <li className="mb-2">
                  <button 
                    onClick={() => handleTabChange('payments')} 
                    className={`w-full text-left py-2 px-4 rounded ${activeTab === 'payments' 
                      ? 'bg-blue-500 text-white' 
                      : 'text-gray-300 hover:bg-gray-700'}`}
                  >
                    Payments
                  </button>
                </li>
                <li className="mb-2">
                  <button 
                    onClick={() => handleTabChange('notes')} 
                    className={`w-full text-left py-2 px-4 rounded ${activeTab === 'notes' 
                      ? 'bg-blue-500 text-white' 
                      : 'text-gray-300 hover:bg-gray-700'}`}
                  >
                    Notes
                  </button>
                </li>
              </ul>
            </nav>
          </div>

          {/* Main content */}
          <div className="flex-1 p-6">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Error!</strong>
                <span className="block sm:inline"> {error}</span>
              </div>
            ) : (
              <>
                {activeTab === 'dashboard' && renderDashboard()}
                {activeTab === 'users' && renderUsers()}
                {activeTab === 'tickets' && renderTickets()}
                {activeTab === 'payments' && renderPayments()}
                {activeTab === 'notes' && renderNotes()}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
