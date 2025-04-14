import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../services/UseAuth';
import { FaSave, FaTimes, FaSpinner, FaExclamationCircle } from 'react-icons/fa';

const CreateUserTicket = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    priority: 'Medium'
  });
  const [validationErrors, setValidationErrors] = useState({});

  // Redirect to login if not authenticated
  if (!user) {
    navigate('/auth/login');
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear validation error when user types
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: null
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.subject.trim()) errors.subject = 'Subject is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // In a real application, this would be an API call to create a ticket
      const response = await fetch('http://localhost:3001/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userId: user.id,
          status: 'Open',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create support ticket');
      }
      
      navigate('/user/tickets');
    } catch (err) {
      console.error('Error creating ticket:', err);
      setValidationErrors({
        form: 'An error occurred while creating your support ticket. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 left-1/3 w-64 h-64 bg-blue-600/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-1/2 -right-32 w-64 h-64 bg-purple-600/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
      </div>
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          Create Support Ticket
        </h1>
        <p className="text-gray-400 mt-2">
          Submit a new support request for assistance
        </p>
      </div>
      
      {/* Form */}
      <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-white/10 rounded-xl p-6 shadow-lg">
        <form onSubmit={handleSubmit}>
          {validationErrors.form && (
            <div className="mb-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200">
              <div className="flex items-start">
                <FaExclamationCircle className="text-red-400 mt-1 mr-2" />
                <p>{validationErrors.form}</p>
              </div>
            </div>
          )}
          
          <div className="space-y-6">
            {/* Subject Field */}
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-blue-300 mb-2">
                Subject <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Brief description of your issue"
                className={`w-full px-4 py-3 bg-white/5 border ${
                  validationErrors.subject ? 'border-red-500/50' : 'border-white/10'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-transparent text-white`}
              />
              {validationErrors.subject && (
                <p className="mt-2 text-sm text-red-400">{validationErrors.subject}</p>
              )}
            </div>
            
            {/* Priority Field */}
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-blue-300 mb-2">
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-transparent text-white appearance-none"
                style={{ backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTcgOUwxMCAxMkwxMyA5IiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo=')", backgroundRepeat: "no-repeat", backgroundPosition: "right 0.75rem center" }}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            
            {/* Description Field */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-blue-300 mb-2">
                Description <span className="text-red-400">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide detailed information about your issue"
                rows="8"
                className={`w-full px-4 py-3 bg-white/5 border ${
                  validationErrors.description ? 'border-red-500/50' : 'border-white/10'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-transparent text-white resize-none`}
              />
              {validationErrors.description && (
                <p className="mt-2 text-sm text-red-400">{validationErrors.description}</p>
              )}
              <p className="mt-2 text-sm text-gray-400">
                Please include any relevant details that will help us assist you better.
              </p>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/user/tickets')}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white transition-colors"
            >
              <div className="flex items-center">
                <FaTimes className="mr-2" />
                Cancel
              </div>
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg flex items-center justify-center transition-all shadow-lg hover:shadow-indigo-500/20 disabled:opacity-70 disabled:cursor-not-allowed min-w-[120px]"
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                <>
                  <FaSave className="mr-2" />
                  Submit Ticket
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserTicket;