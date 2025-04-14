import { useState, useEffect } from 'react';
import axios from 'axios';
import './tickets.css';
// Fix the imports to properly initialize jsPDF with AutoTable
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Link } from 'react-router-dom';
import { 
    FaSearch, FaEdit, FaTrashAlt, FaFilePdf, FaFileDownload,
    FaPlus, FaCheck, FaTimes, FaInfoCircle, FaTicketAlt,
    FaSpinner, FaRedo, FaSave, FaFilter, FaSort, FaExclamationTriangle,
    FaExclamationCircle, FaCheckCircle, FaQuestionCircle, FaList
} from 'react-icons/fa';

const Tickets = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingTicket, setEditingTicket] = useState(null);
    const [formData, setFormData] = useState({ user_id: '' , name: '', email:'' , title: '', description: '', issue_type: '',priority:'' });
    const [searchTerm, setSearchTerm] = useState('');
    const [pdfError, setPdfError] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });
    const [selectedTickets, setSelectedTickets] = useState([]);
    const [activeTab, setActiveTab] = useState('all');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Priority options
    const priorities = [
        { value: "Low", color: "text-green-300 bg-green-500/20" },
        { value: "Medium", color: "text-yellow-300 bg-yellow-500/20" },
        { value: "High", color: "text-orange-300 bg-orange-500/20" },
        { value: "Critical", color: "text-red-300 bg-red-500/20" }
    ];

    // Status options
    const statuses = [
        { value: "Open", color: "text-blue-300 bg-blue-500/20", icon: <FaExclamationCircle className="mr-1" /> },
        { value: "In Progress", color: "text-indigo-300 bg-indigo-500/20", icon: <FaSpinner className="mr-1" /> },
        { value: "Resolved", color: "text-green-300 bg-green-500/20", icon: <FaCheckCircle className="mr-1" /> },
        { value: "Closed", color: "text-gray-300 bg-gray-500/20", icon: <FaTimes className="mr-1" /> }
    ];

    // Issue types
    const issueTypes = [
        { value: "Bug", color: "text-red-300 bg-red-500/20" },
        { value: "Feature", color: "text-blue-300 bg-blue-500/20" },
        { value: "Support", color: "text-violet-300 bg-violet-500/20" },
        { value: "Question", color: "text-cyan-300 bg-cyan-500/20" },
        { value: "Other", color: "text-gray-300 bg-gray-500/20" }
    ];

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get('http://localhost:3000/api/tickets');
            setTickets(response.data || []);
        } catch (error) {
            console.error("Failed to fetch tickets:", error);
            setError('Failed to fetch tickets. Please try again later.');
            setTickets([]);
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (ticket) => {
        setEditingTicket(ticket);
        setFormData({
            id: ticket.id,
            user_id: ticket.user_id || '',
            title: ticket.title || '',
            description: ticket.description || '',
            name: ticket.name || '',
            email: ticket.email || '',
            issue_type: ticket.issue_type || '',
            priority: ticket.priority || '',
            status: ticket.status || ''
        });
    };

    const handleUpdateTicket = async (e) => {
        if (e) e.preventDefault();
        
        setIsSubmitting(true);
        try {
            const response = await axios.put(`http://localhost:3000/api/tickets/${editingTicket.id}`, formData);
            setTickets(tickets.map(ticket => 
                ticket.id === editingTicket.id ? { ...ticket, ...formData } : ticket
            ));
            setEditingTicket(null);
        } catch (error) {
            console.error("Failed to update ticket:", error);
            setError("Failed to update ticket. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this ticket?')) {
            try {
                await axios.delete(`http://localhost:3000/api/tickets/${id}`);
                setTickets(tickets.filter(ticket => ticket.id !== id));
            } catch (error) {
                console.error("Failed to delete ticket:", error);
                setError("Failed to delete ticket. Please try again.");
            }
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    // Filter tickets based on search query and active tab
    const filteredTickets = tickets.filter(ticket => {
        // Filter by tab first
        if (activeTab !== 'all' && ticket.status !== activeTab) {
            return false;
        }
        
        // Then filter by search query
        const search = searchTerm.toLowerCase();
        return (
            (ticket.name?.toLowerCase() || '').includes(search) ||
            (ticket.email?.toLowerCase() || '').includes(search) ||
            (ticket.title?.toLowerCase() || '').includes(search) ||
            (ticket.description?.toLowerCase() || '').includes(search) ||
            (ticket.issue_type?.toLowerCase() || '').includes(search) ||
            (ticket.priority?.toLowerCase() || '').includes(search) ||
            (ticket.status?.toLowerCase() || '').includes(search)
        );
    });

    const generatePDF = (ticketsToExport, multiple = false) => {
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
    
            ticketsToExport.forEach((ticket, index) => {
                if (index > 0) doc.addPage();
    
                // Header Section
                doc.setFontSize(16);
                doc.setFillColor(44, 62, 80);
                doc.rect(0, 0, doc.internal.pageSize.width, config.headerHeight, 'F');
                doc.setTextColor(255, 255, 255);
                doc.text(
                    multiple ? 'Support Tickets Report' : 'Support Ticket', 
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
                
                const formatDate = (dateString) => 
                    dateString ? new Date(dateString).toLocaleDateString() : 'N/A';
                
                const fields = [
                    { label: 'Ticket ID', value: ticket.id || 'N/A' },
                    { label: 'User ID', value: ticket.user_id || 'N/A' },
                    { label: 'Name', value: ticket.name || 'N/A' },
                    { label: 'Email', value: ticket.email || 'N/A' },
                    { label: 'Title', value: ticket.title || 'N/A' },
                    { label: 'Status', value: ticket.status || 'N/A' },
                    { label: 'Priority', value: ticket.priority || 'N/A' },
                    { label: 'Issue Type', value: ticket.issue_type || 'N/A' },
                    { label: 'Created At', value: formatDate(ticket.created_at) },
                    { label: 'Description', value: ticket.description || 'N/A' }
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
                    `Page ${index + 1} of ${ticketsToExport.length} • © ${new Date().getFullYear()} ITPM Project`, 
                    config.margin, 
                    doc.internal.pageSize.height - 10
                );
            });
    
            // Final Document Output
            doc.save(
                multiple 
                ? `Tickets_Report_${new Date().toISOString().slice(0,10)}.pdf`
                : `Ticket_${ticketsToExport[0].id || 'new'}_${ticketsToExport[0].title ? ticketsToExport[0].title.replace(/[^a-z0-9]/gi, '_').substring(0, 20) : 'untitled'}.pdf`
            );
    
        } catch (error) {
            console.error('PDF Generation Error:', error);
            setPdfError('Failed to generate document. Please check that all data is valid.');
        }
    };

    const formatDateString = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return isNaN(date) ? 'Invalid Date' : date.toLocaleDateString();
    };

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // Selection handling
    const toggleSelection = (id) => {
        setSelectedTickets(prev => 
            prev.includes(id) 
                ? prev.filter(ticketId => ticketId !== id)
                : [...prev, id]
        );
    };

    const selectAll = () => {
        setSelectedTickets(selectedTickets.length === filteredTickets.length 
            ? [] 
            : filteredTickets.map(ticket => ticket.id));
    };

    // Sort tickets
    const sortedTickets = [...filteredTickets].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
    });

    // Get status UI
    const getStatusUI = (status) => {
        const statusObj = statuses.find(s => s.value === status) || statuses[0];
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center ${statusObj.color}`}>
                {statusObj.icon}
                {status || 'N/A'}
            </span>
        );
    };

    // Get priority UI
    const getPriorityUI = (priority) => {
        const priorityObj = priorities.find(p => p.value === priority) || { value: 'N/A', color: 'text-gray-300 bg-gray-500/20' };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityObj.color}`}>
                {priority || 'N/A'}
            </span>
        );
    };

    // Get issue type UI
    const getIssueTypeUI = (type) => {
        const typeObj = issueTypes.find(t => t.value === type) || { value: 'N/A', color: 'text-gray-300 bg-gray-500/20' };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeObj.color}`}>
                {type || 'N/A'}
            </span>
        );
    };

    const EditModal = () => (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-xl shadow-2xl border border-white/10 max-w-2xl w-full animate-scale">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                        Edit Ticket
                    </h3>
                    <button 
                        onClick={() => setEditingTicket(null)}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <FaTimes size={20} />
                    </button>
                </div>
                <form onSubmit={handleUpdateTicket}>
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-blue-300 mb-2">User ID</label>
                                <input
                                    type="number"
                                    name="user_id"
                                    value={formData.user_id}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    required
                                    min="1"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-blue-300 mb-2">Status</label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className="form-input"
                                    required
                                >
                                    <option value="">Select Status</option>
                                    {statuses.map(status => (
                                        <option key={status.value} value={status.value}>{status.value}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-blue-300 mb-2">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-blue-300 mb-2">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    required
                                />
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-blue-300 mb-2">Priority</label>
                                <select
                                    name="priority"
                                    value={formData.priority}
                                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                    className="form-input"
                                    required
                                >
                                    <option value="">Select Priority</option>
                                    {priorities.map(priority => (
                                        <option key={priority.value} value={priority.value}>{priority.value}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-blue-300 mb-2">Issue Type</label>
                                <select
                                    name="issue_type"
                                    value={formData.issue_type}
                                    onChange={(e) => setFormData({ ...formData, issue_type: e.target.value })}
                                    className="form-input"
                                    required
                                >
                                    <option value="">Select Issue Type</option>
                                    {issueTypes.map(type => (
                                        <option key={type.value} value={type.value}>{type.value}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-blue-300 mb-2">Title</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                className="form-input"
                                required
                                placeholder="Ticket title"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-blue-300 mb-2">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                className="form-input min-h-[100px]"
                                placeholder="Ticket description"
                                required
                            />
                        </div>
                    </div>
                    
                    <div className="mt-6 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={() => setEditingTicket(null)}
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

    if (loading) return <div className="loading-spinner"></div>;

    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-32 left-1/3 w-64 h-64 bg-purple-600/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
                <div className="absolute top-1/2 -right-32 w-64 h-64 bg-indigo-600/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-32 left-1/4 w-64 h-64 bg-blue-600/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
            </div>

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
                    Support Ticket Management
                </h1>
                <p className="text-gray-400 mt-2">
                    View, manage, and process customer support tickets
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

            {/* Status Tabs */}
            <div className="mb-6 overflow-x-auto">
                <div className="flex space-x-2 border-b border-white/10 pb-2">
                    <button 
                        onClick={() => setActiveTab('all')} 
                        className={`px-4 py-2 rounded-t-lg font-medium flex items-center ${
                            activeTab === 'all' 
                            ? 'bg-white/10 text-white border-b-2 border-purple-500' 
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <FaList className="mr-2" />
                        All Tickets
                    </button>
                    {statuses.map(status => (
                        <button 
                            key={status.value}
                            onClick={() => setActiveTab(status.value)} 
                            className={`px-4 py-2 rounded-t-lg font-medium flex items-center ${
                                activeTab === status.value 
                                ? 'bg-white/10 text-white border-b-2 border-purple-500' 
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            {status.icon}
                            {status.value}
                        </button>
                    ))}
                </div>
            </div>

            {/* Controls */}
            <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
                {/* Search */}
                <div className="relative">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearch}
                        placeholder="Search tickets..."
                        className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-transparent text-white w-full md:w-80"
                    />
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                    <button 
                        onClick={() => {
                            if (tickets.length === 0) {
                                setPdfError("No tickets available to export");
                                return;
                            }
                            
                            generatePDF(
                                selectedTickets.length > 0
                                    ? tickets.filter(ticket => selectedTickets.includes(ticket.id))
                                    : [tickets[0]],
                                selectedTickets.length > 1
                            )
                        }}
                        disabled={tickets.length === 0}
                        className="btn-secondary flex items-center"
                    >
                        <FaFilePdf className="mr-1" />
                        Export {selectedTickets.length > 0 ? `(${selectedTickets.length})` : ''}
                    </button>
                    <button 
                        onClick={selectAll}
                        className="btn-secondary flex items-center"
                    >
                        <FaCheck className="mr-1" />
                        {selectedTickets.length === filteredTickets.length && filteredTickets.length > 0 ? 'Deselect All' : 'Select All'}
                    </button>
                    <Link to="/tickets/create" className="btn-primary flex items-center">
                        <FaPlus className="mr-1" />
                        New Ticket
                    </Link>
                </div>
            </div>

            {/* Tickets Table */}
            <div className="table-container">
                {filteredTickets.length > 0 ? (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-white">
                                <thead className="table-header">
                                    <tr>
                                        <th className="p-4">
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedTickets.length === filteredTickets.length && filteredTickets.length > 0}
                                                    onChange={selectAll}
                                                    className="w-4 h-4 accent-purple-600 bg-white/10 border-white/20 rounded focus:ring-purple-500/40"
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
                                            onClick={() => handleSort('name')}
                                        >
                                            <div className="flex items-center">
                                                Submitted By
                                                <FaSort className="ml-1 text-gray-400" />
                                            </div>
                                        </th>
                                        <th 
                                            className="p-4 cursor-pointer hover:bg-white/5"
                                            onClick={() => handleSort('status')}
                                        >
                                            <div className="flex items-center">
                                                Status
                                                <FaSort className="ml-1 text-gray-400" />
                                            </div>
                                        </th>
                                        <th 
                                            className="p-4 cursor-pointer hover:bg-white/5"
                                            onClick={() => handleSort('priority')}
                                        >
                                            <div className="flex items-center">
                                                Priority
                                                <FaSort className="ml-1 text-gray-400" />
                                            </div>
                                        </th>
                                        <th 
                                            className="p-4 cursor-pointer hover:bg-white/5"
                                            onClick={() => handleSort('issue_type')}
                                        >
                                            <div className="flex items-center">
                                                Issue Type
                                                <FaSort className="ml-1 text-gray-400" />
                                            </div>
                                        </th>
                                        <th className="p-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedTickets.map(ticket => (
                                        <tr key={ticket.id} className="table-row border-b border-white/10">
                                            <td className="p-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedTickets.includes(ticket.id)}
                                                    onChange={() => toggleSelection(ticket.id)}
                                                    className="w-4 h-4 accent-purple-600 bg-white/10 border-white/20 rounded focus:ring-purple-500/40"
                                                />
                                            </td>
                                            <td className="p-4">{ticket.id}</td>
                                            <td className="p-4">
                                                <div className="font-medium">{ticket.title || 'N/A'}</div>
                                                <div className="text-xs text-gray-400 truncate max-w-[200px]">{ticket.description || 'No description'}</div>
                                            </td>
                                            <td className="p-4">
                                                <div>{ticket.name || 'N/A'}</div>
                                                <div className="text-xs text-gray-400">{ticket.email || 'N/A'}</div>
                                            </td>
                                            <td className="p-4">
                                                {getStatusUI(ticket.status)}
                                            </td>
                                            <td className="p-4">
                                                {getPriorityUI(ticket.priority)}
                                            </td>
                                            <td className="p-4">
                                                {getIssueTypeUI(ticket.issue_type)}
                                            </td>
                                            <td className="p-4">
                                                <div className="flex space-x-1">
                                                    <button
                                                        onClick={() => handleEditClick(ticket)}
                                                        className="icon-btn icon-info"
                                                        title="Edit"
                                                    >
                                                        <FaEdit />
                                                    </button>
                                                    <button
                                                        onClick={() => generatePDF([ticket])}
                                                        className="icon-btn icon-success"
                                                        title="Download PDF"
                                                    >
                                                        <FaFileDownload />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(ticket.id)}
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
                            Showing {filteredTickets.length} of {tickets.length} tickets
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                        <FaTicketAlt className="text-5xl mb-4 opacity-30" />
                        <p className="text-xl mb-2">No tickets found</p>
                        <p className="mb-6">
                            {searchTerm 
                                ? 'Try adjusting your search terms or filter criteria' 
                                : activeTab !== 'all' 
                                    ? `No ${activeTab} tickets found`
                                    : 'Create your first ticket to get started'
                            }
                        </p>
                        {(searchTerm || activeTab !== 'all') && (
                            <div className="flex space-x-2">
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        className="btn-secondary flex items-center"
                                    >
                                        <FaTimes className="mr-1" />
                                        Clear Search
                                    </button>
                                )}
                                {activeTab !== 'all' && (
                                    <button
                                        onClick={() => setActiveTab('all')}
                                        className="btn-secondary flex items-center"
                                    >
                                        <FaList className="mr-1" />
                                        Show All Tickets
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Modal */}
            {editingTicket && <EditModal />}
        </div>
    );
};

export default Tickets;