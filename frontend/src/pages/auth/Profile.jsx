import React, { useState, useEffect } from 'react';
import { useAuth } from '../../services/UseAuth.jsx';
import { FaUser, FaEnvelope, FaEdit, FaKey, FaSpinner, FaCheck } from 'react-icons/fa';

const Profile = () => {
  const { currentUser, updateProfile } = useAuth();
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    role: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Load user data
  useEffect(() => {
    if (currentUser) {
      setProfileData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        role: currentUser.role || 'User'
      });
    }
  }, [currentUser]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!profileData.name.trim()) {
      setError('Name cannot be empty');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError('');
      setSuccess('');
      
      await updateProfile({
        name: profileData.name
      });
      
      setSuccess('Profile updated successfully');
      setIsEditing(false);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-xl border border-slate-700/30 backdrop-blur-sm overflow-hidden">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              User Profile
            </h1>
            <p className="text-gray-400 mt-2">View and manage your profile information</p>
          </div>
          
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200 text-sm">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg text-green-200 text-sm">
              {success}
            </div>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Avatar */}
            <div className="flex flex-col items-center justify-start p-6 bg-white/5 rounded-xl">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mb-4">
                <FaUser size={64} className="text-blue-300" />
              </div>
              <h2 className="text-xl font-semibold text-white">{profileData.name}</h2>
              <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs mt-2">
                {profileData.role}
              </span>
            </div>
            
            {/* Profile Information */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  {/* User Info Section */}
                  <div className="bg-white/5 rounded-xl p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-white">User Information</h3>
                      {!isEditing ? (
                        <button
                          type="button"
                          onClick={() => setIsEditing(true)}
                          className="flex items-center text-blue-400 hover:text-blue-300 transition"
                        >
                          <FaEdit className="mr-2" />
                          Edit
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setIsEditing(false);
                            if (currentUser) {
                              setProfileData({
                                name: currentUser.name || '',
                                email: currentUser.email || '',
                                role: currentUser.role || 'User'
                              });
                            }
                            setError('');
                            setSuccess('');
                          }}
                          className="text-gray-400 hover:text-gray-300 transition"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                    
                    <div className="space-y-4">
                      {/* Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Full Name
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaUser className="text-gray-400" />
                          </div>
                          <input
                            type="text"
                            name="name"
                            value={profileData.name}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className={`block w-full pl-10 pr-3 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-gray-200 placeholder-gray-400 ${
                              !isEditing ? 'opacity-70' : ''
                            }`}
                          />
                        </div>
                      </div>
                      
                      {/* Email - Read only */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Email Address
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaEnvelope className="text-gray-400" />
                          </div>
                          <input
                            type="email"
                            value={profileData.email}
                            disabled
                            className="block w-full pl-10 pr-3 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-gray-200 opacity-70"
                          />
                        </div>
                        <p className="mt-1 text-xs text-gray-400">Email cannot be changed</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Security Section */}
                  <div className="bg-white/5 rounded-xl p-6">
                    <h3 className="text-lg font-medium text-white mb-4">Security</h3>
                    <div className="space-y-4">
                      {/* Password Change Link */}
                      <div>
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="text-gray-200 font-medium">Password</h4>
                            <p className="text-gray-400 text-sm">Change your password</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => window.location.href = '/reset-password'}
                            className="px-4 py-2 bg-slate-700/80 hover:bg-slate-700 rounded-lg text-white text-sm transition-colors flex items-center"
                          >
                            <FaKey className="mr-2" />
                            Change Password
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Submit Button - Only show when editing */}
                  {isEditing && (
                    <div>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-lg text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 transition-colors duration-200"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center justify-center">
                            <FaSpinner className="animate-spin mr-2" />
                            <span>Saving Changes...</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center">
                            <FaCheck className="mr-2" />
                            <span>Save Changes</span>
                          </div>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 