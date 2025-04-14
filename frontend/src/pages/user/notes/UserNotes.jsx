import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../services/UseAuth';
import { 
  FaStickyNote, 
  FaSpinner, 
  FaPlus, 
  FaEdit, 
  FaTrashAlt, 
  FaTimes, 
  FaRedo 
} from 'react-icons/fa';
// No need for separate CSS file as we're using Tailwind

const UserNotes = () => {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const fetchUserNotes = React.useCallback(async () => {
    if (!user) {
      navigate('/auth/login');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/notes?userId=${user.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch notes');
      }
      const data = await response.json();
      setNotes(data);
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  }, [user, navigate]);

  useEffect(() => {
    fetchUserNotes();
  }, [fetchUserNotes]);

  const handleDeleteNote = async (noteId) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        // In a real application, this would be an API call to delete the note
        const response = await fetch(`http://localhost:3001/notes/${noteId}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete note');
        }
        
        // Remove the deleted note from the state
        setNotes(notes.filter(note => note.id !== noteId));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  // Function to format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Display loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div className="w-32 h-32 flex items-center justify-center">
            <FaStickyNote className="text-blue-500 text-5xl animate-pulse" />
          </div>
        </div>
        <p className="mt-4 text-xl font-medium text-blue-400">Loading Notes...</p>
      </div>
    );
  }

  // Display error state
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="bg-gradient-to-br from-red-800/50 to-red-900/50 backdrop-blur-md p-8 rounded-xl border border-red-500/20 shadow-lg max-w-md w-full">
          <div className="flex items-center text-red-400 mb-4">
            <FaTimes className="text-3xl mr-3" />
            <h2 className="text-xl font-bold">Error Loading Notes</h2>
          </div>
          <p className="text-gray-300 mb-6">{error}</p>
          <button 
            onClick={() => { setError(null); setIsLoading(true); fetchUserNotes(); }}
            className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center justify-center transition-colors"
          >
            <FaRedo className="mr-2" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Main content
  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 left-1/3 w-64 h-64 bg-blue-600/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-1/2 -right-32 w-64 h-64 bg-purple-600/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-1/4 w-64 h-64 bg-indigo-600/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          My Notes
        </h1>
        <p className="text-gray-400 mt-2">
          Create, manage, and organize your personal notes
        </p>
      </div>

      {/* Actions */}
      <div className="mb-6 flex justify-end">
        <button 
          onClick={() => navigate('/user/notes/create')}
          className="py-2 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg flex items-center justify-center transition-all shadow-lg hover:shadow-indigo-500/20"
        >
          <FaPlus className="mr-2" />
          Create New Note
        </button>
      </div>

      {/* Notes Grid */}
      {notes.length === 0 ? (
        <div className="flex flex-col items-center justify-center bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-12 text-center shadow-lg">
          <FaStickyNote className="text-6xl mb-4 text-blue-400/50" />
          <h3 className="text-xl font-medium text-white mb-2">No Notes Yet</h3>
          <p className="text-gray-400 mb-6">Create your first note to get started</p>
          <button 
            onClick={() => navigate('/user/notes/create')}
            className="py-2 px-6 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center transition-colors"
          >
            <FaPlus className="mr-2" />
            Create Your First Note
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note) => (
            <div 
              key={note.id} 
              className="group bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-white/10 rounded-xl overflow-hidden shadow-lg hover:shadow-indigo-500/10 hover:border-indigo-500/20 transition-all duration-300"
            >
              <div className="p-5">
                <h3 className="text-xl font-semibold text-white mb-2 line-clamp-2">{note.title}</h3>
                <p className="text-gray-300 mb-4 line-clamp-4">{note.content}</p>
                <div className="text-sm text-gray-400 mb-4">
                  Created: {formatDate(note.createdAt)}
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => navigate(`/user/notes/edit/${note.id}`)}
                    className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                    title="Edit Note"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Delete Note"
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {/* "Add New" Card */}
          <div 
            onClick={() => navigate('/user/notes/create')}
            className="cursor-pointer bg-white/5 border border-white/10 border-dashed rounded-xl flex items-center justify-center p-8 hover:bg-white/10 transition-all duration-300 group"
          >
            <div className="text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                <FaPlus className="text-2xl text-blue-400 group-hover:text-blue-300" />
              </div>
              <p className="text-gray-400 group-hover:text-gray-300">Add New Note</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserNotes;