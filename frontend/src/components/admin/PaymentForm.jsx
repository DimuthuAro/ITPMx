import { useState, useEffect } from 'react';
import { updatePayment, getUsers } from '../../services/api';

const PaymentForm = ({ onPaymentUpdated, editingPayment, setEditingPayment }) => {
    // If there's no payment being edited, don't render the form
    if (!editingPayment) return null;

    const [users, setUsers] = useState([]);
    const initialFormState = {
        user: '',
        name: '',
        amount: '',
        payment_method: 'credit_card',
        status: 'pending',
        description: '',
        card_name: '',
        card_number: '',
        cvv: '',
        expire_date: ''
    };

    const [formData, setFormData] = useState(initialFormState);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

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

    // Set form data when editing payment changes
    useEffect(() => {
        if (editingPayment) {
            setFormData({
                user: editingPayment.user?._id || editingPayment.user || '',
                name: editingPayment.name || '',
                amount: editingPayment.amount || '',
                payment_method: editingPayment.payment_method || 'credit_card',
                status: editingPayment.status || 'pending',
                description: editingPayment.description || '',
                card_name: editingPayment.card_name || '',
                card_number: editingPayment.card_number || '',
                cvv: editingPayment.cvv || '',
                expire_date: editingPayment.expire_date || ''
            });
        }
    }, [editingPayment]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'amount' ? parseFloat(value) || '' : value
        }));
    };

    const resetForm = () => {
        setFormData(initialFormState);
        setEditingPayment && setEditingPayment(null);
        setError(null);
    };

    const handleCancel = () => {
        resetForm();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            if (editingPayment) {
                // Create a copy of the form data to send to the API
                const paymentDataToUpdate = { ...formData };
                
                // Make sure we're sending the user ID, not the entire user object
                if (paymentDataToUpdate.user && typeof paymentDataToUpdate.user === 'object') {
                    paymentDataToUpdate.user = paymentDataToUpdate.user._id;
                }
                
                await updatePayment(editingPayment._id, paymentDataToUpdate);
                
                // For the UI update, preserve the full user object from the original payment
                // to prevent the "Unknown" display issue
                const updatedPayment = {
                    ...editingPayment,
                    ...formData,
                    user: editingPayment.user // Keep the original user object intact
                };
                
                onPaymentUpdated(updatedPayment);
                setEditingPayment(null);
            }
            resetForm();
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred while updating the payment');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mb-6">
            <div className="bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm border border-gray-700/50 shadow-lg">
                <h3 className="text-xl font-semibold text-white mb-6">
                    Edit Payment Details
                </h3>

                {error && (
                    <div className="bg-red-900/40 border-l-4 border-red-500 text-red-100 p-4 rounded-lg backdrop-blur-sm mb-6" role="alert">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-300 font-medium mb-2" htmlFor="user">
                                User *
                            </label>
                            <select
                                disabled
                                value={formData.user}
                                onChange={handleChange}
                                className="w-full bg-gray-900/80 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Select a user</option>
                                {users.map(user => (
                                    <option key={user._id} value={user._id}>
                                        {user.username} ({user.email})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-gray-300 font-medium mb-2" htmlFor="name">
                                Customer Name *
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full bg-gray-900/80 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-300 font-medium mb-2" htmlFor="amount">
                                Amount *
                            </label>
                            <input
                                id="amount"
                                name="amount"
                                type="number"
                                step="0.01"
                                value={formData.amount}
                                onChange={handleChange}
                                className="w-full bg-gray-900/80 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-300 font-medium mb-2" htmlFor="payment_method">
                                Payment Method *
                            </label>
                            <select
                                id="payment_method"
                                name="payment_method"
                                value={formData.payment_method}
                                onChange={handleChange}
                                className="w-full bg-gray-900/80 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            >
                                <option value="visa">Visa</option>
                                <option value="mastercard">MasterCard</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-gray-300 font-medium mb-2" htmlFor="status">
                                Status
                            </label>
                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full bg-gray-900/80 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="pending">Pending</option>
                                <option value="completed">Completed</option>
                                <option value="failed">Failed</option>
                                <option value="refunded">Refunded</option>
                            </select>
                        </div>


                        {formData.payment_method === 'credit_card' && (
                            <>
                                <div>
                                    <label className="block text-gray-300 font-medium mb-2" htmlFor="card_name">
                                        Name on Card *
                                    </label>
                                    <input
                                        id="card_name"
                                        name="card_name"
                                        type="text"
                                        value={formData.card_name}
                                        onChange={handleChange}
                                        className="w-full bg-gray-900/80 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required={formData.payment_method === 'credit_card'}
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-300 font-medium mb-2" htmlFor="card_number">
                                        Card Number *
                                    </label>
                                    <input
                                        id="card_number"
                                        name="card_number"
                                        type="text"
                                        value={formData.card_number}
                                        onChange={handleChange}
                                        className="w-full bg-gray-900/80 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required={formData.payment_method === 'credit_card'}
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-300 font-medium mb-2" htmlFor="cvv">
                                        CVV *
                                    </label>
                                    <input
                                        id="cvv"
                                        name="cvv"
                                        type="text"
                                        value={formData.cvv}
                                        onChange={handleChange}
                                        className="w-full bg-gray-900/80 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required={formData.payment_method === 'credit_card'}
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-300 font-medium mb-2" htmlFor="expire_date">
                                        Expiry Date *
                                    </label>
                                    <input
                                        id="expire_date"
                                        name="expire_date"
                                        type="text"
                                        placeholder="MM/YY"
                                        value={formData.expire_date}
                                        onChange={handleChange}
                                        className="w-full bg-gray-900/80 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required={formData.payment_method === 'credit_card'}
                                    />
                                </div>
                            </>
                        )}

                        <div className="flex items-center justify-end col-span-2">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200 font-medium shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 mr-4"
                            >
                                Cancel
                            </button>
                            
                            <button
                                type="submit"
                                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center gap-2 disabled:opacity-60"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                        </svg>
                                        Update Payment
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PaymentForm;
