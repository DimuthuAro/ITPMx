import React from 'react';

const UserLayout = ({ children, title, subtitle, showBackButton = false, onBack }) => {
    return (
        <div className="container mx-auto p-4">
            <div className="max-w-4xl mx-auto">
                {(title || showBackButton) && (
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            {title && <h1 className="text-3xl font-bold text-gray-800">{title}</h1>}
                            {subtitle && <p className="text-gray-600">{subtitle}</p>}
                        </div>

                        {showBackButton && (
                            <button
                                onClick={onBack}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded inline-flex items-center"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                                </svg>
                                Back
                            </button>
                        )}
                    </div>
                )}

                {children}
            </div>
        </div>
    );
};

export default UserLayout;
