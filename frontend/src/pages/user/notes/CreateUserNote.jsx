import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../services/UseAuth';
import { FaSave, FaTimes, FaSpinner } from 'react-icons/fa';

const CreateUserNote = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: ''
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
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.content.trim()) errors.content = 'Content is required';
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // In a real application, this would be an API call to create a note
      const response = await fetch('http://localhost:3001/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userId: user.id,
          createdAt: new Date().toISOString()
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create note');
      }
      
      navigate('/user/notes');
    } catch (err) {
      console.error('Error creating note:', err);
      setValidationErrors({
        form: 'An error occurred while creating your note. Please try again.'
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
          Create New Note
        </h1>
        <p className="text-gray-400 mt-2">
          Add a new note to your personal collection
        </p>
      </div>
      
      {/* Form */}
      <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-white/10 rounded-xl p-6 shadow-lg">
        <form onSubmit={handleSubmit}>
          {validationErrors.form && (
            <div className="mb-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200">
              <div className="flex items-start">
                <FaTimes className="text-red-400 mt-1 mr-2" />
                <p>{validationErrors.form}</p>
              </div>
            </div>
          )}
          
          <div className="space-y-6">
            {/* Title Field */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-blue-300 mb-2">
                Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter note title"
                className={`w-full px-4 py-3 bg-white/5 border ${
                  validationErrors.title ? 'border-red-500/50' : 'border-white/10'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-transparent text-white`}
              />
              {validationErrors.title && (
                <p className="mt-2 text-sm text-red-400">{validationErrors.title}</p>
              )}
            </div>
            
            {/* Category Field */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-blue-300 mb-2">
                Category
              </label>
              <input
                type="text"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Enter note category (optional)"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-transparent text-white"
              />
            </div>
            
            {/* Content Field */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-blue-300 mb-2">
                Content <span className="text-red-400">*</span>
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Enter note content"
                rows="8"
                className={`w-full px-4 py-3 bg-white/5 border ${
                  validationErrors.content ? 'border-red-500/50' : 'border-white/10'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-transparent text-white resize-none`}
              />
              {validationErrors.content && (
                <p className="mt-2 text-sm text-red-400">{validationErrors.content}</p>
              )}
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/user/notes')}
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
                  Saving...
                </>
              ) : (
                <>
                  <FaSave className="mr-2" />
                  Save Note
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserNote;