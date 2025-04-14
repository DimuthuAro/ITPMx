import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FaUser, FaEnvelope, FaArrowLeft, FaSave } from 'react-icons/fa';

const EditUser = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: ''
    });

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:3000/api/users/${id}`);
            setUser(response.data);
            setFormData({
                name: response.data.name,
                email: response.data.email
            });
        } catch (error) {
            console.error('Error fetching user:', error);
            setError('Failed to fetch user details. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            setError('');
            
            await axios.put(`http://localhost:3000/api/users/${id}`, formData);
            
            setSuccess(true);
            setTimeout(() => {
                window.location.href = '/users';
            }, 1500);
        } catch (error) {
            console.error('Error updating user:', error);
            setError('Failed to update user. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 p-6 pt-24 md:ml-64 min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-indigo-950">
                <div className="relative w-20 h-20">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 animate-ping opacity-75 scale-75"></div>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 animate-ping opacity-75 scale-50 animation-delay-500"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-blue-300/30 animate-spin"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-500 shadow-lg animate-spin"></div>
                </div>
                <p className="mt-4 text-lg font-medium text-blue-300 animate-pulse">Loading user details...</p>
            </div>
        );
    }

    return (
        <div className="p-6 pt-24 md:ml-64 min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-indigo-950 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-600/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-600/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-600/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
            
            {/* Page header */}
            <div className="mb-10 relative z-10">
                <div className="flex items-center">
                    <Link 
                        to="/users" 
                        className="mr-4 p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-blue-300 hover:text-white transition-all duration-200 border border-white/10 hover:border-white/20 shadow-lg"
                    >
                        <FaArrowLeft className="transform transition-transform group-hover:-translate-x-1" />
                    </Link>
                    <div>
                        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                            Edit User
                        </h1>
                        <p className="mt-1 text-indigo-200 text-sm">
                            Update user information
                        </p>
                    </div>
                </div>
            </div>

            {/* Form Container */}
            <div className="max-w-2xl mx-auto relative">
                {/* Success Message */}
                {success && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-gradient-to-br from-green-500/90 to-emerald-600/90 rounded-2xl animate-fade-in transform transition-all shadow-2xl border border-green-400/30">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-1">User Updated Successfully!</h2>
                        <p className="text-green-100">Redirecting to user list...</p>
                    </div>
                )}
                
                <div className="bg-white/5 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/10 p-8 relative z-10 transition-all duration-500 hover:shadow-indigo-900/20">
                    <div className="flex items-center mb-8">
                        <div className="p-3 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-xl mr-4 shadow-lg">
                            <FaUser className="h-7 w-7 text-blue-400" />
                        </div>
                        <h2 className="text-xl font-semibold text-white">User Information</h2>
                    </div>
                    
                    {error && (
                        <div className="mb-8 p-4 rounded-xl bg-red-500/20 border border-red-500/30 text-red-200 text-sm animate-pulse">
                            <div className="flex items-center">
                                <div className="p-1 bg-red-500/30 rounded-full mr-3">
                                    <svg className="w-4 h-4 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                {error}
                            </div>
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="group">
                            <label className="block text-sm font-medium text-blue-300 mb-2">
                                Full Name
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <FaUser className="h-5 w-5 text-blue-400 group-focus-within:text-blue-300 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="block w-full pl-12 pr-4 py-3.5 text-white placeholder-blue-300 bg-white/5 border border-indigo-500/30 focus:border-blue-500/70 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:bg-white/10 transition-all duration-200 shadow-inner"
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>
                        
                        <div className="group">
                            <label className="block text-sm font-medium text-blue-300 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <FaEnvelope className="h-5 w-5 text-blue-400 group-focus-within:text-blue-300 transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="block w-full pl-12 pr-4 py-3.5 text-white placeholder-blue-300 bg-white/5 border border-indigo-500/30 focus:border-blue-500/70 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:bg-white/10 transition-all duration-200 shadow-inner"
                                    placeholder="user@example.com"
                                />
                            </div>
                        </div>
                        
                        <div className="pt-6 flex justify-between">
                            <Link
                                to="/users"
                                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-medium transition-all duration-200 border border-white/10"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={saving || success}
                                className={`flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-sm font-medium transition-all duration-200 shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-105 ${
                                    (saving || success) ? 'opacity-70 cursor-not-allowed' : ''
                                }`}
                            >
                                {saving ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Saving...</span>
                                    </>
                                ) : (
                                    <>
                                        <FaSave className="h-4 w-4" />
                                        <span>Save Changes</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditUser;