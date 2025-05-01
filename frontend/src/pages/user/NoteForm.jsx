import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createNote, getNoteById, updateNote, scanNoteImage } from '../../services/api';
import UserLayout from '../../components/user/UserLayout';
import { useAuth } from '../../context/AuthContext';

const NoteForm = () => {
    const { id } = useParams();
    const isEditing = !!id;
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category: '',
    });
    const [loading, setLoading] = useState(isEditing);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);
    const [scanning, setScanning] = useState(false);
    const [scanError, setScanError] = useState(null);

    // --- Voice to Text (Web Speech API) ---
    const [isRecording, setIsRecording] = useState(false);
    const [voiceError, setVoiceError] = useState(null);
    const recognitionRef = useRef(null);

    const handleStartRecording = () => {
        setVoiceError(null);
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            setVoiceError('Speech recognition is not supported in this browser.');
            return;
        }
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setFormData(prev => ({ ...prev, content: prev.content + (prev.content ? '\n' : '') + transcript }));
        };
        recognition.onerror = (event) => {
            setVoiceError('Voice recognition error: ' + event.error);
            setIsRecording(false);
        };
        recognition.onend = () => {
            setIsRecording(false);
        };
        recognitionRef.current = recognition;
        recognition.start();
        setIsRecording(true);
    };

    const handleStopRecording = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
        setIsRecording(false);
    }; useEffect(() => {
        if (currentUser && (currentUser.id || currentUser._id)) {
            setUserId(currentUser.id || currentUser._id);
        } else {
            navigate('/login');
        }
    }, [currentUser, navigate]); 
    
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
            }
            // Check if user is authenticated
            if (!currentUser?.id) {
                throw new Error('You must be logged in to save a note');
            }            // Prepare data including the user ID (ObjectId string)
            const noteData = {
                title: formData.title,
                content: formData.content,
                category: formData.category,
                user: userId // userId is set from AuthContext
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

    // OCR image upload handler (optimized)
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file || scanning) return;
        setScanning(true);
        setScanError(null);
        try {
            const result = await scanNoteImage(file);
            if (result.success && result.text) {
                // Only append if not already present
                setFormData(prev => {
                    const alreadyIncluded = prev.content.includes(result.text.trim());
                    return alreadyIncluded
                        ? prev
                        : { ...prev, content: prev.content + (prev.content ? '\n' : '') + result.text };
                });
            } else {
                setScanError(result.message || 'Failed to extract text from image.');
            }
        } catch (err) {
            setScanError('OCR failed: ' + (err.message || 'Unknown error'));
        } finally {
            setScanning(false);
            // Reset file input for re-upload
            if (e.target) e.target.value = '';
        }
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

                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">Scan Note Image (OCR)</label>
                        <input type="file" accept="image/*" onChange={handleImageUpload} disabled={scanning} />
                        {scanning && <div className="text-blue-500 mt-2 animate-pulse">Scanning image...</div>}
                        {scanError && <div className="text-red-500 mt-2">{scanError}</div>}
                        {!scanError && !scanning && <div className="text-green-600 text-xs mt-1">You can scan a note image to extract text.</div>}
                        <div className="text-xs text-gray-500 mt-1">Extracted text will be appended to the Content field only if not already present.</div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">Voice to Text (Speech Recognition)</label>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={isRecording ? handleStopRecording : handleStartRecording}
                                className={`px-4 py-2 rounded text-white ${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
                                disabled={isRecording || scanning}
                            >
                                {isRecording ? 'Stop Recording' : 'Start Voice Input'}
                            </button>
                            {isRecording && <span className="text-red-500 animate-pulse">Listening...</span>}
                        </div>
                        {voiceError && <div className="text-red-500 mt-2">{voiceError}</div>}
                        <div className="text-xs text-gray-500 mt-1">Speak and your words will be added to the Content field.</div>
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
