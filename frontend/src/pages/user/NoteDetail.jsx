import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getNoteById, deleteNote } from '../../services/api';
import UserLayout from '../../components/user/UserLayout';
import { useAuth } from '../../context/AuthContext';

const NoteDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [note, setNote] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isOwner, setIsOwner] = useState(false);
    useEffect(() => {
        const fetchNote = async () => {
            if (!currentUser) {
                setError('You must be logged in to delete notes.');
                return;
            }
            if (!id) return;
            console.log('Fetching note with ID:', id);
            try {
                setLoading(true);
                const response = await getNoteById(id);
                const noteData = response.data || response;
                setNote(noteData);                // Check if current user is the owner of this note
                const userId = currentUser?.id || currentUser?._id;
                setIsOwner(noteData.user === userId || noteData.user?._id === userId);

            } catch (err) {
                console.error('Error fetching note:', err);
                setError('Failed to load note. It might have been deleted or you may not have permission to view it.');
            } finally {
                setLoading(false);
            }
        }; fetchNote();
    }, [id, currentUser]);

    const handleEdit = () => {
        navigate(`/notes/edit/${id}`);
    }; const handleDelete = async () => {
        // Check if user is authenticated and is the owner
        if (!currentUser) {
            setError('You must be logged in to delete notes.');
            return;
        }

        if (!isOwner) {
            setError('You do not have permission to delete this note.');
            return;
        }

        if (window.confirm('Are you sure you want to delete this note? This action cannot be undone.')) {
            try {
                setIsDeleting(true);
                await deleteNote(id);
                navigate('/dashboard');
            } catch (err) {
                console.error('Error deleting note:', err);
                setError('Failed to delete note. Please try again.');
                setIsDeleting(false);
            }
        }
    };

    const handleBack = () => {
        navigate('/dashboard');
    };

    if (loading) {
        return (
            <UserLayout showBackButton onBack={handleBack}>
                <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                    <p className="mt-2">Loading note...</p>
                </div>
            </UserLayout>
        );
    }

    if (error) {
        return (
            <UserLayout showBackButton onBack={handleBack}>
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
                    <p className="font-bold">Error</p>
                    <p>{error}</p>
                </div>
            </UserLayout>
        );
    }

    if (!note) {
        return (
            <UserLayout showBackButton onBack={handleBack}>
                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded">
                    <p>Note not found.</p>
                </div>
            </UserLayout>
        );
    }

    return (
        <UserLayout
            title={note.title}
            subtitle={note.category ? `Category: ${note.category}` : ''}
            showBackButton
            onBack={handleBack}
        >      <div className="bg-white shadow-md rounded p-6">
                {isOwner && (
                    <div className="mb-6 flex justify-end">
                        <div className="flex space-x-2">
                            <button
                                onClick={handleEdit}
                                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
                                disabled={isDeleting}
                            >
                                Edit
                            </button>
                            <button
                                onClick={handleDelete}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                                disabled={isDeleting}
                            >
                                {isDeleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                )}

                <div className="prose max-w-none">
                    <div className="bg-gray-50 p-6 rounded-lg whitespace-pre-wrap">
                        {note.content}
                    </div>
                </div>

                <div className="mt-8 pt-4 border-t text-sm text-gray-500">
                    <p>Created: {new Date(note.created_at).toLocaleString()}</p>
                    <p>Last updated: {new Date(note.updated_at).toLocaleString()}</p>
                </div>
            </div>
        </UserLayout>
    );
};

export default NoteDetail;
