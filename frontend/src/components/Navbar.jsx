import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { currentUser, logout, isAuthenticated, isAdmin } = useAuth();

    const handleLogout = () => {
        logout();
    };

    return (
        <nav className="bg-gray-900 border-b border-gray-800 shadow-lg">
            <div className="container mx-auto px-6 py-3 flex justify-between items-center">
                <div className="text-blue-400 font-bold text-xl">NoteGeniusª«ª­</div>
                <div>
                    <ul className="flex space-x-4">
                        <li>
                            <Link to="/" className="text-gray-300 hover:text-blue-400 transition duration-200">Home</Link>
                        </li>

                        {isAuthenticated ? (
                            <>
                                <li>
                                    <Link to="/dashboard" className="text-gray-300 hover:text-blue-400 transition duration-200">Dashboard</Link>
                                </li>
                                
                                <li>
                                    <Link to="/tickets" className="text-gray-300 hover:text-blue-400 transition duration-200">Support Tickets</Link>
                                </li>
                                
                                <li>
                                    <Link to="/pricing" className="text-gray-300 hover:text-blue-400 transition duration-200">Pricing</Link>
                                </li>
                                <li>
                                    <Link to="/profile" className="text-gray-300 hover:text-blue-400 transition duration-200">Profile</Link>
                                </li>
                                <li>
                                    <Link to="/faq" className="text-gray-300 hover:text-blue-400 transition duration-200">FAQ</Link>
                                </li>
                                {isAdmin && (
                                    <li>
                                        <Link to="/admin" className="text-gray-300 hover:text-blue-400 transition duration-200">Admin</Link>
                                    </li>
                                )}
                                
                                <li>
                                    <button onClick={handleLogout} className="text-gray-300 hover:text-blue-400 transition duration-200">Logout</button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <Link to="/login" className="text-gray-300 hover:text-blue-400 transition duration-200">Login</Link>
                                </li>
                                <li>
                                    <Link to="/register" className="text-gray-300 hover:text-blue-400 transition duration-200">Register</Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
