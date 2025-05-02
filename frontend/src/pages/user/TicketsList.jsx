import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getTickets } from '../../services/api';
import TicketCard from '../../components/user/TicketCard';
import UserLayout from '../../components/user/UserLayout';
import { useAuth } from '../../context/AuthContext';

const TicketsList = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [tickets, setTickets] = useState([]);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchTickets = async () => {
            if (!currentUser?.id) return; // Don't fetch if no userId
            setLoading(true);
            
            try {
                const response = await getTickets();
                // Filter tickets for the current user
                const userTickets = response.data.filter(ticket => ticket.user === currentUser.id);
                setTickets(userTickets);
            } catch (err) {
                console.error('Error fetching tickets:', err);
                setError('Failed to load tickets. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchTickets();
    }, [currentUser]);

    // Filter tickets based on search term, status, and priority
    const filteredTickets = tickets
        .filter(ticket => {
            const titleMatch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase());
            const statusMatch = statusFilter ? ticket.status === statusFilter : true;
            const priorityMatch = priorityFilter ? ticket.priority === priorityFilter : true;
            return titleMatch && statusMatch && priorityMatch;
        })
        .sort((a, b) => {
            // Sort by priority first (urgent -> high -> medium -> low)
            const priorityValues = { urgent: 0, high: 1, medium: 2, low: 3 };
            if (priorityValues[a.priority] !== priorityValues[b.priority]) {
                return priorityValues[a.priority] - priorityValues[b.priority];
            }
            // Then sort by date (newest first)
            return new Date(b.created_at) - new Date(a.created_at);
        });

    return (
        <UserLayout title="My Support Tickets" subtitle="View and manage your support requests">
            <div className="mb-8 bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm border border-gray-700/50">
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <div className="flex-1">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder="Search tickets..."
                                className="w-full pl-10 p-3 bg-gray-900/80 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="md:w-1/4">
                        <select
                            className="w-full p-3 bg-gray-900/80 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="">All Statuses</option>
                            <option value="open">Open</option>
                            <option value="in_progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                            <option value="closed">Closed</option>
                        </select>
                    </div>

                    <div className="md:w-1/4">
                        <select
                            className="w-full p-3 bg-gray-900/80 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={priorityFilter}
                            onChange={(e) => setPriorityFilter(e.target.value)}
                        >
                            <option value="">All Priorities</option>
                            <option value="urgent">Urgent</option>
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                        </select>
                    </div>
                </div>
                
                <div className="flex justify-between items-center">
                    <div className="text-gray-300 text-sm">
                        <span className="font-medium">{filteredTickets.length}</span> tickets found
                    </div>
                    <Link
                        to="/tickets/create"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                        </svg>
                        Create Ticket
                    </Link>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    <p className="mt-4 text-lg text-gray-300">Loading your tickets...</p>
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
            ) : filteredTickets.length === 0 ? (
                <div className="text-center py-16 bg-gray-800/30 rounded-xl border border-gray-700/50 backdrop-blur-sm">
                    <svg className="w-16 h-16 mx-auto text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <div className="text-gray-300 text-lg mt-4">
                        {tickets.length === 0 ? "You don't have any tickets yet" : "No tickets match your search"}
                    </div>
                    <Link
                        to="/tickets/create"
                        className="mt-6 inline-flex items-center px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                        Submit a Support Ticket
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTickets.map((ticket) => (
                        <div key={ticket._id} className="h-full">
                            <TicketCard ticket={ticket} />
                        </div>
                    ))}
                </div>
            )}

            {filteredTickets.length > 0 && (
                <div className="mt-8 text-center">
                    <div className="inline-flex items-center px-5 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg shadow backdrop-blur-sm">
                        <span className="text-gray-300">Total Tickets: <span className="font-medium text-white">{filteredTickets.length}</span></span>
                    </div>
                </div>
            )}
        </UserLayout>
    );
};

export default TicketsList;