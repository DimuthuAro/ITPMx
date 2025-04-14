import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../services/UseAuth';
import { 
  FaTicketAlt, 
  FaSpinner, 
  FaPlus, 
  FaInfoCircle, 
  FaTrashAlt, 
  FaTimes, 
  FaRedo,
  FaExclamationCircle,
  FaCheck
} from 'react-icons/fa';

const UserTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const fetchUserTickets = async () => {
    if (!user) {
      navigate('/auth/login');
      return;
    }

    try {
      // In a real application, this would be an API call to fetch tickets for the specific user
      const response = await fetch(`http://localhost:3001/tickets?userId=${user.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch tickets');
      }
      const data = await response.json();
      setTickets(data);
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    const fetchUserTickets = async () => {
      if (!user) {
        navigate('/auth/login');
        return;
      }

      try {
        // In a real application, this would be an API call to fetch tickets for the specific user
        const response = await fetch(`http://localhost:3001/tickets?userId=${user.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch tickets');
        }
        const data = await response.json();
        setTickets(data);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchUserTickets();
  }, [user, navigate]);

  const handleDeleteTicket = async (ticketId) => {
    if (window.confirm('Are you sure you want to delete this ticket?')) {
      try {
        // In a real application, this would be an API call to delete the ticket
        const response = await fetch(`http://localhost:3001/tickets/${ticketId}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete ticket');
        }
        
        // Remove the deleted ticket from the state
        setTickets(tickets.filter(ticket => ticket.id !== ticketId));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  // Function to format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Function to get status badge color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'open':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'in progress':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'closed':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'urgent':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  // Function to get priority badge color
  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'low':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  // Ticket Detail Modal Component
  const TicketDetailModal = ({ ticket, onClose }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-xl shadow-2xl border border-white/10 max-w-2xl w-full animate-scale">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Ticket Details
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-400">Ticket ID:</span>
            <span className="text-white">{ticket.id}</span>
          </div>
          
          <div>
            <span className="text-gray-400">Subject:</span>
            <h4 className="text-lg font-medium text-white">{ticket.subject}</h4>
          </div>
          
          <div>
            <span className="text-gray-400">Description:</span>
            <div className="mt-1 p-3 bg-white/5 rounded-lg text-gray-200 whitespace-pre-wrap">
              {ticket.description}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-gray-400">Status:</span>
              <div className={`mt-1 inline-block px-3 py-1 rounded-full text-sm ${getStatusColor(ticket.status)}`}>
                {ticket.status || 'Unknown'}
              </div>
            </div>
            
            <div>
              <span className="text-gray-400">Priority:</span>
              <div className={`mt-1 inline-block px-3 py-1 rounded-full text-sm ${getPriorityColor(ticket.priority)}`}>
                {ticket.priority || 'Unknown'}
              </div>
            </div>
            
            <div>
              <span className="text-gray-400">Created:</span>
              <div className="mt-1 text-white">
                {formatDate(ticket.createdAt)}
              </div>
            </div>
            
            <div>
              <span className="text-gray-400">Last Updated:</span>
              <div className="mt-1 text-white">
                {ticket.updatedAt ? formatDate(ticket.updatedAt) : 'N/A'}
              </div>
            </div>
          </div>
          
          {ticket.response && (
            <div className="mt-6">
              <span className="text-gray-400">Support Response:</span>
              <div className="mt-1 p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-lg text-gray-200 whitespace-pre-wrap">
                {ticket.response}
              </div>
              <div className="mt-2 text-sm text-gray-400">
                Responded on: {ticket.respondedAt ? formatDate(ticket.respondedAt) : 'N/A'}
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-8 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  // Display loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div className="w-32 h-32 flex items-center justify-center">
            <FaTicketAlt className="text-blue-500 text-5xl animate-pulse" />
          </div>
        </div>
        <p className="mt-4 text-xl font-medium text-blue-400">Loading Tickets...</p>
      </div>
    );
  }

  // Display error state
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="bg-gradient-to-br from-red-800/50 to-red-900/50 backdrop-blur-md p-8 rounded-xl border border-red-500/20 shadow-lg max-w-md w-full">
          <div className="flex items-center text-red-400 mb-4">
            <FaTimes className="text-3xl mr-3" />
            <h2 className="text-xl font-bold">Error Loading Tickets</h2>
          </div>
          <p className="text-gray-300 mb-6">{error}</p>
          <button 
            onClick={() => { setError(null); setIsLoading(true); fetchUserTickets(); }}
            className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center justify-center transition-colors"
          >
            <FaRedo className="mr-2" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Main content
  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 left-1/3 w-64 h-64 bg-blue-600/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-1/2 -right-32 w-64 h-64 bg-purple-600/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-1/4 w-64 h-64 bg-indigo-600/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          My Support Tickets
        </h1>
        <p className="text-gray-400 mt-2">
          View and manage your support requests
        </p>
      </div>

      {/* Actions */}
      <div className="mb-6 flex justify-end">
        <button 
          onClick={() => navigate('/user/tickets/create')}
          className="py-2 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg flex items-center justify-center transition-all shadow-lg hover:shadow-indigo-500/20"
        >
          <FaPlus className="mr-2" />
          Create New Ticket
        </button>
      </div>

      {/* Tickets List */}
      {tickets.length === 0 ? (
        <div className="flex flex-col items-center justify-center bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-12 text-center shadow-lg">
          <FaTicketAlt className="text-6xl mb-4 text-blue-400/50" />
          <h3 className="text-xl font-medium text-white mb-2">No Support Tickets</h3>
          <p className="text-gray-400 mb-6">Create a new ticket if you need assistance</p>
          <button 
            onClick={() => navigate('/user/tickets/create')}
            className="py-2 px-6 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center transition-colors"
          >
            <FaPlus className="mr-2" />
            Create Your First Ticket
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {tickets.map((ticket) => (
            <div 
              key={ticket.id} 
              className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-white/10 rounded-xl overflow-hidden shadow-lg hover:shadow-indigo-500/10 hover:border-indigo-500/20 transition-all duration-300"
            >
              <div className="p-5">
                <div className="flex justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 ${
                      ticket.status?.toLowerCase() === 'closed' ? 'bg-green-500' :
                      ticket.status?.toLowerCase() === 'in progress' ? 'bg-yellow-500' :
                      ticket.status?.toLowerCase() === 'urgent' ? 'bg-red-500' : 'bg-blue-500'
                    }`}></div>
                    <h3 className="text-xl font-semibold text-white">{ticket.subject}</h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`px-3 py-1 rounded-full text-xs ${getStatusColor(ticket.status)}`}>
                      {ticket.status || 'Open'}
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority || 'Medium'}
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-300 my-4 line-clamp-2">{ticket.description}</p>
                
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-400">
                    Created: {formatDate(ticket.createdAt)}
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setSelectedTicket(ticket)}
                      className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                      title="View Ticket Details"
                    >
                      <FaInfoCircle />
                    </button>
                    <button
                      onClick={() => handleDeleteTicket(ticket.id)}
                      className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Delete Ticket"
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                </div>
                
                {ticket.response && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="flex items-center text-green-400 mb-2">
                      <FaCheck className="mr-2" />
                      <span className="font-medium">Response Received</span>
                    </div>
                    <p className="text-gray-400 text-sm line-clamp-2">{ticket.response}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {/* "Add New" Card */}
          <div 
            onClick={() => navigate('/user/tickets/create')}
            className="cursor-pointer bg-white/5 border border-white/10 border-dashed rounded-xl flex items-center justify-center p-8 hover:bg-white/10 transition-all duration-300 group"
          >
            <div className="text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                <FaPlus className="text-2xl text-blue-400 group-hover:text-blue-300" />
              </div>
              <p className="text-gray-400 group-hover:text-gray-300">Create New Ticket</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Ticket Detail Modal */}
      {selectedTicket && (
        <TicketDetailModal
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
        />
      )}
    </div>
  );
};

export default UserTickets;