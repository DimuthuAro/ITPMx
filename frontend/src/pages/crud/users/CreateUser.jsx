import axios from 'axios';
import { useState } from 'react';
import { FaUser, FaEnvelope, FaLock, FaArrowLeft, FaUserPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const CreateUser = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        
        setLoading(true);
        setError('');
        
        try {
            // Add API call to create user
            const response = await axios.post('http://localhost:3000/api/users', {
                name: formData.name,
                email: formData.email,
                password: formData.password
            });
            
            console.log('User created:', response.data);
            setSuccess(true);
            
            // Redirect after showing success message briefly
            setTimeout(() => {
                window.location.href = '/users';
            }, 1500);
            
        } catch (error) {
            console.error('Error creating user:', error);
            setError('Failed to create user. Please try again.');
        } finally {
            setLoading(false);
        }
    };

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
                            Create New User
                        </h1>
                        <p className="mt-1 text-indigo-200 text-sm">
                            Add a new user to the system with secure credentials
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
                        <h2 className="text-2xl font-bold text-white mb-1">User Created Successfully!</h2>
                        <p className="text-green-100">Redirecting to user list...</p>
                    </div>
                )}
                
                <div className="bg-white/5 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/10 p-8 relative z-10 transition-all duration-500 hover:shadow-indigo-900/20">
                    <div className="flex items-center mb-8">
                        <div className="p-3 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-xl mr-4 shadow-lg">
                            <FaUserPlus className="h-7 w-7 text-blue-400" />
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
                        
                        <div className="group">
                            <label className="block text-sm font-medium text-blue-300 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <FaLock className="h-5 w-5 text-blue-400 group-focus-within:text-blue-300 transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="block w-full pl-12 pr-4 py-3.5 text-white placeholder-blue-300 bg-white/5 border border-indigo-500/30 focus:border-blue-500/70 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:bg-white/10 transition-all duration-200 shadow-inner"
                                    placeholder="••••••••"
                                    minLength="6"
                                />
                            </div>
                            <p className="mt-2 text-xs text-indigo-300">
                                Password must be at least 6 characters long
                            </p>
                        </div>
                        
                        <div className="group">
                            <label className="block text-sm font-medium text-blue-300 mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <FaLock className="h-5 w-5 text-blue-400 group-focus-within:text-blue-300 transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    className={`block w-full pl-12 pr-4 py-3.5 text-white placeholder-blue-300 bg-white/5 border ${
                                        formData.confirmPassword && formData.password !== formData.confirmPassword 
                                            ? 'border-red-500/70 focus:border-red-500 focus:ring-red-500/40' 
                                            : 'border-indigo-500/30 focus:border-blue-500/70 focus:ring-blue-500/40'
                                    } rounded-xl focus:outline-none focus:ring-2 focus:bg-white/10 transition-all duration-200 shadow-inner`}
                                    placeholder="••••••••"
                                />
                            </div>
                            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                                <p className="mt-2 text-sm text-red-400 flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Passwords do not match
                                </p>
                            )}
                        </div>
                        
                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={loading || success}
                                className={`relative w-full flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-sm font-medium transition-all duration-200 shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-[1.02] overflow-hidden ${
                                    (loading || success) ? 'opacity-70 cursor-not-allowed' : ''
                                }`}
                            >
                                <span className="absolute inset-0 flex items-center justify-center w-full h-full transform group-active:scale-95 transition-transform">
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <span>Creating User...</span>
                                        </>
                                    ) : (
                                        <>
                                            <FaUserPlus className="h-5 w-5 mr-2" />
                                            <span>Create User</span>
                                        </>
                                    )}
                                </span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

// Add animation keyframes
const style = document.createElement('style');
style.textContent = `
@keyframes fade-in {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 0.4s forwards ease-out;
}
`;
document.head.appendChild(style);

export default CreateUser;