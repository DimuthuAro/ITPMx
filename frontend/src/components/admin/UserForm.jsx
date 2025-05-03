import { useState, useEffect } from 'react';
import { createUser } from '../../services/api';

const UserForm = ({ onUserCreated, onUserUpdated, editingUser, setEditingUser }) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'user'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        if (editingUser) {
            setFormData({
                username: editingUser.username || '',
                email: editingUser.email || '',
                password: '', 
                role: editingUser.role || 'user'
            });
            setShowForm(true);
        }
    }, [editingUser]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const response = await createUser(formData);
            onUserCreated(response.data);
            setFormData({
                username: '',
                email: '',
                password: '',
                role: 'user'
            });
            setShowForm(false);
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred while creating the user');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mb-6">
            {!showForm ? (
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                    Add New User
                </button>
            ) : (
                <div className="bg-gray-800/90 backdrop-blur-sm border border-gray-700 shadow rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4 text-white">Add New User</h3>
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-200 text-sm font-bold mb-2" htmlFor="username">
                                Username
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                value={formData.username}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-200 text-sm font-bold mb-2" htmlFor="email">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-200 text-sm font-bold mb-2" htmlFor="password">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-200 text-sm font-bold mb-2" htmlFor="role">
                                Role
                            </label>
                            <select
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        <div className="flex items-center justify-between">
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Creating...' : 'Create User'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default UserForm;
