import axios from 'axios';
import { useState } from 'react';

const CreatePayment = () => {
    const [formData, setFormData] = useState({
        user_id: '',
        name: '',
        email: '',
        amount: '',
        method: '',
        date: '',
    });

    const [errors, setErrors] = useState({
        user_id: '',
        name: '',
        email: '',
        amount: '',
    });

    const validateForm = (name, value) => {
        const newErrors = { ...errors };

        switch (name) {
            case 'user_id':
                newErrors.user_id = /^\d+$/.test(value) && parseInt(value) > 0 
                    ? '' 
                    : 'Enter a valid positive number';
                break;

            case 'name':
                if (!/^[A-Za-z\s]*$/.test(value)) {
                    newErrors.name = 'Only letters and spaces allowed';
                } else if (value.length < 3) {
                    newErrors.name = 'Must be at least 3 characters long';
                } else {
                    newErrors.name = '';
                }
                break;

            case 'email':
                newErrors.email = value.includes('@') 
                    ? '' 
                    : 'Invalid email format';
                break;

            case 'amount':
                newErrors.amount = /^\d+(\.\d{1,2})?$/.test(value) && parseFloat(value) > 0
                    ? ''
                    : 'Enter a valid positive amount';
                break;
        }

        setErrors(newErrors);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Input restrictions
        switch (name) {
            case 'name':
                if (!/^[A-Za-z\s]*$/.test(value)) return;
                break;
            
            case 'user_id':
                if (!/^\d*$/.test(value)) return;
                break;
            
            case 'amount':
                if (!/^\d*\.?\d*$/.test(value)) return;
                break;
        }

        setFormData(prev => ({ ...prev, [name]: value }));
        validateForm(name, value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (Object.values(errors).some(error => error) || 
            Object.values(formData).some(field => !field)) {
            alert("Please fix errors before submitting.");
            return;
        }

        try {
            const payload = {
                user_id: parseInt(formData.user_id, 10),
                name: formData.name.trim(),
                email: formData.email.toLowerCase(),
                amount: parseFloat(formData.amount),
                method: formData.method,
                date: new Date(formData.date).toISOString(),
            };

            const response = await axios.post(
                'http://localhost:3000/api/payments',
                payload
            );

            console.log('Payment created:', response.data);
            window.location.href = '/payments';
            
        } catch (error) {
            console.error('Submission error:', {
                message: error.message,
                response: error.response?.data
            });
            alert(`Payment failed: ${error.response?.data?.message || error.message}`);
        }
    };

    return (
        <div className="payment-container">
            <h1>Create Payment</h1>

            <form onSubmit={handleSubmit}>
                {/* User ID Field */}
                <div className="form-group">
                    <label>User ID:</label>
                    <input
                        type="number"
                        name="user_id"
                        min="1"
                        value={formData.user_id}
                        onChange={handleChange}
                        required
                    />
                    {errors.user_id && <span className="error">{errors.user_id}</span>}
                </div>

                {/* Name Field */}
                <div className="form-group">
                    <label>Full Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                    {errors.name && <span className="error">{errors.name}</span>}
                </div>

                {/* Email Field */}
                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    {errors.email && <span className="error">{errors.email}</span>}
                </div>

                {/* Amount Field */}
                <div className="form-group">
                    <label>Amount (USD):</label>
                    <input
                        type="number"
                        name="amount"
                        step="0.01"
                        min="0.01"
                        value={formData.amount}
                        onChange={handleChange}
                        required
                    />
                    {errors.amount && <span className="error">{errors.amount}</span>}
                </div>

                {/* Payment Method Field */}
                <div className="form-group">
                    <label>Payment Method:</label>
                    <select
                        name="method"
                        value={formData.method}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Method</option>
                        <option value="Visa">Visa</option>
                        <option value="Master">Mastercard</option>
                        <option value="PayPal">PayPal</option>
                    </select>
                </div>

                {/* Date Field */}
                <div className="form-group">
                    <label>Payment Date:</label>
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        max={new Date().toISOString().split('T')[0]}
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="submit-btn"
                    disabled={Object.values(errors).some(error => error) || 
                             Object.values(formData).some(field => !field)}
                >
                    Create Payment
                </button>
            </form>
        </div>
    );
};

export default CreatePayment;