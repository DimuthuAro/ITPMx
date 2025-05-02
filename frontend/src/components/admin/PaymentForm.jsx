import { useState, useEffect } from 'react';
import { createPayment, updatePayment, getUsers } from '../../services/api';

const PaymentForm = ({ onPaymentAdded, onPaymentUpdated, editingPayment, setEditingPayment }) => {
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
    const [showForm, setShowForm] = useState(false);

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
            setShowForm(true);
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
        setShowForm(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            if (editingPayment) {
                await updatePayment(editingPayment._id, formData);
                onPaymentUpdated({ ...editingPayment, ...formData });
                setEditingPayment(null);
            } else {
                const newPayment = await createPayment(formData);
                onPaymentAdded(newPayment);
            }
            resetForm();
            setShowForm(false);
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred while saving the payment');
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
                    {editingPayment ? 'Edit Payment' : 'Add New Payment'}
                </button>
            ) : (
                <div className="bg-gray-800/90 backdrop-blur-sm border border-gray-700 shadow rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4 text-white">
                        {editingPayment ? 'Edit Payment' : 'Create New Payment'}
                    </h3>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
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

                        <div className="mb-4">
                            <label className="block text-gray-200 text-sm font-bold mb-2" htmlFor="name">
                                Payment Name
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-200 text-sm font-bold mb-2" htmlFor="amount">
                                Amount
                            </label>
                            <input
                                id="amount"
                                name="amount"
                                type="number"
                                step="0.01"
                                value={formData.amount}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-200 text-sm font-bold mb-2" htmlFor="payment_method">
                                Payment Method
                            </label>
                            <select
                                id="payment_method"
                                name="payment_method"
                                value={formData.payment_method}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            >
                                <option value="credit_card">Credit Card</option>
                                <option value="paypal">PayPal</option>
                                <option value="bank_transfer">Bank Transfer</option>
                            </select>
                        </div>

                        {formData.payment_method === 'credit_card' && (
                            <>
                                <div className="mb-4">
                                    <label className="block text-gray-200 text-sm font-bold mb-2" htmlFor="card_name">
                                        Name on Card
                                    </label>
                                    <input
                                        id="card_name"
                                        name="card_name"
                                        type="text"
                                        value={formData.card_name}
                                        onChange={handleChange}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        required={formData.payment_method === 'credit_card'}
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-200 text-sm font-bold mb-2" htmlFor="card_number">
                                        Card Number
                                    </label>
                                    <input
                                        id="card_number"
                                        name="card_number"
                                        type="text"
                                        value={formData.card_number}
                                        onChange={handleChange}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        required={formData.payment_method === 'credit_card'}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="mb-4">
                                        <label className="block text-gray-200 text-sm font-bold mb-2" htmlFor="cvv">
                                            CVV
                                        </label>
                                        <input
                                            id="cvv"
                                            name="cvv"
                                            type="text"
                                            value={formData.cvv}
                                            onChange={handleChange}
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            required={formData.payment_method === 'credit_card'}
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-gray-200 text-sm font-bold mb-2" htmlFor="expire_date">
                                            Expiry Date
                                        </label>
                                        <input
                                            id="expire_date"
                                            name="expire_date"
                                            type="text"
                                            placeholder="MM/YY"
                                            value={formData.expire_date}
                                            onChange={handleChange}
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            required={formData.payment_method === 'credit_card'}
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        <div className="mb-4">
                            <label className="block text-gray-200 text-sm font-bold mb-2" htmlFor="status">
                                Status
                            </label>
                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            >
                                <option value="pending">Pending</option>
                                <option value="completed">Completed</option>
                                <option value="failed">Failed</option>
                                <option value="refunded">Refunded</option>
                            </select>
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-200 text-sm font-bold mb-2" htmlFor="description">
                                Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                rows="3"
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                disabled={isSubmitting}
                            >
                                {isSubmitting
                                    ? (editingPayment ? 'Updating...' : 'Creating...')
                                    : (editingPayment ? 'Update Payment' : 'Create Payment')}
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

export default PaymentForm;
