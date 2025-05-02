import React from 'react';
import { useNavigate } from 'react-router-dom';

const PricePlan = () => {
    const navigate = useNavigate();
    
    const handleProceedToPayment = (planType) => {
        navigate('/payments/create', { state: { planType } });
    };

    return (
        <div className="container mx-auto px-4 py-12 max-w-7xl">
            <div className="text-center mb-12">
                <h1 className="text-3xl font-bold text-white mb-2">Subscription Plans</h1>
                <p className="text-gray-300 text-lg">Choose the perfect plan for your needs</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mt-8">
                {/* Basic Plan */}
                <div className="bg-gray-800/10 backdrop-blur-3xl rounded-lg overflow-hidden border border-gray-700 hover:shadow-lg hover:shadow-blue-500/30 transition duration-300">
                    <div className="bg-blue-900 p-6 text-center">
                        <h2 className="text-xl font-bold text-white">Basic Plan</h2>
                        <div className="mt-4">
                            <span className="text-3xl font-bold text-white">$5</span>
                            <span className="text-gray-300">/month</span>
                        </div>
                    </div>
                    <div className="p-6">
                        <ul className="space-y-3 mb-8">
                            <li className="flex items-center text-gray-300">
                                <svg className="w-5 h-5 mr-2 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                </svg>
                                Up to 2,500 notes
                            </li>
                            <li className="flex items-center text-gray-300">
                                <svg className="w-5 h-5 mr-2 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                </svg>
                                Basic support
                            </li>
                            <li className="flex items-center text-gray-300">
                                <svg className="w-5 h-5 mr-2 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                </svg>
                                Standard formatting options
                            </li>
                        </ul>
                        <button 
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                            onClick={() => handleProceedToPayment('basic')}
                        >
                            Select Basic Plan
                        </button>
                    </div>
                </div>

                {/* Standard Plan */}
                <div className="bg-gray-800/10 backdrop-blur-3xl rounded-lg overflow-hidden border border-blue-600 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition duration-300 transform scale-105">
                    <div className="bg-blue-800 p-6 text-center relative">
                        <span className="absolute top-0 right-0 bg-blue-600 text-white px-4 py-1 text-xs font-bold transform translate-y-0 rounded-bl-lg">POPULAR</span>
                        <h2 className="text-xl font-bold text-white">Standard Plan</h2>
                        <div className="mt-4">
                            <span className="text-3xl font-bold text-white">$10</span>
                            <span className="text-gray-300">/month</span>
                        </div>
                    </div>
                    <div className="p-6">
                        <ul className="space-y-3 mb-8">
                            <li className="flex items-center text-gray-300">
                                <svg className="w-5 h-5 mr-2 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                </svg>
                                Up to 7,500 notes
                            </li>
                            <li className="flex items-center text-gray-300">
                                <svg className="w-5 h-5 mr-2 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                </svg>
                                Priority support
                            </li>
                            <li className="flex items-center text-gray-300">
                                <svg className="w-5 h-5 mr-2 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                </svg>
                                Advanced formatting options
                            </li>
                            <li className="flex items-center text-gray-300">
                                <svg className="w-5 h-5 mr-2 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                </svg>
                                File attachments
                            </li>
                        </ul>
                        <button 
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                            onClick={() => handleProceedToPayment('standard')}
                        >
                            Select Standard Plan
                        </button>
                    </div>
                </div>

                {/* Premium Plan */}
                <div className="bg-gray-800/10 backdrop-blur-3xl rounded-lg overflow-hidden border border-gray-700 hover:shadow-lg hover:shadow-blue-500/30 transition duration-300">
                    <div className="bg-blue-900 p-6 text-center">
                        <h2 className="text-xl font-bold text-white">Premium Plan</h2>
                        <div className="mt-4">
                            <span className="text-3xl font-bold text-white">$15</span>
                            <span className="text-gray-300">/month</span>
                        </div>
                    </div>
                    <div className="p-6">
                        <ul className="space-y-3 mb-8">
                            <li className="flex items-center text-gray-300">
                                <svg className="w-5 h-5 mr-2 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                </svg>
                                Unlimited notes
                            </li>
                            <li className="flex items-center text-gray-300">
                                <svg className="w-5 h-5 mr-2 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                </svg>
                                24/7 dedicated support
                            </li>
                            <li className="flex items-center text-gray-300">
                                <svg className="w-5 h-5 mr-2 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                </svg>
                                Premium formatting options
                            </li>
                            <li className="flex items-center text-gray-300">
                                <svg className="w-5 h-5 mr-2 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                </svg>
                                Advanced analytics
                            </li>
                        </ul>
                        <button 
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50" 
                            onClick={() => handleProceedToPayment('premium')}
                        >
                            Select Premium Plan
                        </button>
                    </div>
                </div>
            </div>

            <div className="text-center mt-12">
                <p className="text-gray-400 text-sm">All plans include a 14-day free trial. No credit card required.</p>
                <p className="text-gray-400 text-sm mt-2">Have questions? <a href="#" className="text-blue-400 hover:text-blue-300">Contact our sales team</a></p>
            </div>
        </div>
    );
};

export default PricePlan;
