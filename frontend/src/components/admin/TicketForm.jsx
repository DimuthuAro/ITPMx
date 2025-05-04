import { useState, useEffect } from 'react';
import { createTicket, updateTicket, getUsers } from '../../services/api';

const TicketForm = ({ onTicketAdded, onTicketUpdated, editingTicket, setEditingTicket }) => {
    const [users, setUsers] = useState([]);
    const initialFormState = {
        title: '',
        description: '',
        userId: '',
        name: '',
        email: '',
        phone: '',
        inquiry_type: 'general',
        status: 'open',
        priority: 'medium'
    };

    const [formData, setFormData] = useState(initialFormState);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);

    // Load users for the dropdown
    useEffect(() => {
        const loadUsers = async () => {
            try {
                const userData = await getUsers();
                setUsers(userData);
            } catch (err) {
                console.error('Error loading users:', err);
            }
        };

        loadUsers();
    }, []);

    // Set form data when editing ticket changes
    useEffect(() => {
        if (editingTicket) {
            setShowForm(true);
            setFormData({
                title: editingTicket.title || '',
                description: editingTicket.description || '',
                userId: editingTicket.user?._id || editingTicket.user || '',
                name: editingTicket.name || '',
                email: editingTicket.email || '',
                phone: editingTicket.phone || '',
                inquiry_type: editingTicket.inquiry_type || 'general',
                status: editingTicket.status || 'open',
                priority: editingTicket.priority || 'medium'
            });
        }
    }, [editingTicket]);

    // Handle user selection and auto-fill user details
    useEffect(() => {
        if (formData.userId && users.length > 0) {
            const selectedUser = users.find(user => user._id === formData.userId);
            if (selectedUser) {
                setFormData(prev => ({
                    ...prev,
                    name: selectedUser.name || selectedUser.username || prev.name,
                }));
            }
        }
    }, [formData.userId, users]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setFormData(initialFormState);
        setEditingTicket && setEditingTicket(null);
        setError(null);
    };

    const handleCancel = () => {
        resetForm();
        setShowForm(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        console.log('Form data:', formData); // Debugging line
        try {
            // Prepare data for submission
            const ticketData = {
                ...formData,
                user: formData.userId, // Map userId to user field expected by backend
            };
            delete ticketData.userId; // Remove the temporary userId field

            if (editingTicket) {
                await updateTicket(editingTicket._id, ticketData);
                onTicketUpdated({ ...editingTicket, ...ticketData });
                setEditingTicket(null);
            } else {
                const newTicket = await createTicket(ticketData);
                onTicketAdded(newTicket);
            }
            resetForm();
            setShowForm(false);
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred while saving the ticket');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mb-6">
            <div className="bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm border border-gray-700/50 shadow-lg">
                <h3 className="text-xl font-semibold text-white mb-6">
                    {editingTicket ? 'Edit Ticket' : 'Create New Ticket'}
                </h3>

                {error && (
                    <div className="bg-red-900/40 border-l-4 border-red-500 text-red-100 p-4 rounded-lg backdrop-blur-sm mb-6" role="alert">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-300 font-medium mb-2" htmlFor="name">
                                Name *
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full bg-gray-900/80 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-300 font-medium mb-2" htmlFor="email">
                                Email *
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full bg-gray-900/80 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-300 font-medium mb-2" htmlFor="phone">
                                Phone *
                            </label>
                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full bg-gray-900/80 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-300 font-medium mb-2" htmlFor="inquiry_type">
                                Inquiry Type *
                            </label>
                            <select
                                id="inquiry_type"
                                name="inquiry_type"
                                value={formData.inquiry_type}
                                onChange={handleChange}
                                className="w-full bg-gray-900/80 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            >
                                <option value="technical">Technical Support</option>
                                <option value="billing">Billing Question</option>
                                <option value="general">General Inquiry</option>
                                <option value="feature_request">Feature Request</option>
                                <option value="bug_report">Bug Report</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-gray-300 font-medium mb-2" htmlFor="title">
                                Title *
                            </label>
                            <input
                                id="title"
                                name="title"
                                type="text"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full bg-gray-900/80 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-gray-300 font-medium mb-2" htmlFor="description">
                                Description *
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full bg-gray-900/80 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                rows="5"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-300 font-medium mb-2" htmlFor="status">
                                Status
                            </label>
                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full bg-gray-900/80 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="open">Open</option>
                                <option value="in_progress">In Progress</option>
                                <option value="resolved">Resolved</option>
                                <option value="closed">Closed</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-gray-300 font-medium mb-2" htmlFor="priority">
                                Priority
                            </label>
                            <select
                                id="priority"
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                                className="w-full bg-gray-900/80 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="urgent">Urgent</option>
                            </select>
                        </div>

                        <div className="flex items-center justify-end col-span-2">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200 font-medium shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 mr-4"
                            >
                                Cancel
                            </button>
                            
                            <button
                                type="submit"
                                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center gap-2 disabled:opacity-60"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        {editingTicket ? 'Updating...' : 'Creating...'}
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                        </svg>
                                        {editingTicket ? 'Update Ticket' : 'Create Ticket'}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TicketForm;
