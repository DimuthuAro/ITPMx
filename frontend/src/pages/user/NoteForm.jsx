import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createNote, getNoteById, updateNote } from '../../services/api';
import UserLayout from '../../components/user/UserLayout';

const NoteForm = () => {
    const { id } = useParams();
    const isEditing = !!id;
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category: '',
    }); const [loading, setLoading] = useState(isEditing);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);

    const currentUser = localStorage.getItem('currentUser');
    // Get user ID from localStorage
    useEffect(() => {
        if (currentUser) {
            const user = JSON.parse(currentUser);
            setUserId(user.id);
        } else {
            // Redirect to login if no user is found
            navigate('/login');
        }
    }, [navigate]); 
    
    useEffect(() => {
        const fetchNote = async () => {
            if (!isEditing || !currentUser?.id) return;

            try {
                const response = await getNoteById(id);
                const noteData = response.data || response;

                // Verify that the current user is the owner of this note
                if (noteData.user !== currentUser.id) {
                    setError("You don't have permission to edit this note.");
                    return;
                }

                setFormData({
                    title: noteData.title,
                    content: noteData.content,
                    category: noteData.category || '',
                });
            } catch (err) {
                console.error('Error fetching note:', err);
                setError('Failed to load note for editing. It might have been deleted.');
            } finally {
                setLoading(false);
            }
        }; fetchNote();
    }, [id, isEditing, currentUser]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            // Validate form (basic validation)
            if (!formData.title.trim()) {
                throw new Error('Title is required');
            }
            if (!formData.content.trim()) {
                throw new Error('Content is required');
            }            // Check if user is authenticated
            if (!currentUser?.id) {
                throw new Error('You must be logged in to save a note');
            }

            // Prepare data including the user ID
            const noteData = {
                ...formData,
                user: currentUser.id
            };

            if (isEditing) {
                await updateNote(id, noteData);
                navigate(`/notes/${id}`);
            } else {
                const response = await createNote(noteData);
                const newNoteId = response.data?._id || response._id;
                navigate(`/notes/${newNoteId}`);
            }
        } catch (err) {
            console.error('Error saving note:', err);
            setError(err.message || 'Failed to save note. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleBack = () => {
        navigate(isEditing ? `/notes/${id}` : '/dashboard');
    };

    if (loading) {
        return (
            <UserLayout showBackButton onBack={handleBack}>
                <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                    <p className="mt-2">Loading...</p>
                </div>
            </UserLayout>
        );
    }

    return (
        <UserLayout
            title={isEditing ? 'Edit Note' : 'Create New Note'}
            showBackButton
            onBack={handleBack}
        >
            <div className="bg-white shadow-md rounded p-6">
                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6">
                        <p>{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
                            Title *
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="category" className="block text-gray-700 font-medium mb-2">
                            Category
                        </label>
                        <input
                            type="text"
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Optional"
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="content" className="block text-gray-700 font-medium mb-2">
                            Content *
                        </label>
                        <textarea
                            id="content"
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            rows="12"
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <button
                            type="button"
                            onClick={handleBack}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                            disabled={submitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                            disabled={submitting}
                        >
                            {submitting ? 'Saving...' : 'Save Note'}
                        </button>
                    </div>
                </form>
            </div>
        </UserLayout>
    );
};

export default NoteForm;
