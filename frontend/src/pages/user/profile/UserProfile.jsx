import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../services/UseAuth';
import { 
  FaUser, 
  FaEnvelope, 
  FaLock, 
  FaSave, 
  FaSpinner, 
  FaTimes,
  FaExclamationCircle,
  FaEdit,
  FaKey
} from 'react-icons/fa';

const UserProfile = () => {
  const navigate = useNavigate();
  const { user, updateUser, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [validationErrors, setValidationErrors] = useState({});

  // Load user data when component mounts
  useEffect(() => {
    if (!user) {
      navigate('/auth/login');
      return;
    }
    
    setFormData({
      name: user.name || '',
      email: user.email || '',
    });
    setIsLoading(false);
  }, [user, navigate]);

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

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
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
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email is invalid';
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePasswordForm = () => {
    const errors = {};
    if (!passwordData.currentPassword) errors.currentPassword = 'Current password is required';
    if (!passwordData.newPassword) errors.newPassword = 'New password is required';
    else if (passwordData.newPassword.length < 6) errors.newPassword = 'Password must be at least 6 characters';
    if (!passwordData.confirmPassword) errors.confirmPassword = 'Please confirm your password';
    else if (passwordData.newPassword !== passwordData.confirmPassword) errors.confirmPassword = 'Passwords do not match';
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // In a real application, this would be an API call to update user profile
      await updateUser({
        ...user,
        name: formData.name,
        email: formData.email,
      });
      
      setIsEditing(false);
      setValidationErrors({});
    } catch (err) {
      console.error('Error updating profile:', err);
      setValidationErrors({
        form: 'An error occurred while updating your profile. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // In a real application, this would be an API call to update the password
      // For now, we'll just simulate a successful password change
      setTimeout(() => {
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setShowPasswordChange(false);
        setValidationErrors({
          success: 'Password updated successfully!'
        });
        setIsSubmitting(false);
      }, 1500);
    } catch (err) {
      console.error('Error updating password:', err);
      setValidationErrors({
        form: 'An error occurred while updating your password. Please try again.'
      });
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  // Display loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
        <p className="mt-4 text-xl font-medium text-blue-400">Loading Profile...</p>
      </div>
    );
  }

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
          User Profile
        </h1>
        <p className="text-gray-400 mt-2">
          View and manage your account information
        </p>
      </div>
      
      {/* Profile Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Summary */}
        <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-white/10 rounded-xl p-6 shadow-lg lg:col-span-1">
          <div className="flex flex-col items-center text-center">
            <div className="w-24 h-24 mb-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              {user?.name?.charAt(0) || <FaUser />}
            </div>
            <h2 className="text-xl font-semibold text-white mb-1">{user?.name}</h2>
            <p className="text-gray-400 flex items-center">
              <FaEnvelope className="mr-2" />
              {user?.email}
            </p>
            <div className="mt-6 w-full space-y-2">
              <button 
                onClick={() => setIsEditing(true)}
                className="w-full py-2 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg flex items-center justify-center transition-colors"
              >
                <FaEdit className="mr-2" />
                Edit Profile
              </button>
              <button 
                onClick={() => setShowPasswordChange(true)}
                className="w-full py-2 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg flex items-center justify-center transition-colors"
              >
                <FaKey className="mr-2" />
                Change Password
              </button>
              <button 
                onClick={handleLogout}
                className="w-full py-2 px-4 bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200 rounded-lg transition-colors mt-4"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
        
        {/* Main Content Area */}
        <div className="lg:col-span-2">
          {/* Success Message */}
          {validationErrors.success && (
            <div className="mb-4 p-4 bg-green-500/20 border border-green-500/30 rounded-lg text-green-200">
              <p>{validationErrors.success}</p>
            </div>
          )}
          
          {/* Edit Profile Form */}
          {isEditing && (
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-white/10 rounded-xl p-6 shadow-lg mb-6">
              <h3 className="text-xl font-semibold text-white mb-4">Edit Profile</h3>
              
              {validationErrors.form && (
                <div className="mb-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200">
                  <div className="flex items-start">
                    <FaExclamationCircle className="text-red-400 mt-1 mr-2" />
                    <p>{validationErrors.form}</p>
                  </div>
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  {/* Name Field */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-blue-300 mb-2">
                      Full Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-white/5 border ${
                        validationErrors.name ? 'border-red-500/50' : 'border-white/10'
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-transparent text-white`}
                    />
                    {validationErrors.name && (
                      <p className="mt-2 text-sm text-red-400">{validationErrors.name}</p>
                    )}
                  </div>
                  
                  {/* Email Field */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-blue-300 mb-2">
                      Email Address <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-white/5 border ${
                        validationErrors.email ? 'border-red-500/50' : 'border-white/10'
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-transparent text-white`}
                    />
                    {validationErrors.email && (
                      <p className="mt-2 text-sm text-red-400">{validationErrors.email}</p>
                    )}
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        name: user.name || '',
                        email: user.email || ''
                      });
                      setValidationErrors({});
                    }}
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
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {/* Change Password Form */}
          {showPasswordChange && (
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-white/10 rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-white mb-4">Change Password</h3>
              
              {validationErrors.form && (
                <div className="mb-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200">
                  <div className="flex items-start">
                    <FaExclamationCircle className="text-red-400 mt-1 mr-2" />
                    <p>{validationErrors.form}</p>
                  </div>
                </div>
              )}
              
              <form onSubmit={handlePasswordSubmit}>
                <div className="space-y-6">
                  {/* Current Password Field */}
                  <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-blue-300 mb-2">
                      Current Password <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="password"
                      id="currentPassword"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className={`w-full px-4 py-3 bg-white/5 border ${
                        validationErrors.currentPassword ? 'border-red-500/50' : 'border-white/10'
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-transparent text-white`}
                    />
                    {validationErrors.currentPassword && (
                      <p className="mt-2 text-sm text-red-400">{validationErrors.currentPassword}</p>
                    )}
                  </div>
                  
                  {/* New Password Field */}
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-blue-300 mb-2">
                      New Password <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className={`w-full px-4 py-3 bg-white/5 border ${
                        validationErrors.newPassword ? 'border-red-500/50' : 'border-white/10'
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-transparent text-white`}
                    />
                    {validationErrors.newPassword && (
                      <p className="mt-2 text-sm text-red-400">{validationErrors.newPassword}</p>
                    )}
                  </div>
                  
                  {/* Confirm Password Field */}
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-blue-300 mb-2">
                      Confirm Password <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className={`w-full px-4 py-3 bg-white/5 border ${
                        validationErrors.confirmPassword ? 'border-red-500/50' : 'border-white/10'
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-transparent text-white`}
                    />
                    {validationErrors.confirmPassword && (
                      <p className="mt-2 text-sm text-red-400">{validationErrors.confirmPassword}</p>
                    )}
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordChange(false);
                      setPasswordData({
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: ''
                      });
                      setValidationErrors({});
                    }}
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
                        Updating...
                      </>
                    ) : (
                      <>
                        <FaKey className="mr-2" />
                        Update Password
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {/* Account Summary (when not editing) */}
          {!isEditing && !showPasswordChange && (
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-white/10 rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-white mb-6">Account Information</h3>
              
              <div className="space-y-6">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <FaUser className="text-blue-400" />
                    <span className="text-sm font-medium text-blue-300">Full Name</span>
                  </div>
                  <p className="text-white text-lg pl-6">{user?.name}</p>
                </div>
                
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <FaEnvelope className="text-blue-400" />
                    <span className="text-sm font-medium text-blue-300">Email Address</span>
                  </div>
                  <p className="text-white text-lg pl-6">{user?.email}</p>
                </div>
                
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <FaLock className="text-blue-400" />
                    <span className="text-sm font-medium text-blue-300">Password</span>
                  </div>
                  <p className="text-white text-lg pl-6">••••••••</p>
                </div>
              </div>
              
              <div className="mt-8 border-t border-white/10 pt-6">
                <h4 className="text-lg font-medium text-white mb-2">Account Activity</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Last Login</span>
                    <span className="text-white">Today, 10:45 AM</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Account Created</span>
                    <span className="text-white">January 15, 2024</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;