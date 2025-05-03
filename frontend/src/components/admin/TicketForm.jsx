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
                    email: selectedUser.email || prev.email
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
                <div className="bg-gray-800/90 backdrop-blur-sm border border-gray-700 shadow rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4 text-white">
                        {editingTicket ? 'Edit Ticket' : 'Create New Ticket'}
                    </h3>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="mb-4 col-span-2">
                            <label className="block text-gray-200 text-sm font-bold mb-2" htmlFor="userId">
                                User *
                            </label>
                            <select
                                id="userId"
                                name="userId"
                                value={formData.userId}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            >
                                <option value="">Select a user</option>
                                {users.map(user => (
                                    <option key={user._id} value={user._id}>
                                        {user.username} ({user.email})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-200 text-sm font-bold mb-2" htmlFor="name">
                                Name *
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-200 text-sm font-bold mb-2" htmlFor="email">
                                Email *
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
                            <label className="block text-gray-200 text-sm font-bold mb-2" htmlFor="phone">
                                Phone *
                            </label>
                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-200 text-sm font-bold mb-2" htmlFor="inquiry_type">
                                Inquiry Type *
                            </label>
                            <select
                                id="inquiry_type"
                                name="inquiry_type"
                                value={formData.inquiry_type}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            >
                                <option value="technical">Technical Support</option>
                                <option value="billing">Billing Question</option>
                                <option value="general">General Inquiry</option>
                                <option value="feature_request">Feature Request</option>
                                <option value="bug_report">Bug Report</option>
                            </select>
                        </div>

                        <div className="mb-4 col-span-2">
                            <label className="block text-gray-200 text-sm font-bold mb-2" htmlFor="title">
                                Title *
                            </label>
                            <input
                                id="title"
                                name="title"
                                type="text"
                                value={formData.title}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>

                        <div className="mb-4 col-span-2">
                            <label className="block text-gray-200 text-sm font-bold mb-2" htmlFor="description">
                                Description *
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                rows="4"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-200 text-sm font-bold mb-2" htmlFor="status">
                                Status
                            </label>
                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            >
                                <option value="open">Open</option>
                                <option value="in_progress">In Progress</option>
                                <option value="resolved">Resolved</option>
                                <option value="closed">Closed</option>
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-200 text-sm font-bold mb-2" htmlFor="priority">
                                Priority
                            </label>
                            <select
                                id="priority"
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="urgent">Urgent</option>
                            </select>
                        </div>

                        <div className="flex items-center justify-between col-span-2">
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                disabled={isSubmitting}
                            >
                                {isSubmitting
                                    ? (editingTicket ? 'Updating...' : 'Creating...')
                                    : (editingTicket ? 'Update Ticket' : 'Create Ticket')}
                            </button>

                            <button
                                type="button"
                                onClick={handleCancel}
                                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
        </div>
    );
};

export default TicketForm;
