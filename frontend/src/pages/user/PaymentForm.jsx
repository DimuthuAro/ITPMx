import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPayment } from '../../services/api';
import UserLayout from '../../components/user/UserLayout';
import { useAuth } from '../../context/AuthContext';

const PaymentForm = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    
    const [formData, setFormData] = useState({
        name: currentUser?.name || '',
        payment_method: 'credit_card',
        card_name: '',
        card_number: '',
        cvv: '',
        expire_date: '',
        amount: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Format card number with spaces
        if (name === 'card_number') {
            // Remove all non-digit characters
            const cleaned = value.replace(/\D/g, '');
            // Add a space after every 4 digits
            let formatted = '';
            for (let i = 0; i < cleaned.length; i += 4) {
                formatted += cleaned.slice(i, i + 4) + ' ';
            }
            // Trim extra space and limit to 19 characters (16 digits + 3 spaces)
            formatted = formatted.trim().slice(0, 19);
            setFormData(prev => ({ ...prev, [name]: formatted }));
            return;
        }
        
        // Format expiration date as MM/YY
        if (name === 'expire_date') {
            const cleaned = value.replace(/\D/g, '');
            if (cleaned.length <= 2) {
                setFormData(prev => ({ ...prev, [name]: cleaned }));
            } else {
                const month = cleaned.slice(0, 2);
                const year = cleaned.slice(2, 4);
                setFormData(prev => ({ ...prev, [name]: `${month}/${year}` }));
            }
            return;
        }

        // Format CVV to only allow 3 or 4 digits
        if (name === 'cvv') {
            const cleaned = value.replace(/\D/g, '').slice(0, 4);
            setFormData(prev => ({ ...prev, [name]: cleaned }));
            return;
        }

        // For other fields
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        const errors = {};
        
        if (!formData.name.trim()) errors.name = "Name is required";
        if (!formData.card_name.trim()) errors.card_name = "Name on card is required";
        
        // Validate card number (should be 16 digits)
        const cardNumberDigits = formData.card_number.replace(/\D/g, '');
        if (cardNumberDigits.length !== 16) errors.card_number = "Card number must be 16 digits";
        
        // Validate expiration date (MM/YY format)
        if (!formData.expire_date.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) {
            errors.expire_date = "Expiration date should be MM/YY format";
        } else {
            // Check if card is expired
            const [month, year] = formData.expire_date.split('/');
            const expiryDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
            const today = new Date();
            if (expiryDate < today) {
                errors.expire_date = "Card is expired";
            }
        }
        
        // Validate CVV (3-4 digits)
        if (!formData.cvv.match(/^\d{3,4}$/)) errors.cvv = "CVV must be 3-4 digits";
        
        // Validate amount
        if (!formData.amount || parseFloat(formData.amount) <= 0) {
            errors.amount = "Please enter a valid amount";
        }
        
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            const errorMessage = Object.values(validationErrors).join(', ');
            setError(errorMessage);
            setLoading(false);
            return;
        }
        
        try {
            // Prepare payment data
            const paymentData = {
                ...formData,
                user: currentUser.id,
                card_number: formData.card_number.replace(/\s/g, ''), // Remove spaces
                amount: parseFloat(formData.amount)
            };
            
            const response = await createPayment(paymentData);
            setSuccessMessage('Payment submitted successfully!');
            
            // Reset form
            setFormData({
                name: currentUser?.name || '',
                payment_method: 'credit_card',
                card_name: '',
                card_number: '',
                cvv: '',
                expire_date: '',
                amount: ''
            });
            
            // Redirect to payment list after a delay
            setTimeout(() => {
                navigate('/payments');
            }, 2000);
            
        } catch (err) {
            console.error('Error creating payment:', err);
            setError('Failed to process payment. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/payments');
    };

    return (
        <UserLayout 
            title="Make a Payment" 
            subtitle="Enter your payment information securely"
            showBackButton={true}
            onBack={() => navigate('/payments')}
        >
            {successMessage && (
                <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded">
                    <p>{successMessage}</p>
                </div>
            )}
            
            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
                    <p>{error}</p>
                </div>
            )}
            
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1">Your Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1">Payment Method</label>
                            <select
                                name="payment_method"
                                value={formData.payment_method}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="credit_card">Credit Card</option>
                                <option value="debit_card">Debit Card</option>
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1">Name on Card</label>
                            <input
                                type="text"
                                name="card_name"
                                value={formData.card_name}
                                onChange={handleChange}
                                required
                                placeholder="Exactly as shown on card"
                                className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    
                    {/* Right Column */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1">Card Number</label>
                            <input
                                type="text"
                                name="card_number"
                                value={formData.card_number}
                                onChange={handleChange}
                                required
                                placeholder="0000 0000 0000 0000"
                                className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                maxLength={19}
                            />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-1">Expiry Date</label>
                                <input
                                    type="text"
                                    name="expire_date"
                                    value={formData.expire_date}
                                    onChange={handleChange}
                                    required
                                    placeholder="MM/YY"
                                    className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    maxLength={5}
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-1">CVV</label>
                                <input
                                    type="password"
                                    name="cvv"
                                    value={formData.cvv}
                                    onChange={handleChange}
                                    required
                                    placeholder="000"
                                    className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    maxLength={4}
                                />
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1">Amount ($)</label>
                            <input
                                type="number"
                                name="amount"
                                value={formData.amount}
                                onChange={handleChange}
                                required
                                min="0.01"
                                step="0.01"
                                placeholder="0.00"
                                className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>
                
                <div className="mt-8 border-t border-gray-200 pt-4">
                    <div className="bg-gray-50 p-4 rounded text-sm text-gray-600 mb-6">
                        <p className="flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            Your payment information is encrypted and secure. We do not store your complete card details.
                        </p>
                    </div>
                    
                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-4 w-4 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </>
                            ) : `Pay $${formData.amount ? parseFloat(formData.amount).toFixed(2) : '0.00'}`}
                        </button>
                    </div>
                </div>
            </form>
        </UserLayout>
    );
};

export default PaymentForm;