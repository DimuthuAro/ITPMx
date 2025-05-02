import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import UserLayout from '../../components/user/UserLayout';
import { useAuth } from '../../context/AuthContext';
import Chatbot from '../../components/user/Chatbot';

const Support = () => {
    const { currentUser } = useAuth();
    const [formData, setFormData] = useState({
        name: currentUser?.username || '',
        email: currentUser?.email || '',
        subject: '',
        inquiry_type: 'general_inquiry',
        message: '',
    });
    // Gemini API key - Replace with your actual key when deploying
    const geminiApiKey = "AIzaSyCw7OseY5nPkeM2Oxqao1w9U6IPe3odklw";
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            // In a real app, we would submit this to the backend
            // await submitSupportTicket(formData);
            
            // For now, we'll simulate a successful submission
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            setSuccessMessage('Your support ticket has been submitted successfully. Our team will contact you shortly.');
            
            // Reset form
            setFormData({
                name: currentUser?.username || '',
                email: currentUser?.email || '',
                subject: '',
                inquiry_type: 'general_inquiry',
                message: '',
            });
        } catch (error) {
            console.error('Error submitting support ticket:', error);
            setErrorMessage('Failed to submit support ticket. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const supportCategories = [
        {
            title: "Technical Help",
            icon: (
                <svg className="w-12 h-12 text-blue-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                </svg>
            ),
            description: "Get help with technical issues, bugs, or application errors."
        },
        {
            title: "Account & Billing",
            icon: (
                <svg className="w-12 h-12 text-blue-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                </svg>
            ),
            description: "Questions about your account, subscription, or payment issues."
        },
        {
            title: "Feature Requests",
            icon: (
                <svg className="w-12 h-12 text-blue-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                </svg>
            ),
            description: "Suggest new features or improvements to our service."
        }
    ];

    return (
        <UserLayout title="Support Center" subtitle="Get help and support for all your needs">
            <div className="space-y-8">
                {/* Support Options */}
                <div className="bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm border border-gray-700/50 shadow-lg">
                    <h2 className="text-xl font-semibold text-white mb-6">How can we help you today?</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {supportCategories.map((category, index) => (
                            <div 
                                key={index} 
                                className="bg-gray-900/70 rounded-lg p-6 border border-gray-700 hover:border-blue-500/50 hover:shadow-md hover:shadow-blue-500/20 transition-all duration-300 text-center"
                            >
                                <div className="flex justify-center">
                                    {category.icon}
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-2">{category.title}</h3>
                                <p className="text-gray-300 mb-4">{category.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
                
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
                        
                        <a 
                            href="mailto:support@example.com" 
                            className="flex items-center p-4 bg-gray-900/70 rounded-lg hover:bg-gray-900 transition-colors duration-200 border border-gray-700"
                        >
                            <svg className="w-6 h-6 text-blue-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                            </svg>
                            <div>
                                <h3 className="font-medium text-white">Email Support</h3>
                                <p className="text-sm text-gray-400">Send us an email at support@example.com</p>
                            </div>
                        </a>
                        
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
                            <div>
                                <label htmlFor="name" className="block text-gray-300 font-medium mb-2">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-gray-900/80 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
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
                                    className="w-full bg-gray-900/80 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                        
                        <div>
                            <label htmlFor="subject" className="block text-gray-300 font-medium mb-2">Subject</label>
                            <input
                                type="text"
                                id="subject"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                                className="w-full bg-gray-900/80 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
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
                                <option value="general_inquiry">General Inquiry</option>
                                <option value="technical_issue">Technical Issue</option>
                                <option value="billing_question">Billing Question</option>
                                <option value="feature_request">Feature Request</option>
                                <option value="account_issue">Account Issue</option>
                            </select>
                        </div>
                        
                        <div>
                            <label htmlFor="message" className="block text-gray-300 font-medium mb-2">Message</label>
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                required
                                rows="5"
                                className="w-full bg-gray-900/80 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            ></textarea>
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
            
            {/* Add Chatbot component */}
            <Chatbot apiKey={geminiApiKey} />
        </UserLayout>
    );
};

export default Support;