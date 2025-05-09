import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import UserLayout from '../../components/user/UserLayout';
import { useAuth } from '../../context/AuthContext';

import { createTicket } from '../../services/api'; // Assuming you have an API function to create tickets
const Support = () => {
    const { currentUser } = useAuth();
    const [formData, setFormData] = useState({
        user: currentUser?.id || '', // Match backend model
        name: currentUser?.username || '',
        email: currentUser?.email || '',
        phone: '',
        title: '',
        description: '',
        inquiry_type: 'general', // Match backend enum
        priority: 'low',
    });
    // Gemini API key - Replace with your actual key when deploying
    const geminiApiKey = "AIzaSyCw7OseY5nPkeM2Oxqao1w9U6IPe3odklw";
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [validationErrors, setValidationErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Validation rules
        let isValid = true;
        const errors = {...validationErrors};

        // Validate name (letters and spaces only)
        if (name === 'name') {
            const lettersAndSpacesOnly = value.replace(/[^A-Za-z\s]/g, '');
            
            // If the value contains non-letters/spaces, use the cleaned version
            if (lettersAndSpacesOnly !== value) {
                // Update form directly with cleaned value
                setFormData(prev => ({
                    ...prev,
                    [name]: lettersAndSpacesOnly
                }));
                return; // Exit early to prevent duplicate state updates
            }
            
            delete errors.name; // Clear any previous name validation errors
        }

        // Validate phone (numbers only, exactly 10 digits)
        if (name === 'phone') {
            const numbersOnly = value.replace(/\D/g, '');
            
            // Limit to exactly 10 digits
            const limitedNumbers = numbersOnly.slice(0, 10);
            
            // Update form with cleaned and limited value
            setFormData(prev => ({
                ...prev,
                [name]: limitedNumbers
            }));
            
            // Show error if not exactly 10 digits (only when user has started typing)
            if (limitedNumbers.length > 0 && limitedNumbers.length !== 10) {
                errors.phone = 'Phone number must be exactly 10 digits';
            } else {
                delete errors.phone;
            }
            
            // Exit early as we've already updated the form state
            return;
        }

        // Validate email format
        if (name === 'email') {
            if (!value.includes('@') && value.trim() !== '') {
                errors.email = 'Email must contain @ symbol';
                isValid = false;
            } else {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value) && value.trim() !== '') {
                    errors.email = 'Please enter a valid email address';
                    isValid = false;
                } else {
                    delete errors.email;
                }
            }
        }
        
        // Validate title length
        if (name === 'title') {
            if (value.length > 0 && value.length < 5) {
                errors.title = 'Please enter at least 5 characters';
                isValid = false;
            } else {
                delete errors.title;
            }
        }
        
        // Validate description length
        if (name === 'description') {
            if (value.length > 0 && value.length < 10) {
                errors.description = 'Please enter at least 10 characters';
                isValid = false;
            } else {
                delete errors.description;
            }
        }

        // Update validation errors state
        setValidationErrors(errors);

        // Update form data if valid or if it's a field other than those being validated
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const validateForm = () => {
        const errors = {};
        let isValid = true;

        // Required field validation
        if (!formData.name.trim()) {
            errors.name = 'Name is required';
            isValid = false;
        } else if (!/^[A-Za-z\s]*$/.test(formData.name)) {
            errors.name = 'Name should contain only letters and spaces';
            isValid = false;
        }

        if (!formData.email.trim()) {
            errors.email = 'Email is required';
            isValid = false;
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                errors.email = 'Please enter a valid email address';
                isValid = false;
            }
        }

        if (!formData.phone.trim()) {
            errors.phone = 'Phone is required';
            isValid = false;
        } else if (!/^\d+$/.test(formData.phone)) {
            errors.phone = 'Phone should contain only numbers';
            isValid = false;
        } else if (formData.phone.length !== 10) {
            errors.phone = 'Phone number must be exactly 10 digits';
            isValid = false;
        }

        if (!formData.title.trim()) {
            errors.title = 'Title is required';
            isValid = false;
        } else if (formData.title.length < 5) {
            errors.title = 'Please enter at least 5 characters';
            isValid = false;
        }

        if (!formData.description.trim()) {
            errors.description = 'Description is required';
            isValid = false;
        } else if (formData.description.length < 10) {
            errors.description = 'Please enter at least 10 characters';
            isValid = false;
        }

        setValidationErrors(errors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMessage('');
        setSuccessMessage('');
        
        // Validate the form
        if (!validateForm()) {
            setErrorMessage('Please correct the errors in the form.');
            setIsSubmitting(false);
            return;
        }
        
        try {
            // Create a new object with the latest form data and user information
            const ticketData = {
                ...formData,
                user: currentUser?.id, // Directly use currentUser.id
                // Use form input values, don't override with currentUser data
                status: 'open', // Explicitly set status to match what admin panel expects
            };
            
            // Submit the ticket data to the backend
            const response = await createTicket(ticketData);
            console.log('Response:', response);
            setSuccessMessage('Your support ticket has been submitted successfully. Our team will contact you shortly.');

            // Reset form
            setFormData({
                user: currentUser?.id || '',
                name: currentUser?.username || '',
                email: currentUser?.email || '',
                phone: '',
                title: '',
                description: '',
                inquiry_type: 'general',
                priority: 'low',
            });
            setValidationErrors({});
            console.log('Support ticket submitted:', response);
        } catch (error) {
            console.error('Error submitting support ticket:', error);
            setErrorMessage('Failed to submit support ticket. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <UserLayout title="Support Center" subtitle="Get help and support for all your needs">
            <div className="space-y-8">

                
                {/* Quick Links */}
                <div className="bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm border border-gray-700/50 shadow-lg">
                    <h2 className="text-xl font-semibold text-white mb-4">Quick Support Resources</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Link 
                            to="/faq" 
                            className="flex items-center p-4 bg-gray-900/70 rounded-lg hover:bg-gray-900 transition-colors duration-200 border border-gray-700"
                        >
                            <svg className="w-6 h-6 text-blue-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <div>
                                <h3 className="font-medium text-white">Frequently Asked Questions</h3>
                                <p className="text-sm text-gray-400">Find quick answers to common questions</p>
                            </div>
                        </Link>
                        
                        <Link 
                            to="/tickets" 
                            className="flex items-center p-4 bg-gray-900/70 rounded-lg hover:bg-gray-900 transition-colors duration-200 border border-gray-700"
                        >
                            <svg className="w-6 h-6 text-blue-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                            </svg>
                            <div>
                                <h3 className="font-medium text-white">View Your Tickets</h3>
                                <p className="text-sm text-gray-400">Check the status of your support tickets</p>
                            </div>
                        </Link>
                        
                    </div>
                    <div className=" flex items-center justify-center flex-row p-4" > 
                            <div 
                                className="flex items-center p-4 bg-gray-900/70 rounded-lg border border-gray-700"
                            >
                                <svg className="w-6 h-6 text-blue-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <div>
                                    <h3 className="font-medium text-white">Support Hours</h3>
                                    <p className="text-sm text-gray-400">Monday-Friday: 9am-6pm ET</p>
                                </div>
                            </div>
                        </div>
                </div>

                {/* Contact Form */}
                <div className="bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm border border-gray-700/50 shadow-lg">
                    <h2 className="text-xl font-semibold text-white mb-6">Submit a Support Request</h2>
                    
                    {successMessage && (
                        <div className="bg-green-900/30 border-l-4 border-green-500 text-green-100 p-4 rounded-lg backdrop-blur-sm mb-6">
                            <p className="flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                {successMessage}
                            </p>
                        </div>
                    )}

                    {errorMessage && (
                        <div className="bg-red-900/40 border-l-4 border-red-500 text-red-100 p-4 rounded-lg backdrop-blur-sm mb-6">
                            <p className="flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                {errorMessage}
                            </p>
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <input
                                    hidden
                                    type="text"
                                    id="user"
                                    name="user"
                                    value={formData.user}
                                    onChange={handleChange}
                                    className="w-full bg-gray-900/80 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />

                            <div>
                                <label htmlFor="name" className="block text-gray-300 font-medium mb-2">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className={`w-full bg-gray-900/80 border ${validationErrors.name ? 'border-red-500' : 'border-gray-700'} text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                />
                                {validationErrors.name && (
                                    <p className="mt-1 text-sm text-red-400">{validationErrors.name}</p>
                                )}
                            </div>
                            
                            <div>
                                <label htmlFor="email" className="block text-gray-300 font-medium mb-2">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className={`w-full bg-gray-900/80 border ${validationErrors.email ? 'border-red-500' : 'border-gray-700'} text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                />
                                {validationErrors.email && (
                                    <p className="mt-1 text-sm text-red-400">{validationErrors.email}</p>
                                )}
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="phone" className="block text-gray-300 font-medium mb-2">Mobile</label>
                                <input
                                    type="text"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    placeholder="Numbers only"
                                    className={`w-full bg-gray-900/80 border ${validationErrors.phone ? 'border-red-500' : 'border-gray-700'} text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                />
                                {validationErrors.phone && (
                                    <p className="mt-1 text-sm text-red-400">{validationErrors.phone}</p>
                                )}
                            </div>
                            
                            <div>
                                <label htmlFor="title" className="block text-gray-300 font-medium mb-2">Title</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    className={`w-full bg-gray-900/80 border ${validationErrors.title ? 'border-red-500' : 'border-gray-700'} text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                />
                                {validationErrors.title && (
                                    <p className="mt-1 text-sm text-red-400">{validationErrors.title}</p>
                                )}
                            </div>
                        </div>
                        
                        <div>
                            <label htmlFor="description" className="block text-gray-300 font-medium mb-2">Description</label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                rows="5"
                                className={`w-full bg-gray-900/80 border ${validationErrors.description ? 'border-red-500' : 'border-gray-700'} text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                            ></textarea>
                            {validationErrors.description && (
                                <p className="mt-1 text-sm text-red-400">{validationErrors.description}</p>
                            )}
                        </div>
                        
                        <div>
                            <label htmlFor="inquiry_type" className="block text-gray-300 font-medium mb-2">Request Type</label>
                            <select
                                id="inquiry_type"
                                name="inquiry_type"
                                value={formData.inquiry_type}
                                onChange={handleChange}
                                required
                                className="w-full bg-gray-900/80 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="general">General Inquiry</option>
                                <option value="technical">Technical Issue</option>
                                <option value="billing">Billing Question</option>
                                <option value="feature_request">Feature Request</option>
                                <option value="bug_report">Account Issue</option>
                            </select>
                        </div>
                        
                        <div>
                            <label htmlFor="priority" className="block text-gray-300 font-medium mb-2">Priority</label>
                            <select
                                id="priority"
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                                required
                                className="w-full bg-gray-900/80 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="urgent">Urgent</option>
                            </select>
                        </div>
                        
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center gap-2 disabled:opacity-60"
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                        </svg>
                                        Submit Request
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            

        </UserLayout>
    );
};

export default Support;