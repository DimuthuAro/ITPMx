import React from 'react';
import { Link } from 'react-router-dom';

const TicketCard = ({ ticket }) => {
  // Status badge color based on ticket status
  const statusColors = {
    open: 'bg-blue-900/80 text-blue-300',
    in_progress: 'bg-amber-900/80 text-amber-300',
    resolved: 'bg-green-900/80 text-green-300',
    closed: 'bg-gray-700/80 text-gray-300'
  };

  // Priority badge color based on priority level
  const priorityColors = {
    low: 'bg-gray-700/80 text-gray-300',
    medium: 'bg-blue-900/80 text-blue-300',
    high: 'bg-orange-900/80 text-orange-300',
    urgent: 'bg-red-900/80 text-red-300'
  };

  // Format date to be more readable
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="bg-gray-800/90 backdrop-blur-sm border border-gray-700 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-white">{ticket.title}</h3>
          <span className={`text-xs px-2 py-1 rounded-full backdrop-blur-sm ${priorityColors[ticket.priority]}`}>
            {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
          </span>
        </div>
        
        <p className="text-sm text-gray-300 mb-4 line-clamp-2">{ticket.description}</p>
        
        <div className="flex justify-between items-center text-sm text-gray-400">
          <div>
            <span className={`inline-block px-2 py-1 rounded-full backdrop-blur-sm ${statusColors[ticket.status]}`}>
              {ticket.status.replace('_', ' ').charAt(0).toUpperCase() + ticket.status.replace('_', ' ').slice(1)}
            </span>
          </div>
          <div>{formatDate(ticket.created_at)}</div>
        </div>
      </div>
      
      <div className="bg-gray-700/90 backdrop-blur-sm px-4 py-3 border-t border-gray-600">
        <Link 
          to={`/tickets/${ticket._id}`}
          className="text-blue-400 hover:text-blue-300 text-sm font-medium"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default TicketCard;