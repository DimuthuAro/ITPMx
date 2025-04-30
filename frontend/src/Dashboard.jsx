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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');

    useEffect(() => {
        const fetchNotes = async () => {
            if (!currentUser?.id) return; // Don't fetch if no userId

            try {
                setLoading(true);
                // Get notes from API
                const response = await getNotes();
                // Filter notes belonging to the current user
                const userNotes = Array.isArray(response)
                    ? response.filter(note => note.user === currentUser.id)
                    : [];
                setNotes(userNotes);
            } catch (err) {
                console.error('Error fetching notes:', err);
                setError('Failed to load notes. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchNotes();
    }, [currentUser]);

    // Get unique categories
    const categories = [...new Set(notes.map(note => note.category).filter(Boolean))];

    // Filter notes based on search term and category
    const filteredNotes = notes.filter(note => {
        const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (note.content && note.content.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesCategory = categoryFilter ? note.category === categoryFilter : true;
        return matchesSearch && matchesCategory;
    });

    return (
        <UserLayout title="My Notes" subtitle="Manage your notes easily">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="Search notes..."
                        className="w-full p-2 border border-gray-300 rounded"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="md:w-1/4">
                    <select
                        className="w-full p-2 border border-gray-300 rounded"
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                        <option value="">All Categories</option>
                        {categories.map((category, index) => (
                            <option key={index} value={category}>{category}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <Link
                        to="/notes/create"
                        className="block w-full md:w-auto text-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        Create Note
                    </Link>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                    <p className="mt-2">Loading your notes...</p>
                </div>
            ) : error ? (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
                    <p>{error}</p>
                    </div>
                ) : filteredNotes.length === 0 ? (
                    <div className="text-center py-8">
                        <div className="text-gray-500 mb-4">
                            {notes.length === 0 ? "You don't have any notes yet" : "No notes match your search"}
                            </div>
                            <Link
                                to="/notes/create"
                                className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
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

            <div className="mt-8 text-center text-gray-500">
                <p>Total Notes: {filteredNotes.length}</p>
            </div>
        </UserLayout>
    );
};

export default Dashboard;
