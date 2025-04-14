import axios from 'axios';
import { useState } from 'react';
import './tickets.css';

const CreateTicket = () => {
    const [formData, setFormData] = useState({
        user_id: '',
        name: '',
        email: '',
        title: '',
        description: '',
        issue_type: '',
        priority: ''
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const validateField = (name, value) => {
        let error = "";

        // User ID validation - only positive numbers
        if (name === "user_id") {
            if (value === '') {
                error = '';
            } else if (!/^\d+$/.test(value)) {
                error = 'Only positive numbers allowed';
            } else if (parseInt(value) <= 0) {
                error = 'Negative values are not allowed';
            }
        }

        // Name validation - only letters and spaces, at least 5 characters
        if (name === "name") {
            if (!/^[a-zA-Z\s]*$/.test(value)) {
                error = 'Only letters and spaces allowed';
            } else if (value.length > 0 && value.length <= 5) {
                error = 'Must be more than 5 characters long';
            }
        }

        // Title validation - only letters and spaces, at least 5 characters
        if (name === "title") {
            if (!/^[a-zA-Z\s]*$/.test(value)) {
                error = 'Only letters and spaces allowed';
            } else if (value.length > 0 && value.length <= 5) {
                error = 'Must be more than 5 characters long';
            }
        }

        // Description validation - letters, numbers, spaces, at least 5 characters
        if (name === "description") {
            if (!/^[a-zA-Z0-9\s]*$/.test(value)) {
                error = 'Only letters, numbers and spaces allowed';
            } else if (value.length > 0 && value.length <= 5) {
                error = 'Must be more than 5 characters long';
            }
        }

        // Email Validation (Must Contain '@')
        if (name === 'email') {
            if (!value.includes('@')) {
                error = 'Invalid email format';
            }
        }

        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: error
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Prevent invalid input for specific fields
        if (name === "user_id" && !/^\d*$/.test(value)) {
            return; // Block non-digit characters for user_id
        }
        if ((name === "name" || name === "title") && !/^[a-zA-Z\s]*$/.test(value)) {
            return; // Block numbers and special characters for name and title
        }
        if (name === "description" && !/^[a-zA-Z0-9\s]*$/.test(value)) {
            return; // Block special characters for description
        }
        if (name === 'email' && value.length > 50) {
            return; // Block email input longer than 50 characters
        }
        if (name === 'title' && value.length > 50) {
            return; // Block title input longer than 50 characters
        }

        setFormData({
            ...formData,
            [name]: value,
        });

        validateField(name, value);
    };

    const isFormValid = () => {
        return Object.values(formData).every((value) => value.trim() !== '');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        setError('');
        console.log('Form data:', formData);
        try {
            await axios.post('http://localhost:3000/api/tickets', formData);
            alert('Ticket created successfully!');
            window.location.href = '/tickets';
        } catch (err) {
            setError('Failed to create ticket. Please try again.');
        } finally {
            setLoading(false);
        }
    };
  

    return (
        <div className="create-ticket-container">
        <div className="create-ticket-card">
            <h1 className="create-ticket-title">Create Ticket</h1>
            {errors.submit && <div className="error-message">{errors.submit}</div>}
            
            {error && (
                <div className="create-ticket-error">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="vertical-form">
                <div className="form-field">
                    <label htmlFor="user_id">User ID:</label>
                    <input
                        id="user_id"
                        type="number"
                        name="user_id"
                        value={formData.user_id}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    />
                    {errors.user_id && <div className="error-message">{errors.user_id}</div>}
                </div>

                <div className="form-field">
                    <label htmlFor="name">Name:</label>
                    <input
                        id="name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    />
                    {errors.name && <div className="error-message">{errors.name}</div>}
                </div>

                <div className="form-field">
                    <label htmlFor="email">Email:</label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    />
                    {errors.email && <div className="error-message">{errors.email}</div>}
                </div>

                <div className="form-field">
                    <label htmlFor="title">Title:</label>
                    <input
                        id="title"
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    />
                    {errors.title && <div className="error-message">{errors.title}</div>}
                </div>

                <div className="form-field">
                    <label htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    />
                    {errors.description && <div className="error-message">{errors.description}</div>}
                </div>

                <div className="form-field">
                    <label htmlFor="issue_type">Issue Type:</label>
                    <select
                        id="issue_type"
                        name="issue_type"
                        value={formData.issue_type}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    >
                        <option value="">Select Issue Type</option>
                        
                            <option value="Billing">Billing</option>
                            <option value="Technical">Technical</option>
                            <option value="Account">Account</option>
                            <option value="Attachment">Attachment</option>
                    </select>
                </div>

                <div className="form-field">
                    <label htmlFor="priority">Priority:</label>
                    <select
                        id="priority"
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    >
                        <option value="">Select Priority</option>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                </div>

                <button
                    type="submit"
                    className="submit-btn create-ticket-btn"
                    disabled={loading || !isFormValid()}
                >
                    {loading ? 'Creating...' : 'Create Ticket'}
                </button>
            </form>
        </div>
    </div>
    );
};

export default CreateTicket;

