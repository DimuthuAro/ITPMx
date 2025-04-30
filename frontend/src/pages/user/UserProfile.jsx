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
    const [successMessage, setSuccessMessage] = useState(''); useEffect(() => {
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
        }; fetchUser();
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
            } await updateUser(currentUser.id, updateData);

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

    if (loading) {
        return (
            <UserLayout title="My Profile">
                <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                    <p className="mt-2">Loading profile...</p>
                </div>
            </UserLayout>
        );
    }

    if (error && !user) {
        return (
            <UserLayout title="My Profile">
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
                    <p className="font-bold">Error</p>
                    <p>{error}</p>
                </div>
            </UserLayout>
        );
    }

    return (
        <UserLayout title="My Profile">
            <div className="bg-white shadow-md rounded p-6">
                <div className="flex justify-end mb-6">
                    {!isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                        >
                            Edit Profile
                        </button>
                    )}
                </div>

                {successMessage && (
                    <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded mb-6">
                        <p>{successMessage}</p>
                    </div>
                )}

                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6">
                        <p>{error}</p>
                    </div>
                )}

                {isEditing ? (
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="username" className="block text-gray-700 font-medium mb-2">
                                Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div className="mb-6 border-t pt-4">
                            <h2 className="text-lg font-semibold mb-4">Change Password</h2>
                            <p className="text-sm text-gray-600 mb-4">Leave these fields blank if you don't want to change your password.</p>

                            <div className="mb-4">
                                <label htmlFor="currentPassword" className="block text-gray-700 font-medium mb-2">
                                    Current Password
                                </label>
                                <input
                                    type="password"
                                    id="currentPassword"
                                    name="currentPassword"
                                    value={formData.currentPassword}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="newPassword" className="block text-gray-700 font-medium mb-2">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    id="newPassword"
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    minLength="6"
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-2">
                                    Confirm New Password
                                </label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    minLength="6"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                                disabled={submitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                                disabled={submitting}
                            >
                                {submitting ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div>
                        <div className="mb-6">
                            <div className="flex items-center mb-4">
                                <div className="h-16 w-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold">
                                    {user?.username?.charAt(0).toUpperCase() || '?'}
                                </div>
                                <div className="ml-4">
                                    <h2 className="text-xl font-semibold">{user?.username}</h2>
                                    <p className="text-gray-600">{user?.role === 'admin' ? 'Administrator' : 'User'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="border-t pt-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600">Username</p>
                                    <p className="font-medium">{user?.username}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Email Address</p>
                                    <p className="font-medium">{user?.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Member Since</p>
                                    <p className="font-medium">{new Date(user?.created_at).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </UserLayout>
    );
};

export default UserProfile;
