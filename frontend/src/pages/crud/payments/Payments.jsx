import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import { 
    FaSearch, FaEdit, FaTrashAlt, FaFilePdf, FaFileDownload,
    FaPlus, FaCheck, FaTimes, FaInfoCircle, FaCreditCard,
    FaSpinner, FaRedo, FaSave, FaFilter, FaSort, FaMoneyBillWave
} from 'react-icons/fa';
import "./Payments.css";

const Payments = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [editingPayment, setEditingPayment] = useState(null);
    const [formData, setFormData] = useState({
        id: '',
        amount: '',
        description: '',
        name: '',
        email: '',
        method: '',
        date: '',
        user_id: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [pdfError, setPdfError] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });
    const [selectedPayments, setSelectedPayments] = useState([]);

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get("http://localhost:3000/api/payments");
            setPayments(response.data || []);
        } catch (error) {
            console.error("Failed to fetch payments:", error);
            setError("Failed to fetch payments. Please try again later.");
            setPayments([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // Filter and sort payments in a single operation
    const processedPayments = [...payments]
        // First filter
        .filter(payment => {
            const search = searchQuery.toLowerCase();
            return (
                (payment.name?.toLowerCase() || '').includes(search) ||
                (payment.email?.toLowerCase() || '').includes(search) ||
                (payment.method?.toLowerCase() || '').includes(search) ||
                (payment.amount?.toString() || '').includes(searchQuery) ||
                (payment.description?.toLowerCase() || '').includes(search)
            );
        })
        // Then sort
        .sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
        
    // For compatibility with existing code
    const filteredPayments = processedPayments;
    const sortedPayments = processedPayments;

    const handleEditClick = (payment) => {
        setEditingPayment(payment);
        setFormData({
            id: payment.id,
            user_id: payment.user_id || '',
            amount: payment.amount || '',
            description: payment.description || '',
            name: payment.name || '',
            email: payment.email || '',
            method: payment.method || '',
            date: payment.date ? payment.date.split('T')[0] : ''
        });
    };

    const handleUpdatePayment = async (e) => {
        if (e) e.preventDefault();
        
        setIsSubmitting(true);
        try {
            const response = await axios.put(`http://localhost:3000/api/payments/${editingPayment.id}`, formData);
            setPayments(payments.map(payment => 
                payment.id === editingPayment.id ? { ...payment, ...formData } : payment
            ));
            setEditingPayment(null);
        } catch (error) {
            console.error("Failed to update payment:", error);
            setError("Failed to update payment. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this payment?")) {
            try {
                await axios.delete(`http://localhost:3000/api/payments/${id}`);
                setPayments(payments.filter(payment => payment.id !== id));
            } catch (error) {
                console.error("Failed to delete payment:", error);
                setError("Failed to delete payment. Please try again.");
            }
        }
    };

    const generatePDF = (paymentsToExport, multiple = false) => {
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
    
            paymentsToExport.forEach((payment, index) => {
                if (index > 0) doc.addPage();
    
                // Header Section
                doc.setFontSize(16);
                doc.setFillColor(44, 62, 80);
                doc.rect(0, 0, doc.internal.pageSize.width, config.headerHeight, 'F');
                doc.setTextColor(255, 255, 255);
                doc.text(
                    multiple ? 'Payments Report' : 'Payment Receipt', 
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
                    { label: 'Payment ID', value: payment.id || 'N/A' },
                    { label: 'User ID', value: payment.user_id || 'N/A' },
                    { label: 'Name', value: payment.name || 'N/A' },
                    { label: 'Email', value: payment.email || 'N/A' },
                    { label: 'Amount', value: `$${parseFloat(payment.amount || 0).toFixed(2)}` },
                    { label: 'Method', value: payment.method || 'N/A' },
                    { label: 'Date', value: formatDate(payment.date) },
                    { label: 'Created At', value: formatDate(payment.created_at) },
                    { label: 'Description', value: payment.description || 'N/A' }
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
                    `Page ${index + 1} of ${paymentsToExport.length} • © ${new Date().getFullYear()} ITPM Project`, 
                    config.margin, 
                    doc.internal.pageSize.height - 10
                );
            });
    
            // Final Document Output
            doc.save(
                multiple 
                ? `Payments_Report_${new Date().toISOString().slice(0,10)}.pdf`
                : `Payment_${paymentsToExport[0].id || 'new'}_${paymentsToExport[0].name ? paymentsToExport[0].name.replace(/[^a-z0-9]/gi, '_') : 'unnamed'}.pdf`
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

    // Selection handling
    const toggleSelection = (id) => {
        setSelectedPayments(prev => 
            prev.includes(id) 
                ? prev.filter(paymentId => paymentId !== id)
                : [...prev, id]
        );
    };

    const selectAll = () => {
        setSelectedPayments(selectedPayments.length === filteredPayments.length 
            ? [] 
            : filteredPayments.map(payment => payment.id));
    };

    const EditModal = () => (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-xl shadow-2xl border border-white/10 max-w-2xl w-full animate-scale">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                        Edit Payment
                    </h3>
                    <button 
                        onClick={() => setEditingPayment(null)}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <FaTimes size={20} />
                    </button>
                </div>
                <form onSubmit={handleUpdatePayment}>
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-blue-300 mb-2">User ID</label>
                                <input
                                    type="number"
                                    name="user_id"
                                    value={formData.user_id}
                                    onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
                                    className="form-input"
                                    required
                                    min="1"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-blue-300 mb-2">Amount</label>
                                <input
                                    type="number"
                                    name="amount"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                    className="form-input"
                                    required
                                    step="0.01"
                                    min="0.01"
                                />
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-blue-300 mb-2">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="form-input"
                                    required
                                />
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-blue-300 mb-2">Method</label>
                                <select
                                    name="method"
                                    value={formData.method}
                                    onChange={(e) => setFormData({ ...formData, method: e.target.value })}
                                    className="form-input"
                                    required
                                >
                                    <option value="">Select Payment Method</option>
                                    <option value="Credit Card">Credit Card</option>
                                    <option value="Debit Card">Debit Card</option>
                                    <option value="PayPal">PayPal</option>
                                    <option value="Bank Transfer">Bank Transfer</option>
                                    <option value="Cash">Cash</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-blue-300 mb-2">Date</label>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    className="form-input"
                                    required
                                />
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-blue-300 mb-2">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="form-input min-h-[100px]"
                                placeholder="Payment description"
                            />
                        </div>
                    </div>
                    
                    <div className="mt-6 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={() => setEditingPayment(null)}
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
                        <FaMoneyBillWave className="text-blue-500 text-5xl animate-pulse" />
                    </div>
                </div>
                <p className="mt-4 text-xl font-medium text-blue-400">Loading Payments...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <div className="bg-gradient-to-br from-red-800/50 to-red-900/50 backdrop-blur-md p-8 rounded-xl border border-red-500/20 shadow-lg max-w-md w-full">
                    <div className="flex items-center text-red-400 mb-4">
                        <FaTimes className="text-3xl mr-3" />
                        <h2 className="text-xl font-bold">Error Loading Payments</h2>
                    </div>
                    <p className="text-gray-300 mb-6">{error}</p>
                    <button 
                        onClick={() => { setError(null); setLoading(true); fetchPayments(); }}
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
                <div className="absolute -top-32 left-1/3 w-64 h-64 bg-emerald-600/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
                <div className="absolute top-1/2 -right-32 w-64 h-64 bg-blue-600/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-32 left-1/4 w-64 h-64 bg-green-600/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
            </div>

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">
                    Payment Management
                </h1>
                <p className="text-gray-400 mt-2">
                    View, manage, and process payment transactions
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
                <div className="relative">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search payments..."
                        className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-transparent text-white w-full md:w-80"
                    />
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                    <button 
                        onClick={() => {
                            if (payments.length === 0) {
                                setPdfError("No payments available to export");
                                return;
                            }
                            
                            generatePDF(
                                selectedPayments.length > 0
                                    ? payments.filter(payment => selectedPayments.includes(payment.id))
                                    : [payments[0]],
                                selectedPayments.length > 1
                            )
                        }}
                        disabled={payments.length === 0}
                        className="btn-secondary flex items-center"
                    >
                        <FaFilePdf className="mr-1" />
                        Export {selectedPayments.length > 0 ? `(${selectedPayments.length})` : ''}
                    </button>
                    <button 
                        onClick={selectAll}
                        className="btn-secondary flex items-center"
                    >
                        <FaCheck className="mr-1" />
                        {selectedPayments.length === filteredPayments.length ? 'Deselect All' : 'Select All'}
                    </button>
                    <Link to="/payments/create" className="btn-primary flex items-center">
                        <FaPlus className="mr-1" />
                        New Payment
                    </Link>
                </div>
            </div>

            {/* Payments Table */}
            <div className="table-container">
                {filteredPayments.length > 0 ? (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-white">
                                <thead className="table-header">
                                    <tr>
                                        <th className="p-4">
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedPayments.length === filteredPayments.length && filteredPayments.length > 0}
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
                                            onClick={() => handleSort('name')}
                                        >
                                            <div className="flex items-center">
                                                Name
                                                <FaSort className="ml-1 text-gray-400" />
                                            </div>
                                        </th>
                                        <th 
                                            className="p-4 cursor-pointer hover:bg-white/5"
                                            onClick={() => handleSort('email')}
                                        >
                                            <div className="flex items-center">
                                                Email
                                                <FaSort className="ml-1 text-gray-400" />
                                            </div>
                                        </th>
                                        <th 
                                            className="p-4 cursor-pointer hover:bg-white/5"
                                            onClick={() => handleSort('amount')}
                                        >
                                            <div className="flex items-center">
                                                Amount
                                                <FaSort className="ml-1 text-gray-400" />
                                            </div>
                                        </th>
                                        <th 
                                            className="p-4 cursor-pointer hover:bg-white/5"
                                            onClick={() => handleSort('method')}
                                        >
                                            <div className="flex items-center">
                                                Method
                                                <FaSort className="ml-1 text-gray-400" />
                                            </div>
                                        </th>
                                        <th 
                                            className="p-4 cursor-pointer hover:bg-white/5"
                                            onClick={() => handleSort('date')}
                                        >
                                            <div className="flex items-center">
                                                Date
                                                <FaSort className="ml-1 text-gray-400" />
                                            </div>
                                        </th>
                                        <th className="p-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedPayments.map(payment => (
                                        <tr key={payment.id} className="table-row border-b border-white/10">
                                            <td className="p-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedPayments.includes(payment.id)}
                                                    onChange={() => toggleSelection(payment.id)}
                                                    className="w-4 h-4 accent-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500/40"
                                                />
                                            </td>
                                            <td className="p-4">{payment.id}</td>
                                            <td className="p-4">{payment.name || 'N/A'}</td>
                                            <td className="p-4">{payment.email || 'N/A'}</td>
                                            <td className="p-4 font-medium text-green-400">${parseFloat(payment.amount || 0).toFixed(2)}</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium 
                                                    ${payment.method === 'Credit Card' ? 'bg-blue-500/20 text-blue-300' : 
                                                    payment.method === 'PayPal' ? 'bg-indigo-500/20 text-indigo-300' : 
                                                    payment.method === 'Bank Transfer' ? 'bg-green-500/20 text-green-300' : 
                                                    payment.method === 'Cash' ? 'bg-yellow-500/20 text-yellow-300' : 
                                                    'bg-gray-500/20 text-gray-300'}`}
                                                >
                                                    {payment.method || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="p-4">{formatDateString(payment.date)}</td>
                                            <td className="p-4">
                                                <div className="flex space-x-1">
                                                    <button
                                                        onClick={() => handleEditClick(payment)}
                                                        className="icon-btn icon-info"
                                                        title="Edit"
                                                    >
                                                        <FaEdit />
                                                    </button>
                                                    <button
                                                        onClick={() => generatePDF([payment])}
                                                        className="icon-btn icon-success"
                                                        title="Download PDF"
                                                    >
                                                        <FaFileDownload />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(payment.id)}
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
                            Showing {filteredPayments.length} of {payments.length} payments
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                        <FaCreditCard className="text-5xl mb-4 opacity-30" />
                        <p className="text-xl mb-2">No payments found</p>
                        <p className="mb-6">{searchQuery ? 'Try adjusting your search terms' : 'Create your first payment to get started'}</p>
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

            {/* Modal */}
            {editingPayment && <EditModal />}
        </div>
    );
};

export default Payments;