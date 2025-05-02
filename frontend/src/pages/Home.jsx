import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
    const { isAuthenticated } = useAuth();
    
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center">
                        <div className="md:w-1/2 mb-10 md:mb-0">
                            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                                Capture Your Ideas with NoteGenius
                            </h1>
                            <p className="text-xl mb-8 text-gray-300">
                                Simple, powerful and beautiful note-taking app. Organize your thoughts, capture ideas, and access them anywhere.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                {isAuthenticated ? (
                                    <Link
                                        to="/dashboard"
                                        className="bg-blue-600/90 hover:bg-blue-700/90 text-white backdrop-blur-sm font-semibold py-3 px-6 rounded-lg text-center"
                                    >
                                        My Notes
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            to="/login"
                                            className="bg-blue-600/90 hover:bg-blue-700/90 text-white backdrop-blur-sm font-semibold py-3 px-6 rounded-lg text-center"
                                        >
                                            Log In
                                        </Link>
                                        <Link
                                            to="/register"
                                            className="bg-transparent hover:bg-white/10 border border-white/60 backdrop-blur-sm font-semibold py-3 px-6 rounded-lg text-center text-white"
                                        >
                                            Create Account
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="md:w-1/2 md:pl-10">
                            <div className="bg-gray-800/90 backdrop-blur-sm border border-gray-700 rounded-lg shadow-xl p-4">
                                <div className="border-b border-gray-700 pb-2 mb-3">
                                    <div className="flex items-center">
                                        <div className="h-3 w-3 bg-red-500 rounded-full mr-2"></div>
                                        <div className="h-3 w-3 bg-yellow-500 rounded-full mr-2"></div>
                                        <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                                    </div>
                                </div>
                                <div className="p-2">
                                    <div className="mb-4">
                                        <h3 className="font-bold text-lg text-gray-200">Meeting Notes</h3>
                                        <p className="text-gray-400 text-sm">Updated 2 hours ago</p>
                                    </div>
                                    <div className="text-gray-300 mb-4">
                                        <p>• Discuss project timeline</p>
                                        <p>• Review design mockups</p>
                                        <p>• Assign tasks to team members</p>
                                        <p>• Schedule next check-in meeting</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12 text-white">Key Features</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-gray-800/90 backdrop-blur-sm border border-gray-700 p-6 rounded-lg shadow-md">
                            <div className="text-blue-400 mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-gray-200">Create Notes Easily</h3>
                            <p className="text-gray-400">
                                Create notes quickly and easily, with formatting options to organize your thoughts exactly how you want.
                            </p>
                        </div>

                        <div className="bg-gray-800/90 backdrop-blur-sm border border-gray-700 p-6 rounded-lg shadow-md">
                            <div className="text-blue-400 mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-gray-200">Organize with Categories</h3>
                            <p className="text-gray-400">
                                Group related notes with categories to keep everything organized and easy to find.
                            </p>
                        </div>

                        <div className="bg-gray-800/90 backdrop-blur-sm border border-gray-700 p-6 rounded-lg shadow-md">
                            <div className="text-blue-400 mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-gray-200">Secure & Private</h3>
                            <p className="text-gray-400">
                                Your notes are secure and private, accessible only to you unless you choose to share them.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Support Section - New */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-lg p-8">
                        <div className="flex flex-col md:flex-row items-center">
                            <div className="md:w-1/2 mb-6 md:mb-0">
                                <h2 className="text-3xl font-bold mb-4 text-white">Need Help?</h2>
                                <p className="text-gray-300 mb-6">
                                    Our support team is always ready to assist you with any questions or issues you might have.
                                </p>
                                {isAuthenticated ? (
                                    <Link to="/tickets" className="bg-green-600/90 hover:bg-green-700/90 text-white font-semibold py-3 px-6 rounded-lg inline-flex items-center backdrop-blur-sm">
                                        <span>Access Support</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="ml-2">
                                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0-11a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h1.5a.5.5 0 0 0 0-1H8V5a1 1 0 0 0-1-1z"/>
                                        </svg>
                                    </Link>
                                ) : (
                                    <Link to="/login" className="bg-green-600/90 hover:bg-green-700/90 text-white font-semibold py-3 px-6 rounded-lg backdrop-blur-sm">
                                        Login for Support
                                    </Link>
                                )}
                            </div>
                            <div className="md:w-1/2 md:pl-10">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-gray-700/80 backdrop-blur-sm p-4 rounded border border-gray-600">
                                        <h3 className="font-semibold text-blue-300">Fast Response</h3>
                                        <p className="text-gray-400 text-sm">Get help within 24 hours</p>
                                    </div>
                                    <div className="bg-gray-700/80 backdrop-blur-sm p-4 rounded border border-gray-600">
                                        <h3 className="font-semibold text-blue-300">Ticket System</h3>
                                        <p className="text-gray-400 text-sm">Track your support requests</p>
                                    </div>
                                    <div className="bg-gray-700/80 backdrop-blur-sm p-4 rounded border border-gray-600">
                                        <h3 className="font-semibold text-blue-300">Knowledge Base</h3>
                                        <p className="text-gray-400 text-sm">Find answers to common questions</p>
                                    </div>
                                    <div className="bg-gray-700/80 backdrop-blur-sm p-4 rounded border border-gray-600">
                                        <h3 className="font-semibold text-blue-300">Priority Support</h3>
                                        <p className="text-gray-400 text-sm">Available for premium users</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16">
                <div className="container mx-auto px-4 text-center">
                    <div className="bg-gradient-to-r from-blue-900/80 to-purple-900/80 backdrop-blur-sm border border-blue-800/50 rounded-lg p-10">
                        <h2 className="text-3xl font-bold mb-6 text-white">Ready to start taking better notes?</h2>
                        <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-300">
                            Join thousands of users who use NoteGenius to organize their thoughts, ideas, and tasks.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/register"
                                className="bg-blue-500/90 hover:bg-blue-600/90 text-white font-semibold py-3 px-8 rounded-lg backdrop-blur-sm"
                            >
                                Sign Up - It's Free
                            </Link>
                            <Link
                                to="/login"
                                className="bg-transparent hover:bg-white/10 border border-white/60 text-white font-semibold py-3 px-8 rounded-lg backdrop-blur-sm"
                            >
                                Log In
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900/90 backdrop-blur-sm text-white py-8 border-t border-gray-800">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="mb-4 md:mb-0">
                            <h2 className="text-2xl font-bold text-blue-400">NoteGenius</h2>
                            <p className="text-gray-400">Your personal note-taking solution</p>
                        </div>
                        <div className="flex gap-4">
                            <a href="#" className="text-gray-400 hover:text-blue-400 transition duration-200">
                                Terms
                            </a>
                            <a href="#" className="text-gray-400 hover:text-blue-400 transition duration-200">
                                Privacy
                            </a>
                            <a href="#" className="text-gray-400 hover:text-blue-400 transition duration-200">
                                Help
                            </a>
                        </div>
                    </div>
                    <div className="mt-8 text-center text-gray-500 text-sm">
                        &copy; {new Date().getFullYear()} NoteGenius. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
