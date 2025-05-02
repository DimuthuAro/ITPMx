import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getNotes } from '../../services/api';
import NoteCard from '../../components/user/NoteCard';
import UserLayout from '../../components/user/UserLayout';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [notes, setNotes] = useState([]);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchNotes = async () => {
            if (!currentUser?.id) return; // Don't fetch if no userId
            setLoading(true); 
            await getNotes()
                .then((response) => {
                    setNotes(response);
                })
                .catch((err) => {
                    console.error('Error fetching notes:', err);
                    setError('Failed to load notes. Please try again later.');
                })
                .finally(() => {
                    setLoading(false)
                });
        };

        fetchNotes();
    }, [currentUser]);

    // Get unique categories
    const categories = [...new Set(notes.map(note => note.category).filter(Boolean))];

    // Filter notes based on search term and category
    const filteredNotes = notes
        .filter(note => {
            const titleMatch = note.title.toLowerCase().includes(searchTerm.toLowerCase());
            const categoryMatch = categoryFilter ? note.category === categoryFilter : true;
            return titleMatch && categoryMatch;
        })
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort by date descending
    return (
        <UserLayout title="My Notes" subtitle="Manage your notes easily">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="Search notes..."
                        className="w-full p-2 border border-gray-600 rounded bg-gray-800/90 text-gray-300 backdrop-blur-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="md:w-1/4">
                    <select
                        className="w-full p-2 border border-gray-600 rounded bg-gray-800/90 text-gray-300 backdrop-blur-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                        <option value="">All Categories</option>
                        {categories.map((category, index) => (
                            <option key={index} value={category}>{category}</option>
                        ))}
                    </select>
                </div>

                <div className="flex space-x-2">
                    <Link
                        to="/notes/create"
                        className="block text-center bg-blue-600/90 hover:bg-blue-700/90 text-white px-4 py-2 rounded backdrop-blur-sm"
                    >
                        Create Note
                    </Link>
                    
                    <Link
                        to="/tickets"
                        className="block text-center bg-green-600/90 hover:bg-green-700/90 text-white px-4 py-2 rounded backdrop-blur-sm flex items-center"
                    >
                        <span>Support Tickets</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="ml-1">
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0-11a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h1.5a.5.5 0 0 0 0-1H8V5a1 1 0 0 0-1-1z"/>
                        </svg>
                    </Link>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-8 bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-400"></div>
                    <p className="mt-2 text-gray-300">Loading your notes...</p>
                </div>
            ) : error ? (
                <div className="bg-red-900/80 backdrop-blur-sm border-l-4 border-red-500 text-red-200 p-4 rounded">
                    <p>{error}</p>
                </div>
            ) : filteredNotes.length === 0 ? (
                <div className="text-center py-8 bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
                    <div className="text-gray-400 mb-4">
                        {notes.length === 0 ? "You don't have any notes yet" : "No notes match your search"}
                    </div>
                    <Link
                        to="/notes/create"
                        className="inline-block bg-blue-600/90 hover:bg-blue-700/90 text-white px-4 py-2 rounded backdrop-blur-sm"
                    >
                        Create Your First Note
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredNotes.map((note) => (
                        <div key={note._id}>
                            <NoteCard note={note} />
                        </div>
                    ))}
                </div>
            )}

            <div className="mt-8 text-center text-gray-400 bg-gray-800/50 backdrop-blur-sm p-2 rounded border border-gray-700">
                <p>Total Notes: {filteredNotes.length}</p>
            </div>
        </UserLayout>
    );
};

export default Dashboard;
