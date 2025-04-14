import { useState, useEffect } from 'react';
import { FaBell, FaSearch, FaUser, FaSun, FaMoon, FaCog } from 'react-icons/fa';
import api from '../../services/api';
import { useAuth } from '../../services/UseAuth.jsx';

const Header = () => {
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notificationCount, setNotificationCount] = useState(0);
    const [notifications, setNotifications] = useState([]);
    const [user, setUser] = useState({});
    const { currentUser } = useAuth();

    useEffect(() => {
        setUser(currentUser.data);
    }, [currentUser]);

    useEffect(() => {
        // Fetch notifications
        api.get('/notifications')
            .then(response => {
                setNotifications(response.data.notifications);
                setNotificationCount(response.data.notifications.length);
            })
            .catch(error => {
                console.error('Error fetching notifications:', error);
            });
    }, []);


    const getFristLettersFromName = (name) => {
        if (!name) return '';
        const names = name.split(' ');
        return names.map(n => n.charAt(0).toUpperCase()).join('');
    }

    return (
        <header className="fixed top-0 left-0 right-0 h-16 bg-gradient-to-r from-indigo-950/90 via-purple-950/90 to-indigo-950/90 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-4 py-2 z-40 shadow-lg">
            {/* Logo */}
            <div className="flex items-center">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                        <span className="text-white text-sm font-bold">IT</span>
                    </div>
                    <span className="hidden md:block text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                        ITPM Project
                    </span>
                </div>
            </div>

            {/* Search */}
            <div className="hidden md:flex flex-1 max-w-xl mx-4">
                <div className="relative w-full">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <FaSearch className="w-4 h-4 text-blue-400" />
                    </div>
                    <input
                        type="search"
                        className="block w-full px-10 py-2 bg-white/5 border border-indigo-500/30 rounded-lg text-sm placeholder-indigo-300 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-transparent transition-all duration-200"
                        placeholder="Search..."
                    />
                    <button className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <span className="text-xs text-indigo-300 bg-indigo-900/50 px-2 py-0.5 rounded-md">Ctrl K</span>
                    </button>
                </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center space-x-4">
                <button className="p-2 text-indigo-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                    <FaSun className="w-5 h-5" />
                </button>

                {/* Notifications */}
                <div className="relative">
                    <button 
                        className="p-2 text-indigo-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors relative"
                        onClick={() => setShowNotifications(!showNotifications)}
                    >
                        <FaBell className="w-5 h-5" />
                        {notificationCount > 0 && (
                            <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-xs flex items-center justify-center rounded-full">
                                {notificationCount}
                            </span>
                        )}
                    </button>

                    {showNotifications && (
                        <div className="absolute right-0 mt-2 w-80 bg-gradient-to-br from-indigo-950/95 to-purple-950/95 border border-indigo-500/20 rounded-xl shadow-xl z-50 backdrop-blur-md animate-fade-in">
                            <div className="p-4 border-b border-white/10">
                                <h3 className="text-white font-bold">Notifications</h3>
                            </div>
                            <div className="max-h-96 overflow-y-auto">
                                {notifications.map((notification, index) => (
                                    <div key={index} className="p-4 border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <div className="flex items-start">
                                            <div className="bg-blue-500/20 p-2 rounded-lg mr-3">
                                                <FaUser className="text-blue-400" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-white">{notification.message}</p>
                                                <p className="text-xs text-indigo-300 mt-1">{notification.time}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="p-3 text-center border-t border-white/10">
                                <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                                    View all notifications
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Profile */}
                <div className="relative">
                    <button 
                        className="flex items-center space-x-2 text-indigo-300 hover:text-white rounded-lg transition-colors"
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                    >
                        <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg">
                            <span className="font-medium text-sm">{getFristLettersFromName(user.username)}</span>
                        </div>
                        <span className="hidden md:block text-sm font-medium">{user.name}</span>
                    </button>

                    {showProfileMenu && (
                        <div className="absolute right-0 mt-2 w-60 bg-gradient-to-br from-indigo-950/95 to-purple-950/95 border border-indigo-500/20 rounded-xl shadow-xl z-50 backdrop-blur-md animate-fade-in">
                            <div className="p-4 border-b border-white/10">
                                <h3 className="text-white font-medium">{user.name}</h3>
                                <p className="text-xs text-indigo-300">{user.email}</p>
                            </div>
                            <div className="p-2">
                                <button className="w-full text-left px-4 py-2 text-sm text-indigo-200 hover:bg-white/10 rounded-lg transition-colors flex items-center">
                                    <FaUser className="mr-3 text-indigo-400" /> My Profile
                                </button>
                                <button className="w-full text-left px-4 py-2 text-sm text-indigo-200 hover:bg-white/10 rounded-lg transition-colors flex items-center">
                                    <FaCog className="mr-3 text-indigo-400" /> Settings
                                </button>
                                <div className="border-t border-white/10 my-2"></div>
                                <button className="w-full text-left px-4 py-2 text-sm text-red-300 hover:bg-red-500/10 rounded-lg transition-colors flex items-center">
                                    <FaUser className="mr-3 text-red-400" /> Sign Out
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;