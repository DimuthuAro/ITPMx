import { useState, useEffect } from 'react';
import { createNote, updateNote, getUsers } from '../../services/api';

const NoteForm = ({ onNoteAdded, onNoteUpdated, editingNote, setEditingNote }) => {
    const [users, setUsers] = useState([]);
    const initialFormState = {
        title: '',
        content: '',
        category: '',
        user: ''
    };

    const [formData, setFormData] = useState(initialFormState);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [categoryError, setCategoryError] = useState('');

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

    // Set form data when editing note changes
    useEffect(() => {
        if (editingNote) {
            setFormData({
                title: editingNote.title || '',
                content: editingNote.content || '',
                category: editingNote.category || '',
                user: editingNote.user?._id || editingNote.user || ''
            });
            setShowForm(true);
        }
    }, [editingNote]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Special validation for category field
        if (name === 'category') {
            // If the field is empty or first character is a letter
            if (value === '' || /^[a-zA-Z].*/.test(value)) {
                setFormData(prev => ({ ...prev, [name]: value }));
                setCategoryError('');
            } else {
                // Show error but don't update the form value
                setCategoryError('Category must start with a letter, not a number');
            }
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const resetForm = () => {
        setFormData(initialFormState);
        setEditingNote && setEditingNote(null);
        setError(null);
        setCategoryError('');
    };

    const handleCancel = () => {
        resetForm();
        setShowForm(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate category before submission
        if (formData.category && /^[0-9]/.test(formData.category)) {
            setCategoryError('Category must start with a letter, not a number');
            return;
        }
        
        setIsSubmitting(true);
        setError(null);

        try {
            if (editingNote) {
                await updateNote(editingNote._id, formData);
                onNoteUpdated({ ...editingNote, ...formData });
                setEditingNote(null);
            } else {
                const newNote = await createNote(formData);
                onNoteAdded(newNote);
            }
            resetForm();
            setShowForm(false);
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred while saving the note');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mb-6">
            {!showForm ? (
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                    {editingNote ? 'Edit Note' : 'Add New Note'}
                </button>
            ) : (
                <div className="bg-gray-800/90 backdrop-blur-sm border border-gray-700 shadow rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4 text-white">
                        {editingNote ? 'Edit Note' : 'Create New Note'}
                    </h3>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-200 text-sm font-bold mb-2" htmlFor="title">
                                Title
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

                        <div className="mb-4">
                            <label className="block text-gray-200 text-sm font-bold mb-2" htmlFor="content">
                                Content
                            </label>
                            <textarea
                                id="content"
                                name="content"
                                value={formData.content}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                rows="6"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-200 text-sm font-bold mb-2" htmlFor="category">
                                Category
                            </label>
                            <input
                                id="category"
                                name="category"
                                type="text"
                                value={formData.category}
                                onChange={handleChange}
                                className={`shadow appearance-none border ${categoryError ? 'border-red-500' : ''} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                                placeholder="Start with a letter, not a number"
                            />
                            {categoryError && (
                                <p className="text-red-500 text-xs italic mt-1">{categoryError}</p>
                            )}
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-200 text-sm font-bold mb-2" htmlFor="user">
                                User
                            </label>
                            <select
                                id="user"
                                name="user"
                                value={formData.user}
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

                        <div className="flex items-center justify-between">
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                disabled={isSubmitting || categoryError !== ''}
                            >
                                {isSubmitting
                                    ? (editingNote ? 'Updating...' : 'Creating...')
                                    : (editingNote ? 'Update Note' : 'Create Note')}
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
            )}
        </div>
    );
};

export default NoteForm;
