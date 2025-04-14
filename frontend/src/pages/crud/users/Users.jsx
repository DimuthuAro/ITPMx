import { useState, useEffect } from 'react';
import { RiLockPasswordLine } from 'react-icons/ri';
import { FaSync, FaSearch, FaUserPlus, FaDownload, FaPrint, FaUserShield, FaEdit as FaEditIcon, FaTrash, FaEnvelope } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '' });
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(10);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get('http://localhost:3000/api/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
            setError('Failed to fetch users. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (user) => {
        setEditingUser(user);
        setFormData({ name: user.name, email: user.email });
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:3000/api/users/${editingUser.id}`, formData);
            setUsers(users.map(user => 
                user.id === editingUser.id ? { ...user, ...formData } : user
            ));
            setEditingUser(null);
        } catch (error) {
            setError('Failed to update user. Please try again.' + error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await axios.delete(`http://localhost:3000/api/users/${id}`);
                setUsers(users.filter(user => user.id !== id));
            } catch (error) {
                setError('Failed to delete user. Please try again.' + error);
            }
        }
    };

    const handleChangePassword = async (id) => {
        if (window.confirm('Are you sure you want to change this user\'s password?')) {
            let user = {};
            const newPassword = prompt('Enter the new password:');
            const confirmPassword = prompt('Confirm the new password:');
            await axios.get(`http://localhost:3000/api/users/${id}`)
            .then(response => {
                user = response.data;
            })
            .catch(error => {
                console.log(error);
            });

            if (newPassword && confirmPassword) {
                if (newPassword === confirmPassword) {
                    try {
                        await axios.put(`http://localhost:3000/api/users/${id}`, {
                                                                                    name: user.name,
                                                                                    email: user.email,
                                                                                    password: newPassword 
                                                                                    });
                        alert('Password changed successfully.');
                    } catch (error) {
                        setError('Failed to change password. Please try again.' + error);
                    }
                } else {
                    alert('Passwords do not match. Please try again.');
                }
            } else {
                alert('Password change canceled.');
            }
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    // Pagination
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    ).length / usersPerPage);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-64">
            <div className="relative w-20 h-20">
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 animate-ping opacity-75 scale-75"></div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 animate-ping opacity-75 scale-50 animation-delay-500"></div>
                <div className="absolute inset-0 rounded-full border-4 border-blue-300/30 animate-spin"></div>
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-500 shadow-lg animate-spin animation-delay-300"></div>
                <FaUserShield className="absolute text-blue-300 w-8 h-8 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
            </div>
            <p className="mt-4 text-lg font-medium text-blue-300 animate-pulse">Loading users...</p>
            <p className="mt-2 text-sm text-blue-300/70">Please wait while we retrieve the data</p>
        </div>
    );

    if (error) return (
        <div className="flex flex-col items-center justify-center h-64">
            <div className="p-8 rounded-2xl bg-gradient-to-br from-red-500/20 to-red-600/20 border border-red-500/30 shadow-lg shadow-red-500/10 backdrop-blur-sm">
                <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-white mb-2">{error}</h2>
                    <p className="text-red-200 mb-6">There was a problem fetching the users data.</p>
                    <button 
                        className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-200 rounded-lg transition-all duration-200 flex items-center space-x-2"
                        onClick={fetchUsers}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span>Try Again</span>
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Decorative Background Elements */}
            <div className="absolute top-1/4 -left-24 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute top-3/4 -right-24 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
            
            {/* Page header */}
            <div className="mb-8 relative z-10">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex-1">
                        <div className="flex items-center">
                            <div className="p-3 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-2xl mr-4 shadow-lg">
                                <FaUserShield className="h-8 w-8 text-blue-400" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                                    User Management
                                </h1>
                                <p className="mt-1 text-gray-300 text-sm">
                                    Manage system users, edit profiles and control access permissions
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 md:mt-0 flex flex-wrap gap-3">
                        <button 
                            onClick={fetchUsers}
                            className="group px-4 py-2.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-200 rounded-xl flex items-center space-x-1.5 text-sm font-medium transition-all duration-200 backdrop-blur-sm shadow-lg shadow-blue-900/20 border border-blue-500/20 hover:shadow-blue-900/30"
                        >
                            <FaSync className="h-4 w-4 group-hover:rotate-180 transition-transform duration-700" />
                            <span>Refresh</span>
                        </button>
                        <Link 
                            to="/create-user"
                            className="group px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl flex items-center space-x-2 text-sm font-medium transition-all duration-200 shadow-lg shadow-indigo-900/30 hover:shadow-indigo-900/40 hover:scale-105"
                        >
                            <FaUserPlus className="h-4 w-4 group-hover:scale-110 transition-transform" />
                            <span>Add User</span>
                        </Link>
                    </div>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaSearch className="h-4 w-4 text-blue-400" />
                        </div>
                        <input 
                            type="text" 
                            className="block w-full pl-10 pr-3 py-3 bg-white/5 border border-indigo-500/30 rounded-xl text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm shadow-inner"
                            placeholder="Search users by name or email..." 
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>
                    <div className="flex gap-2">
                        <button className="group p-3 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 rounded-xl transition-all duration-200 border border-indigo-500/30 shadow-lg shadow-indigo-900/20">
                            <FaDownload className="h-4 w-4 group-hover:translate-y-0.5 transition-transform" />
                        </button>
                        <button className="group p-3 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 rounded-xl transition-all duration-200 border border-purple-500/30 shadow-lg shadow-purple-900/20">
                            <FaPrint className="h-4 w-4 group-hover:scale-110 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white/5 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden relative z-10 transition-all duration-500 hover:shadow-indigo-900/30">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-white/10">
                        <thead>
                            <tr className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20">
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-blue-300 uppercase tracking-wider">ID</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-blue-300 uppercase tracking-wider">Name</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-blue-300 uppercase tracking-wider">Email</th>
                                <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-blue-300 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10 bg-white/[0.02]">
                            {currentUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="p-4 bg-indigo-600/20 rounded-full mb-4">
                                                <FaSearch className="h-8 w-8 text-indigo-400" />
                                            </div>
                                            <p className="text-gray-300 text-lg font-medium mb-2">No users found</p>
                                            <p className="text-gray-400 text-sm">Try a different search or add a new user</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                currentUsers.map(user => (
                                    <tr key={user.id} className="group hover:bg-white/10 transition-colors duration-300">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/30">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="ml-3">
                                                    <p className="text-sm font-medium text-white group-hover:text-blue-300 transition-colors">{user.name}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <FaEnvelope className="h-3.5 w-3.5 text-blue-400 mr-2 opacity-70" />
                                                <span className="text-sm text-gray-300 group-hover:text-gray-200 transition-colors">{user.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2 flex justify-end">
                                            <button 
                                                onClick={() => handleEditClick(user)}
                                                className="p-2 text-emerald-400 hover:text-white hover:bg-emerald-500 rounded-lg transition-all duration-200 hover:scale-110 hover:shadow-lg hover:shadow-emerald-500/30"
                                                title="Edit user"
                                            >
                                                <FaEditIcon size={18} />
                                            </button>
                                            <button 
                                                onClick={() => handleChangePassword(user.id)}
                                                className="p-2 text-amber-400 hover:text-white hover:bg-amber-500 rounded-lg transition-all duration-200 hover:scale-110 hover:shadow-lg hover:shadow-amber-500/30"
                                                title="Change password"
                                            >
                                                <RiLockPasswordLine size={18} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(user.id)}
                                                className="p-2 text-red-400 hover:text-white hover:bg-red-500 rounded-lg transition-all duration-200 hover:scale-110 hover:shadow-lg hover:shadow-red-500/30"
                                                title="Delete user"
                                            >
                                                <FaTrash size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="px-6 py-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-indigo-600/10 to-purple-600/10">
                    <div className="text-sm text-indigo-300">
                        Showing <span className="font-semibold text-white">{indexOfFirstUser + 1}</span> to <span className="font-semibold text-white">{Math.min(indexOfLastUser, users.filter(user => 
                            user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            user.email.toLowerCase().includes(searchTerm.toLowerCase())
                        ).length)}</span> of <span className="font-semibold text-white">{users.filter(user => 
                            user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            user.email.toLowerCase().includes(searchTerm.toLowerCase())
                        ).length}</span> results
                    </div>
                    <div className="flex flex-wrap justify-center sm:justify-end gap-2">
                        <button
                            onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                            disabled={currentPage === 1}
                            className={`px-4 py-2 ${currentPage === 1 ? 'bg-white/5 text-indigo-400 cursor-not-allowed' : 'bg-white/10 hover:bg-white/20 text-white hover:shadow-lg'} rounded-lg text-sm transition-all duration-200 flex items-center space-x-1`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            <span>Previous</span>
                        </button>
                        {totalPages > 0 && Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => paginate(i + 1)}
                                className={`w-10 h-10 flex items-center justify-center ${currentPage === i + 1 ? 'bg-gradient-to-r from-blue-600 to-indigo-600 ring-2 ring-blue-400/30' : 'bg-white/10 hover:bg-white/20'} text-white rounded-lg text-sm transition-all duration-200`}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                            disabled={currentPage === totalPages || totalPages === 0}
                            className={`px-4 py-2 ${currentPage === totalPages || totalPages === 0 ? 'bg-white/5 text-indigo-400 cursor-not-allowed' : 'bg-white/10 hover:bg-white/20 text-white hover:shadow-lg'} rounded-lg text-sm transition-all duration-200 flex items-center space-x-1`}
                        >
                            <span>Next</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            {/* Edit Modal */}
            {editingUser && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm" onClick={() => setEditingUser(null)}>
                    <div 
                        className="bg-gradient-to-br from-indigo-950/90 to-purple-950/90 rounded-2xl border border-indigo-500/20 p-6 shadow-2xl max-w-md w-full animate-modal-in transform transition-all mx-4 backdrop-blur-md"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal decoration */}
                        <div className="absolute -z-10 inset-0 overflow-hidden rounded-2xl">
                            <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500 rounded-full opacity-10 filter blur-2xl"></div>
                            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500 rounded-full opacity-10 filter blur-2xl"></div>
                        </div>
                        
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center">
                                <div className="p-2 mr-3 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-lg shadow-lg">
                                    <FaEditIcon size={24} className="text-blue-400" />
                                </div>
                                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Edit User</h2>
                            </div>
                            <button
                                className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                                onClick={() => setEditingUser(null)}
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={handleUpdateUser} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-blue-300 mb-2">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    className="block w-full px-4 py-3 text-white placeholder-blue-300 bg-white/5 border border-indigo-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-inner"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-blue-300 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                    className="block w-full px-4 py-3 text-white placeholder-blue-300 bg-white/5 border border-indigo-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-inner"
                                />
                            </div>
                            <div className="flex justify-end space-x-3 pt-5">
                                <button
                                    type="button"
                                    onClick={() => setEditingUser(null)}
                                    className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-medium transition-all duration-200 border border-white/10"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-sm font-medium transition-all duration-200 shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/40 hover:scale-105"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

// Add a keyframe animation for the modal
const style = document.createElement('style');
style.textContent = `
@keyframes modalIn {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
.animate-modal-in {
  animation: modalIn 0.3s forwards;
}
@keyframes blob {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}
.animate-blob {
  animation: blob 6s infinite;
}
.animation-delay-2000 {
  animation-delay: 2s;
}
.animation-delay-4000 {
  animation-delay: 4s;
}
`;
document.head.appendChild(style);

export default Users;