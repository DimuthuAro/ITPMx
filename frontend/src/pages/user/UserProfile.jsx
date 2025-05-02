import { useState, useEffect } from 'react';
import { getUserById, updateUser } from '../../services/api';
import UserLayout from '../../components/user/UserLayout';
import { useAuth } from '../../context/AuthContext';

const UserProfile = () => {
    const { currentUser, updateUserData } = useAuth();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [submitting, setSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState(''); 
    
    useEffect(() => {
        const fetchUser = async () => {
            if (!currentUser?.id) return;

            try {
                const response = await getUserById(currentUser.id);
                const userData = response.data || response;
                setUser(userData);
                setFormData({
                    username: userData.username || '',
                    email: userData.email || '',
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                });
            } catch (err) {
                console.error('Error fetching user profile:', err);
                setError('Failed to load profile information. Please try again later.');
            } finally {
                setLoading(false);
            }
        }; 
        fetchUser();
    }, [currentUser]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        setSuccessMessage('');

        try {
            // Validate password if user is trying to update it
            if (formData.newPassword) {
                if (!formData.currentPassword) {
                    throw new Error('Current password is required to set a new password');
                }
                if (formData.newPassword !== formData.confirmPassword) {
                    throw new Error('New password and confirmation do not match');
                }
                if (formData.newPassword.length < 6) {
                    throw new Error('Password must be at least 6 characters long');
                }
            }

            // Prepare update data
            const updateData = {
                username: formData.username,
                email: formData.email,
            };

            // Only include password fields if updating password
            if (formData.newPassword) {
                updateData.currentPassword = formData.currentPassword;
                updateData.password = formData.newPassword;
            } 
            
            await updateUser(currentUser.id, updateData);

            // Also update the user data in AuthContext
            updateUserData({
                ...currentUser,
                username: formData.username,
                email: formData.email
            });

            // Update local state with new data
            setUser(prevUser => ({
                ...prevUser,
                username: formData.username,
                email: formData.email,
            }));

            setSuccessMessage('Profile updated successfully');
            setIsEditing(false);

            // Clear password fields
            setFormData(prev => ({
                ...prev,
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            }));

        } catch (err) {
            console.error('Error updating profile:', err);
            setError(err.message || 'Failed to update profile. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <UserLayout title="My Profile" subtitle="View and manage your account information">
            {loading ? (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    <p className="mt-4 text-lg text-gray-300">Loading your profile...</p>
                </div>
            ) : error && !user ? (
                <div className="bg-red-900/40 border-l-4 border-red-500 text-red-100 p-6 rounded-lg backdrop-blur-sm">
                    <p className="flex items-center">
                        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        {error}
                    </p>
                </div>
            ) : (
                <div className="space-y-6">
                    {successMessage && (
                        <div className="bg-green-900/30 border-l-4 border-green-500 text-green-100 p-4 rounded-lg backdrop-blur-sm mb-6">
                            <p className="flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                {successMessage}
                            </p>
                        </div>
                    )}

                    {/* Profile Header */}
                    <div className="bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm border border-gray-700/50 shadow-lg">
                        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                            <div className="flex items-center mb-4 md:mb-0">
                                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                                    {user?.username?.charAt(0).toUpperCase() || '?'}
                                </div>
                                <div className="ml-4">
                                    <h2 className="text-2xl font-semibold text-white">{user?.username}</h2>
                                    <div className="flex items-center">
                                        <span className={`px-2 py-1 text-xs rounded-full ${
                                            user?.role === 'admin' 
                                                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' 
                                                : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                        }`}>
                                            {user?.role === 'admin' ? 'Administrator' : 'Member'}
                                        </span>
                                        <span className="ml-2 text-gray-400 text-sm">
                                            • Member since {new Date(user?.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            {!isEditing && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                    </svg>
                                    Edit Profile
                                </button>
                            )}
                        </div>

                        {!isEditing ? (
                            <div className="mt-6 border-t border-gray-700 pt-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-400 mb-1">Username</h3>
                                        <p className="font-medium text-white">{user?.username}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-400 mb-1">Email Address</h3>
                                        <p className="font-medium text-white">{user?.email}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-400 mb-1">Account Status</h3>
                                        <p className="font-medium text-emerald-400">Active</p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-400 mb-1">Last Login</h3>
                                        <p className="font-medium text-white">{new Date().toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="mt-6 border-t border-gray-700 pt-6">
                                <h3 className="text-xl font-semibold mb-5 text-white">Edit Your Profile</h3>
                                
                                {error && (
                                    <div className="bg-red-900/40 border-l-4 border-red-500 text-red-100 p-4 rounded-lg mb-5 backdrop-blur-sm">
                                        <p className="flex items-center">
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                            </svg>
                                            {error}
                                        </p>
                                    </div>
                                )}
                                
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label htmlFor="username" className="block text-gray-300 font-medium mb-2">
                                                Username
                                            </label>
                                            <input
                                                type="text"
                                                id="username"
                                                name="username"
                                                value={formData.username}
                                                onChange={handleChange}
                                                className="w-full bg-gray-900/80 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label htmlFor="email" className="block text-gray-300 font-medium mb-2">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="w-full bg-gray-900/80 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="border-t border-gray-700 pt-5 mt-5">
                                        <h4 className="font-medium text-white mb-3">Change Password (Optional)</h4>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                                            <div>
                                                <label htmlFor="currentPassword" className="block text-gray-300 font-medium mb-2">
                                                    Current Password
                                                </label>
                                                <input
                                                    type="password"
                                                    id="currentPassword"
                                                    name="currentPassword"
                                                    value={formData.currentPassword}
                                                    onChange={handleChange}
                                                    className="w-full bg-gray-900/80 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <div>
                                                <label htmlFor="newPassword" className="block text-gray-300 font-medium mb-2">
                                                    New Password
                                                </label>
                                                <input
                                                    type="password"
                                                    id="newPassword"
                                                    name="newPassword"
                                                    value={formData.newPassword}
                                                    onChange={handleChange}
                                                    className="w-full bg-gray-900/80 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>
                                            
                                            <div>
                                                <label htmlFor="confirmPassword" className="block text-gray-300 font-medium mb-2">
                                                    Confirm New Password
                                                </label>
                                                <input
                                                    type="password"
                                                    id="confirmPassword"
                                                    name="confirmPassword"
                                                    value={formData.confirmPassword}
                                                    onChange={handleChange}
                                                    className="w-full bg-gray-900/80 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => setIsEditing(false)}
                                            className="px-5 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                                            disabled={submitting}
                                        >
                                            Cancel
                                        </button>
                                        
                                        <button
                                            type="submit"
                                            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center gap-2"
                                            disabled={submitting}
                                        >
                                            {submitting ? (
                                                <>
                                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Saving Changes...
                                                </>
                                            ) : (
                                                <>
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                    </svg>
                                                    Save Changes
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>

                    {/* Account Security */}
                    {!isEditing && (
                        <div className="bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm border border-gray-700/50 shadow-lg">
                            <h3 className="text-xl font-semibold mb-4 text-white flex items-center">
                                <svg className="w-6 h-6 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                                </svg>
                                Account Security
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-400 mb-1">Last Password Change</h4>
                                    <p className="font-medium text-white">Not changed recently</p>
                                </div>
                                
                                <div>
                                    <h4 className="text-sm font-medium text-gray-400 mb-1">Two-Factor Authentication</h4>
                                    <p className="font-medium text-gray-300">Not enabled</p>
                                </div>
                            </div>
                            
                            <div className="mt-4 flex">
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center"
                                >
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                                    </svg>
                                    Change Password
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </UserLayout>
    );
};

export default UserProfile;
