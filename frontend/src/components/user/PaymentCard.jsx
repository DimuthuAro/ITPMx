import React from 'react';
import { Link } from 'react-router-dom';

const PaymentCard = ({ payment }) => {
  // Status badge color based on payment status
  const statusColors = {
    pending: 'bg-amber-900/80 text-amber-300',
    completed: 'bg-green-900/80 text-green-300',
    failed: 'bg-red-900/80 text-red-300',
    refunded: 'bg-purple-900/80 text-purple-300'
  };

  // Format date to be more readable
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Format card number to show only last 4 digits
  const formatCardNumber = (cardNumber) => {
    return `•••• •••• •••• ${cardNumber.slice(-4)}`;
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="bg-gray-800/90 backdrop-blur-sm border border-gray-700 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-white">{formatCurrency(payment.amount)}</h3>
          <span className={`text-xs px-2 py-1 rounded-full backdrop-blur-sm ${statusColors[payment.status]}`}>
            {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
          </span>
        </div>
        
        <div className="space-y-2 mb-3">
          <div className="flex justify-between">
            <span className="text-sm text-gray-400">Payment Method:</span>
            <span className="text-sm font-medium text-gray-300">{payment.payment_method}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-400">Card:</span>
            <span className="text-sm font-medium text-gray-300">{formatCardNumber(payment.card_number)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-400">Date:</span>
            <span className="text-sm text-gray-300">{formatDate(payment.created_at)}</span>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-700/90 backdrop-blur-sm px-4 py-3 border-t border-gray-600 flex justify-between items-center">
        <span className="text-sm text-gray-400">{payment.name}</span>
        <Link 
          to={`/payments/${payment._id}`}
          className="text-blue-400 hover:text-blue-300 text-sm font-medium"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default PaymentCard;