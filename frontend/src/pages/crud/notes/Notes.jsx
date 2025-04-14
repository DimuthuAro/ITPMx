import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { 
    FaSearch, FaEdit, FaTrashAlt, FaFilePdf, FaFileDownload,
    FaPlus, FaCheck, FaTimes, FaInfoCircle, FaStickyNote,
    FaSpinner, FaRedo, FaSave, FaFilter, FaSort
} from 'react-icons/fa';

const Notes = () => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingNote, setEditingNote] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category: '',
        description: '',
        user_id: ''
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [searchColumn, setSearchColumn] = useState('all');
    const [selectedNotes, setSelectedNotes] = useState([]);
    const [validationErrors, setValidationErrors] = useState({});
    const [selectedDescription, setSelectedDescription] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });
    const [pdfError, setPdfError] = useState(null);

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get('http://localhost:3000/api/notes');
            setNotes(response.data || []);
        } catch (error) {
            console.error('Error fetching notes:', error);
            setError('Failed to fetch notes. Please try again later.');
            setNotes([]);
        } finally {
            setLoading(false);
        }
    };

    // Search functionality
    const filteredNotes = notes.filter(note => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        
        switch(searchColumn) {
            case 'id':
                return note.id?.toString().includes(query);
            case 'title':
                return note.title?.toLowerCase().includes(query);
            case 'category':
                return note.category?.toLowerCase().includes(query);
            case 'description':
                return note.description?.toLowerCase().includes(query);
            case 'user_id':
                return note.user_id?.toString().includes(query);
            default:
                return note.id?.toString().includes(query) ||
                    note.title?.toLowerCase().includes(query) ||
                    note.category?.toLowerCase().includes(query) ||
                    note.description?.toLowerCase().includes(query) ||
                    note.user_id?.toString().includes(query);
        }
    });

    // Sorting
    const sortedNotes = [...filteredNotes].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
    });

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // Modified PDF Generation with better error handling
    const generatePDF = (notesToExport, multiple = false) => {
        try {
            setPdfError(null);
            const doc = new jsPDF();
            
            // Document Configuration
            const config = {
                margin: 15,
                headerHeight: 20,
                lineHeight: 7,
                pagePadding: 25,
                primaryColor: '#2c3e50',
                secondaryColor: '#7f8c8d',
                font: 'helvetica',
                watermark: 'Confidential'
            };
    
            // Add document watermark
            doc.setFillColor(230, 230, 230);
            doc.setFontSize(60);
            doc.setTextColor(230, 230, 230);
            doc.text(config.watermark, 40, 140, { angle: 45 });
    
            // Reset text settings
            doc.setTextColor(config.primaryColor);
            doc.setFont(config.font);
    
            notesToExport.forEach((note, index) => {
                if (index > 0) doc.addPage();
    
                // Header Section
                doc.setFontSize(16);
                doc.setFillColor(44, 62, 80);
                doc.rect(0, 0, doc.internal.pageSize.width, config.headerHeight, 'F');
                doc.setTextColor(255, 255, 255);
                doc.text(
                    multiple ? 'Professional Notes Report' : 'Note Details Document', 
                    config.margin, 
                    12
                );
    
                // Reset text color for content
                doc.setTextColor(config.primaryColor);
    
                // Document Metadata
                doc.setFontSize(10);
                doc.text(`Generated: ${new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })}`, 160, 10);
    
                // Content Section
                let yPosition = config.margin + config.headerHeight;
                
                const fields = [
                    { label: 'Document ID', value: note.id || 'N/A' },
                    { label: 'Title', value: note.title || 'N/A' },
                    { label: 'Category', value: note.category || 'N/A' },
                    { label: 'Description', value: note.description || 'N/A' },
                    { label: 'Associated User ID', value: note.user_id || 'N/A' },
                    { label: 'Creation Date', value: note.created_at ? new Date(note.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    }) : 'N/A' }
                ];
    
                // Use autoTable for better formatting
                const tableRows = fields.map(field => [field.label + ':', field.value.toString()]);
                
                doc.autoTable({
                    startY: yPosition,
                    head: [],
                    body: tableRows,
                    theme: 'plain',
                    styles: {
                        fontSize: 12,
                        cellPadding: 4,
                    },
                    columnStyles: {
                        0: { cellWidth: 50, fontStyle: 'bold' },
                        1: { cellWidth: 'auto' },
                    },
                    margin: { left: config.margin }
                });
    
                // Footer Section
                doc.setFontSize(10);
                doc.setTextColor(config.secondaryColor);
                doc.text(
                    `Page ${index + 1} of ${notesToExport.length} • © ${new Date().getFullYear()} ITPM Project`, 
                    config.margin, 
                    doc.internal.pageSize.height - 10
                );
            });
    
            // Final Document Output
            doc.save(
                multiple 
                ? `Notes_Report_${new Date().toISOString().slice(0,10)}.pdf`
                : `Note_${notesToExport[0].id || 'new'}_${notesToExport[0].title ? notesToExport[0].title.replace(/[^a-z0-9]/gi, '_') : 'untitled'}.pdf`
            );
    
        } catch (error) {
            console.error('PDF Generation Error:', error);
            setPdfError('Failed to generate document. Please check that all data is valid.');
        }
    };

    // Validation
    const validateForm = () => {
        const errors = {};
        if (!formData.title) errors.title = 'Title is required';
        if (!formData.content) errors.content = 'Content is required';
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleUpdateNote = async () => {
        if (!validateForm()) return;
        
        setIsSubmitting(true);
        try {
            const response = await axios.put(
                `http://localhost:3000/api/notes/${editingNote.id}`,
                formData
            );
            setNotes(notes.map(note => 
                note.id === editingNote.id ? response.data : note
            ));
            setEditingNote(null);
        } catch (error) {
            console.error('Error updating note:', error);
            setError('Failed to update note. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this note?')) {
            try {
                await axios.delete(`http://localhost:3000/api/notes/${id}`);
                setNotes(notes.filter(note => note.id !== id));
            } catch (error) {
                setError('Failed to delete note. Please try again.');
            }
        }
    };

    // Selection handling
    const toggleSelection = (id) => {
        setSelectedNotes(prev => 
            prev.includes(id) 
                ? prev.filter(noteId => noteId !== id)
                : [...prev, id]
        );
    };

    const handleEditClick = (note) => {
        setFormData({
            title: note.title || '',
            content: note.content || '',
            category: note.category || '',
            description: note.description || '',
            user_id: note.user_id || ''
        });
        setEditingNote(note);
    };

    const selectAll = () => {
        setSelectedNotes(selectedNotes.length === filteredNotes.length 
            ? [] 
            : filteredNotes.map(note => note.id));
    };

    // Helper functions
    const truncateText = (text, maxLength = 50) => {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    const isTextOverflowing = (text, maxWidth = 200) => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        context.font = '14px sans-serif';  // Match the CSS font of your content
        return context.measureText(text || '').width > maxWidth;
    };

    const DescriptionModal = ({ description, onClose }) => {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-xl shadow-2xl border border-white/10 max-w-2xl w-full animate-scale">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-white">Note Description</h3>
                        <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                            <FaTimes size={20} />
                        </button>
                    </div>
                    <div className="max-h-96 overflow-y-auto p-4 bg-white/5 rounded-lg">
                        <p className="text-gray-200 whitespace-pre-wrap">{description}</p>
                    </div>
                    <div className="mt-6 flex justify-end">
                        <button 
                            onClick={onClose}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const EditModal = () => (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-xl shadow-2xl border border-white/10 max-w-2xl w-full animate-scale">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                        Edit Note
                    </h3>
                    <button 
                        onClick={() => setEditingNote(null)}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <FaTimes size={20} />
                    </button>
                </div>
                <form onSubmit={(e) => { e.preventDefault(); handleUpdateNote(); }}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-blue-300 mb-2">Title</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                                className="form-input"
                                placeholder="Note Title"
                            />
                            {validationErrors.title && (
                                <p className="form-error">{validationErrors.title}</p>
                            )}
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-blue-300 mb-2">Content</label>
                            <textarea
                                value={formData.content}
                                onChange={(e) => setFormData({...formData, content: e.target.value})}
                                className="form-input min-h-[120px]"
                                placeholder="Note Content"
                            />
                            {validationErrors.content && (
                                <p className="form-error">{validationErrors.content}</p>
                            )}
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-blue-300 mb-2">Category</label>
                            <input
                                type="text"
                                value={formData.category}
                                onChange={(e) => setFormData({...formData, category: e.target.value})}
                                className="form-input"
                                placeholder="Note Category"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-blue-300 mb-2">Description</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                className="form-input min-h-[100px]"
                                placeholder="Note Description"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-blue-300 mb-2">User ID</label>
                            <input
                                type="text"
                                value={formData.user_id}
                                onChange={(e) => setFormData({...formData, user_id: e.target.value})}
                                className="form-input"
                                placeholder="Associated User ID"
                            />
                        </div>
                    </div>
                    
                    <div className="mt-6 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={() => setEditingNote(null)}
                            className="btn-secondary"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn-primary flex items-center justify-center min-w-[100px]"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <FaSpinner className="animate-spin mr-2" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <FaSave className="mr-2" />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

    if (loading) {
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
                        onClick={() => { setError(null); setLoading(true); fetchNotes(); }}
                        className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center justify-center transition-colors"
                    >
                        <FaRedo className="mr-2" />
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-32 left-1/3 w-64 h-64 bg-purple-600/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
                <div className="absolute top-1/2 -right-32 w-64 h-64 bg-blue-600/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-32 left-1/4 w-64 h-64 bg-indigo-600/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
            </div>

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                    Notes Management
                </h1>
                <p className="text-gray-400 mt-2">
                    Create, organize, and manage your professional notes
                </p>
            </div>

            {/* PDF Error Message */}
            {pdfError && (
                <div className="mb-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200">
                    <div className="flex items-start">
                        <FaTimes className="text-red-400 mt-1 mr-2" />
                        <div>
                            <p className="font-medium">PDF Generation Error</p>
                            <p className="text-sm mt-1">{pdfError}</p>
                        </div>
                        <button 
                            onClick={() => setPdfError(null)}
                            className="ml-auto text-red-400 hover:text-red-300"
                        >
                            <FaTimes />
                        </button>
                    </div>
                </div>
            )}

            {/* Controls */}
            <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
                {/* Search */}
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <div className="relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search notes..."
                            className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-transparent text-white"
                        />
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                    <select
                        value={searchColumn}
                        onChange={(e) => setSearchColumn(e.target.value)}
                        className="py-2 px-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-transparent text-white"
                    >
                        <option value="all">All Fields</option>
                        <option value="id">ID</option>
                        <option value="title">Title</option>
                        <option value="category">Category</option>
                        <option value="description">Description</option>
                        <option value="user_id">User ID</option>
                    </select>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                    <button 
                        onClick={() => {
                            if (notes.length === 0) {
                                setPdfError("No notes available to export");
                                return;
                            }
                            
                            generatePDF(
                                selectedNotes.length > 0
                                    ? notes.filter(note => selectedNotes.includes(note.id))
                                    : [notes[0]],
                                selectedNotes.length > 1
                            )
                        }}
                        disabled={notes.length === 0}
                        className="btn-secondary flex items-center"
                    >
                        <FaFilePdf className="mr-1" />
                        Export {selectedNotes.length > 0 ? `(${selectedNotes.length})` : ''}
                    </button>
                    <button 
                        onClick={selectAll}
                        className="btn-secondary flex items-center"
                    >
                        <FaCheck className="mr-1" />
                        {selectedNotes.length === filteredNotes.length ? 'Deselect All' : 'Select All'}
                    </button>
                    <Link to="/notes/create" className="btn-primary flex items-center">
                        <FaPlus className="mr-1" />
                        New Note
                    </Link>
                </div>
            </div>

            {/* Notes Table */}
            <div className="table-container">
                {filteredNotes.length > 0 ? (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-white">
                                <thead className="table-header">
                                    <tr>
                                        <th className="p-4">
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedNotes.length === filteredNotes.length && filteredNotes.length > 0}
                                                    onChange={selectAll}
                                                    className="w-4 h-4 accent-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500/40"
                                                />
                                            </div>
                                        </th>
                                        <th 
                                            className="p-4 cursor-pointer hover:bg-white/5"
                                            onClick={() => handleSort('id')}
                                        >
                                            <div className="flex items-center">
                                                ID 
                                                <FaSort className="ml-1 text-gray-400" />
                                            </div>
                                        </th>
                                        <th 
                                            className="p-4 cursor-pointer hover:bg-white/5"
                                            onClick={() => handleSort('title')}
                                        >
                                            <div className="flex items-center">
                                                Title
                                                <FaSort className="ml-1 text-gray-400" />
                                            </div>
                                        </th>
                                        <th 
                                            className="p-4 cursor-pointer hover:bg-white/5"
                                            onClick={() => handleSort('category')}
                                        >
                                            <div className="flex items-center">
                                                Category
                                                <FaSort className="ml-1 text-gray-400" />
                                            </div>
                                        </th>
                                        <th className="p-4">Description</th>
                                        <th 
                                            className="p-4 cursor-pointer hover:bg-white/5"
                                            onClick={() => handleSort('user_id')}
                                        >
                                            <div className="flex items-center">
                                                User ID
                                                <FaSort className="ml-1 text-gray-400" />
                                            </div>
                                        </th>
                                        <th className="p-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedNotes.map(note => (
                                        <tr key={note.id} className="table-row border-b border-white/10">
                                            <td className="p-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedNotes.includes(note.id)}
                                                    onChange={() => toggleSelection(note.id)}
                                                    className="w-4 h-4 accent-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500/40"
                                                />
                                            </td>
                                            <td className="p-4">{note.id}</td>
                                            <td className="p-4">{note.title}</td>
                                            <td className="p-4">{note.category || 'N/A'}</td>
                                            <td className="p-4">
                                                <div className="max-w-[200px] overflow-hidden text-ellipsis">
                                                    {truncateText(note.description)}
                                                    {note.description && note.description.length > 50 && (
                                                        <button
                                                            onClick={() => setSelectedDescription(note.description)}
                                                            className="ml-1 text-blue-400 hover:text-blue-300"
                                                        >
                                                            <FaInfoCircle />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-4">{note.user_id}</td>
                                            <td className="p-4">
                                                <div className="flex space-x-1">
                                                    <button
                                                        onClick={() => handleEditClick(note)}
                                                        className="icon-btn icon-info"
                                                        title="Edit"
                                                    >
                                                        <FaEdit />
                                                    </button>
                                                    <button
                                                        onClick={() => generatePDF([note])}
                                                        className="icon-btn icon-success"
                                                        title="Download PDF"
                                                    >
                                                        <FaFileDownload />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(note.id)}
                                                        className="icon-btn icon-danger"
                                                        title="Delete"
                                                    >
                                                        <FaTrashAlt />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="p-4 border-t border-white/10 text-right text-gray-400">
                            Showing {filteredNotes.length} of {notes.length} notes
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                        <FaStickyNote className="text-5xl mb-4 opacity-30" />
                        <p className="text-xl mb-2">No notes found</p>
                        <p className="mb-6">{searchQuery ? 'Try adjusting your search terms' : 'Create your first note to get started'}</p>
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="btn-secondary flex items-center"
                            >
                                <FaTimes className="mr-1" />
                                Clear Search
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Modals */}
            {selectedDescription && (
                <DescriptionModal 
                    description={selectedDescription} 
                    onClose={() => setSelectedDescription(null)} 
                />
            )}
            {editingNote && <EditModal />}
        </div>
    );
};

export default Notes;