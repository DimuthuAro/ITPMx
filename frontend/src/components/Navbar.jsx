import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { currentUser, logout, isAuthenticated, isAdmin } = useAuth();

    const handleLogout = () => {
        logout();
    };

    return (
        <nav className="bg-gray-800 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-white font-bold text-xl">NoteGenius</div>
                <div>
                    <ul className="flex space-x-4">
                        <li>
                            <Link to="/" className="text-gray-300 hover:text-white">Home</Link>
                        </li>

                        {isAuthenticated ? (
                            <>
                                <li>
                                    <Link to="/dashboard" className="text-gray-300 hover:text-white">Dashboard</Link>
                                </li>
                                <li>
                                    <Link to="/notes/create" className="text-gray-300 hover:text-white">Create Note</Link>
                                </li>
                                <li>
                                    <Link to="/profile" className="text-gray-300 hover:text-white">Profile</Link>
                                </li>
                                {isAdmin && (
                                    <li>
                                        <Link to="/admin" className="text-gray-300 hover:text-white">Admin Panel</Link>
                                    </li>
                                )}
                                <li>
                                    <button
                                        onClick={handleLogout}
                                        className="text-gray-300 hover:text-white"
                                    >
                                        Logout
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <Link to="/login" className="text-gray-300 hover:text-white">Login</Link>
                                </li>
                                <li>
                                    <Link to="/register" className="text-gray-300 hover:text-white">Register</Link>
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
