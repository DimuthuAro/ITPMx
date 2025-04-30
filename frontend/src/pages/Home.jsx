import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="bg-gray-100 min-h-screen">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center">
                        <div className="md:w-1/2 mb-10 md:mb-0">
                            <h1 className="text-4xl md:text-5xl font-bold mb-6">
                                Capture Your Ideas with NoteGenius
                            </h1>
                            <p className="text-xl mb-8">
                                Simple, powerful and beautiful note-taking app. Organize your thoughts, capture ideas, and access them anywhere.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link
                                    to="/dashboard"
                                    className="bg-white text-blue-600 hover:bg-blue-50 font-semibold py-3 px-6 rounded-lg text-center"
                                >
                                    My Notes
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-transparent hover:bg-white hover:text-blue-600 border border-white font-semibold py-3 px-6 rounded-lg text-center"
                                >
                                    Create Account
                                </Link>
                            </div>
                        </div>
                        <div className="md:w-1/2 md:pl-10">
                            <div className="bg-white rounded-lg shadow-xl p-4">
                                <div className="border-b pb-2 mb-3">
                                    <div className="flex items-center">
                                        <div className="h-3 w-3 bg-red-500 rounded-full mr-2"></div>
                                        <div className="h-3 w-3 bg-yellow-500 rounded-full mr-2"></div>
                                        <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                                    </div>
                                </div>
                                <div className="p-2">
                                    <div className="mb-4">
                                        <h3 className="font-bold text-lg text-gray-800">Meeting Notes</h3>
                                        <p className="text-gray-600 text-sm">Updated 2 hours ago</p>
                                    </div>
                                    <div className="text-gray-800 mb-4">
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
                    <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <div className="text-blue-500 mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Create Notes Easily</h3>
                            <p className="text-gray-600">
                                Create notes quickly and easily, with formatting options to organize your thoughts exactly how you want.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <div className="text-blue-500 mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Organize with Categories</h3>
                            <p className="text-gray-600">
                                Group related notes with categories to keep everything organized and easy to find.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <div className="text-blue-500 mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
                            <p className="text-gray-600">
                                Your notes are secure and private, accessible only to you unless you choose to share them.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-gray-800 text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-6">Ready to start taking better notes?</h2>
                    <p className="text-xl mb-8 max-w-2xl mx-auto">
                        Join thousands of users who use NoteGenius to organize their thoughts, ideas, and tasks.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/register"
                            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg"
                        >
                            Sign Up - It's Free
                        </Link>
                        <Link
                            to="/login"
                            className="bg-transparent hover:bg-white hover:text-gray-800 border border-white font-semibold py-3 px-8 rounded-lg"
                        >
                            Log In
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-8">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="mb-4 md:mb-0">
                            <h2 className="text-2xl font-bold">NoteGenius</h2>
                            <p className="text-gray-400">Your personal note-taking solution</p>
                        </div>
                        <div className="flex gap-4">
                            <a href="#" className="text-gray-400 hover:text-white">
                                Terms
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white">
                                Privacy
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white">
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
