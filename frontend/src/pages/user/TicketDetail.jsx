import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTicketById, updateTicket } from '../../services/api';
import UserLayout from '../../components/user/UserLayout';
import { useAuth } from '../../context/AuthContext';

const TicketDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchTicket = async () => {
            try {
                const response = await getTicketById(id);
                setTicket(response.data);
            } catch (err) {
                console.error('Error fetching ticket:', err);
                setError('Failed to load ticket details. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchTicket();
    }, [id]);

    const handleUpdateStatus = async (newStatus) => {
        if (!currentUser) return;
        
        setIsSubmitting(true);
        try {
            const response = await updateTicket(id, { status: newStatus });
            setTicket(response.data);
            setSuccessMessage(`Ticket status updated to ${newStatus.replace('_', ' ')}`);
            
            // Clear success message after 3 seconds
            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
        } catch (err) {
            console.error('Error updating ticket:', err);
            setError('Failed to update ticket status. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAddComment = async () => {
        if (!comment.trim() || !currentUser) return;
        
        setIsSubmitting(true);
        try {
            // In a real implementation, you would send this comment to the server
            // For now, we'll just update the UI
            setSuccessMessage('Comment submitted successfully');
            setComment('');
            
            // Clear success message after 3 seconds
            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
        } catch (err) {
            console.error('Error adding comment:', err);
            setError('Failed to add comment. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Format date to be more readable
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    // Status badge color
    const getStatusColor = (status) => {
        const colors = {
            open: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
            in_progress: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
            resolved: 'bg-green-500/20 text-green-400 border border-green-500/30',
            closed: 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
        };
        return colors[status] || 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
    };

    // Priority badge color
    const getPriorityColor = (priority) => {
        const colors = {
            low: 'bg-gray-500/20 text-gray-400 border border-gray-500/30',
            medium: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
            high: 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
            urgent: 'bg-red-500/20 text-red-400 border border-red-500/30'
        };
        return colors[priority] || 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
    };

    return (
        <UserLayout 
            title="Ticket Details" 
            showBackButton={true} 
            onBack={() => navigate('/tickets')}
            subtitle="View and manage your support request"
        >
            {loading ? (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    <p className="mt-4 text-lg text-gray-300">Loading ticket details...</p>
                </div>
            ) : error ? (
                <div className="bg-red-900/40 border-l-4 border-red-500 text-red-100 p-6 rounded-lg backdrop-blur-sm">
                    <p className="flex items-center">
                        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        {error}
                    </p>
                </div>
            ) : ticket ? (
                <div className="space-y-6">
                    {successMessage && (
                        <div className="bg-green-900/30 border-l-4 border-green-500 text-green-100 p-4 rounded backdrop-blur-sm">
                            <p className="flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                {successMessage}
                            </p>
                        </div>
                    )}
                    
                    {/* Ticket Header */}
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center bg-gray-800/50 p-6 rounded-xl backdrop-blur-sm border border-gray-700/50">
                        <h1 className="text-2xl font-bold text-white">{ticket.title}</h1>
                        <div className="flex space-x-2 mt-2 md:mt-0">
                            <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(ticket.status)}`}>
                                {ticket.status.replace('_', ' ').toUpperCase()}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-sm ${getPriorityColor(ticket.priority)}`}>
                                {ticket.priority.toUpperCase()}
                            </span>
                        </div>
                    </div>
                    
                    {/* Ticket Information */}
                    <div className="bg-gray-800/40 rounded-xl overflow-hidden backdrop-blur-sm border border-gray-700/50">
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-400">Ticket ID</h3>
                                    <p className="mt-1 text-white">{ticket._id}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-400">Created</h3>
                                    <p className="mt-1 text-white">{formatDate(ticket.created_at)}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-400">Contact Name</h3>
                                    <p className="mt-1 text-white">{ticket.name}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-400">Contact Email</h3>
                                    <p className="mt-1 text-white">{ticket.email}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-400">Phone</h3>
                                    <p className="mt-1 text-white">{ticket.phone}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-400">Inquiry Type</h3>
                                    <p className="mt-1 text-white">{ticket.inquiry_type.replace('_', ' ').charAt(0).toUpperCase() + ticket.inquiry_type.replace('_', ' ').slice(1)}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-400">Last Updated</h3>
                                    <p className="mt-1 text-white">{formatDate(ticket.updated_at)}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-400">Resolved Date</h3>
                                    <p className="mt-1 text-white">{ticket.resolved_at ? formatDate(ticket.resolved_at) : 'Not resolved yet'}</p>
                                </div>
                            </div>
                            
                            <div className="border-t border-gray-700 pt-6 mb-6">
                                <h3 className="text-sm font-medium text-gray-400 mb-2">Description</h3>
                                <p className="whitespace-pre-wrap text-white">{ticket.description}</p>
                            </div>
                            
                            {/* Actions */}
                            <div className="border-t border-gray-700 pt-6">
                                <h3 className="text-sm font-medium text-gray-400 mb-4">Actions</h3>
                                
                                <div className="flex flex-wrap gap-2">
                                    {ticket.status !== 'closed' && (
                                        <button 
                                            onClick={() => handleUpdateStatus('closed')}
                                            disabled={isSubmitting}
                                            className="bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 px-4 py-2 rounded-lg transition-colors duration-200 disabled:opacity-50 flex items-center gap-2"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                            </svg>
                                            Close Ticket
                                        </button>
                                    )}
                                    
                                    {ticket.status === 'closed' && (
                                        <button 
                                            onClick={() => handleUpdateStatus('open')}
                                            disabled={isSubmitting}
                                            className="bg-green-500/20 hover:bg-green-500/30 text-green-300 border border-green-500/30 px-4 py-2 rounded-lg transition-colors duration-200 disabled:opacity-50 flex items-center gap-2"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                                            </svg>
                                            Reopen Ticket
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Comments Section */}
                    <div className="bg-gray-800/40 rounded-xl overflow-hidden backdrop-blur-sm border border-gray-700/50">
                        <div className="p-6">
                            <h3 className="text-lg font-medium text-white mb-4">Add a Comment</h3>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Type your comment here..."
                                rows="3"
                                className="w-full bg-gray-900/80 border border-gray-700 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
                            ></textarea>
                            <div className="mt-4 flex justify-end">
                                <button 
                                    onClick={handleAddComment}
                                    disabled={!comment.trim() || isSubmitting}
                                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 flex items-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                                    </svg>
                                    {isSubmitting ? 'Submitting...' : 'Add Comment'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center py-12 bg-gray-800/30 rounded-xl border border-gray-700/50 backdrop-blur-sm">
                    <svg className="w-16 h-16 mx-auto text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <p className="text-gray-300 text-lg mt-4">Ticket not found</p>
                </div>
            )}
        </UserLayout>
    );
};

export default TicketDetail;