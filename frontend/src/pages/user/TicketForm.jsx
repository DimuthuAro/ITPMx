import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTicket } from '../../services/api';
import UserLayout from '../../components/user/UserLayout';
import { useAuth } from '../../context/AuthContext';

const TicketForm = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        name: currentUser?.name || '',
        email: currentUser?.email || '',
        phone: '',
        inquiry_type: 'general',
        priority: 'medium',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            // Add user ID to form data with correct field name 'user' instead of 'user_id'
            const ticketData = {
                ...formData,
                user: currentUser.id, // Changed from user_id to user to match backend model
            };
            
            const response = await createTicket(ticketData);
            setSuccessMessage('Support ticket submitted successfully!');
            
            // Reset form
            setFormData({
                title: '',
                description: '',
                name: currentUser?.name || '',
                email: currentUser?.email || '',
                phone: '',
                inquiry_type: 'general',
                priority: 'medium',
            });
            
            // Redirect to tickets list after a delay
            setTimeout(() => {
                navigate('/tickets');
            }, 2000);
            
        } catch (err) {
            console.error('Error creating ticket:', err);
            setError('Failed to submit ticket. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/tickets');
    };

    return (
        <UserLayout 
            title="Submit Support Ticket" 
            subtitle="Tell us how we can help you"
            showBackButton={true}
            onBack={() => navigate('/tickets')}
        >
            {successMessage && (
                <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded">
                    <p>{successMessage}</p>
                </div>
            )}
            
            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
                    <p>{error}</p>
                </div>
            )}
            
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1">Phone</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    
                    {/* Right Column */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1">Inquiry Type</label>
                            <select
                                name="inquiry_type"
                                value={formData.inquiry_type}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="general">General Question</option>
                                <option value="technical">Technical Support</option>
                                <option value="billing">Billing Issue</option>
                                <option value="feature_request">Feature Request</option>
                                <option value="bug_report">Bug Report</option>
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1">Priority</label>
                            <select
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="urgent">Urgent</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                {/* Full Width Fields */}
                <div className="mt-6 space-y-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-1">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            placeholder="Brief summary of your issue"
                            className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-1">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows="6"
                            placeholder="Please provide details about your issue or question"
                            className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        ></textarea>
                    </div>
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin h-4 w-4 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Submitting...
                            </>
                        ) : "Submit Ticket"}
                    </button>
                </div>
            </form>
        </UserLayout>
    );
};

export default TicketForm;