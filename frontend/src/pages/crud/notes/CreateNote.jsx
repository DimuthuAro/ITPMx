import axios from 'axios';
import { useState } from 'react';

const CreateNote = () => {
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        description: '',
        user_id: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        // Clear errors when user starts typing
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: '',
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        }
        if (!formData.category.trim()) {
            newErrors.category = 'Category is required';
        }
        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        }
        if (!formData.user_id.trim()) {
            newErrors.user_id = 'User ID is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Return true if no errors
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return; // Stop if validation fails
        console.log('Form data:', formData);
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:3000/api/notes', formData);
            console.log('Note created:', response.data);
            window.location.href = '/notes'; // Redirect after successful creation
        } catch (error) {
            console.error('Error creating note:', error);
            setErrors((prevErrors) => ({
                ...prevErrors,
                api: 'Failed to create note. Please try again.',
            }));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Create Note</h1>
            {errors.api && <p style={{ color: 'red' }}>{errors.api}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="title">Title:</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        aria-invalid={!!errors.title}
                        aria-describedby="title-error"
                    />
                    {errors.title && (
                        <span id="title-error" style={{ color: 'red' }}>
                            {errors.title}
                        </span>
                    )}
                </div>
                <div>
                    <label htmlFor="category">Category:</label>
                    <input
                        type="text"
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                        aria-invalid={!!errors.category}
                        aria-describedby="category-error"
                    />
                    {errors.category && (
                        <span id="category-error" style={{ color: 'red' }}>
                            {errors.category}
                        </span>
                    )}
                </div>
                <div>
                    <label htmlFor="description">Description:</label>
                    <input
                        type="text"
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        aria-invalid={!!errors.description}
                        aria-describedby="description-error"
                    />
                    {errors.description && (
                        <span id="description-error" style={{ color: 'red' }}>
                            {errors.description}
                        </span>
                    )}
                </div>
                <div>
                    <label htmlFor="userId">User ID:</label>
                    <input
                        type="text"
                        id="user_id"
                        name="user_id"
                        value={formData.userId}
                        onChange={handleChange}
                        required
                        aria-invalid={!!errors.userId}
                        aria-describedby="user_id-error"
                    />
                    {errors.userId && (
                        <span id="userId-error" style={{ color: 'red' }}>
                            {errors.userId}
                        </span>
                    )}
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Note'}
                </button>
            </form>
        </div>
    );
};

export default CreateNote;