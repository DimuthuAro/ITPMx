import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../../services/apiConfig';
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
  const { logout } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [userData, setUserData] = useState({
    username: '',
    email: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) {
          setError('You must be logged in to view this page');
          return;
        }

        const response = await axios.get(`${API_BASE_URL}/api/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.data.success) {
          setUserData(response.data.data);
        } else {
          setError(response.data.message || 'Failed to load profile');
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value
    });
    
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
    
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: null
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!userData.username.trim()) errors.username = 'Name is required';
    if (!userData.email.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(userData.email)) errors.email = 'Email is invalid';
    
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

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.put(
        `${API_BASE_URL}/api/users/${userData.id}`, 
        {
          username: userData.username,
          email: userData.email
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (response.data.success) {
        setMessage('Profile updated successfully');
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
          const updatedUser = { ...storedUser, ...response.data.data };
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
        setIsEditing(false);
        setValidationErrors({});
      } else {
        setError(response.data.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) return;
    
    setIsSubmitting(true);
    
    try {
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
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 left-1/3 w-64 h-64 bg-blue-600/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-1/2 -right-32 w-64 h-64 bg-purple-600/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
      </div>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          User Profile
        </h1>
        <p className="text-gray-400 mt-2">
          View and manage your account information
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-white/10 rounded-xl p-6 shadow-lg lg:col-span-1">
          <div className="flex flex-col items-center text-center">
            <div className="w-24 h-24 mb-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              {userData?.username?.charAt(0) || <FaUser />}
            </div>
            <h2 className="text-xl font-semibold text-white mb-1">{userData?.username}</h2>
            <p className="text-gray-400 flex items-center">
              <FaEnvelope className="mr-2" />
              {userData?.email}
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
        
        <div className="lg:col-span-2">
          {message && (
            <div className="mb-4 p-4 bg-green-500/20 border border-green-500/30 rounded-lg text-green-200">
              <p>{message}</p>
            </div>
          )}
          
          {isEditing && (
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-white/10 rounded-xl p-6 shadow-lg mb-6">
              <h3 className="text-xl font-semibold text-white mb-4">Edit Profile</h3>
              
              {error && (
                <div className="mb-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200">
                  <div className="flex items-start">
                    <FaExclamationCircle className="text-red-400 mt-1 mr-2" />
                    <p>{error}</p>
                  </div>
                </div>
              )}
              
              <form onSubmit={handleUpdateProfile}>
                <div className="space-y-6">
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-blue-300 mb-2">
                      Full Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={userData.username}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-white/5 border ${
                        validationErrors.username ? 'border-red-500/50' : 'border-white/10'
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-transparent text-white`}
                    />
                    {validationErrors.username && (
                      <p className="mt-2 text-sm text-red-400">{validationErrors.username}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-blue-300 mb-2">
                      Email Address <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={userData.email}
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
                
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
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
          
          {!isEditing && !showPasswordChange && (
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-white/10 rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-white mb-6">Account Information</h3>
              
              <div className="space-y-6">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <FaUser className="text-blue-400" />
                    <span className="text-sm font-medium text-blue-300">Full Name</span>
                  </div>
                  <p className="text-white text-lg pl-6">{userData?.username}</p>
                </div>
                
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <FaEnvelope className="text-blue-400" />
                    <span className="text-sm font-medium text-blue-300">Email Address</span>
                  </div>
                  <p className="text-white text-lg pl-6">{userData?.email}</p>
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