import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
    FaUser, FaStickyNote, FaCreditCard, FaTicketAlt, 
    FaChevronLeft, FaChevronRight, FaSignOutAlt,
    FaTachometerAlt, FaEnvelope, FaChartBar, FaHome, FaUsers, FaCog
} from 'react-icons/fa';
import { useAuth } from '../../services/UseAuth.jsx';

const Sidebar = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [showTooltip, setShowTooltip] = useState(null);
    const location = useLocation();
    const sidebarRef = useRef(null);
    const { currentUser } = useAuth();
    const [ user, setUser ] = useState({});
    
    // Close sidebar on outside click on mobile
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target) && window.innerWidth < 768) {
                setCollapsed(true);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        setUser(currentUser.data);
    }, [currentUser]);

    const getFristLettersFromName = (name) => {
        if (!name) return '';
        const names = name.split(' ');
        return names.map(n => n.charAt(0).toUpperCase()).join('');
    }

    const navItems = currentUser?.role === 'admin' ? [
        { path: '/admin/dashboard', icon: <FaHome />, text: 'Dashboard' },
        { path: '/admin/users', icon: <FaUsers />, text: 'Users' },
        { path: '/admin/settings', icon: <FaCog />, text: 'Settings' },
    ] : [
        { path: '/user/dashboard', icon: <FaHome />, text: 'Dashboard' },
        { path: '/user/profile', icon: <FaUser />, text: 'Profile' },
        { path: '/user/tickets', icon: <FaTicketAlt />, text: 'Tickets' },
    ];

    return (
        <div 
            ref={sidebarRef}
            className={`fixed top-16 left-0 h-screen bg-gradient-to-b from-indigo-950/80 via-purple-950/80 to-indigo-950/80 backdrop-blur-md text-gray-100 transition-all duration-300 ease-in-out z-30 border-r border-white/10 shadow-xl ${
                collapsed ? 'w-20' : 'w-64'
            }`}
        >


            {/* Decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-32 -left-32 w-64 h-64 bg-purple-600/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
                <div className="absolute top-1/2 -right-32 w-64 h-64 bg-blue-600/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-indigo-600/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-indigo-900/20 to-transparent"></div>
            </div>

            <div className="relative h-full flex flex-col p-4">
                {/* Sidebar content */}
                <div className="mt-4 mb-8">
                    <div className={`flex items-center ${collapsed ? 'justify-center' : 'mb-6'}`}>
                        <div className={`w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg ${collapsed ? 'mx-auto' : 'mr-3'} animate-gradient-x`}>
                            <span className="text-white text-xl font-bold">{getFristLettersFromName(user.username) || 'U'}</span>
                        </div>
                        {!collapsed && (
                            <div>
                                <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 animate-gradient-x">
                                    {user?.username || 'User'}
                                </h2>
                                <p className="text-sm text-gray-300">{user?.role || 'Role'}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-grow space-y-1.5 px-1.5">
                    {navItems.map((item) => {
                        const isActive = location.pathname.startsWith(item.path);
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`group flex items-center rounded-xl py-3 px-4 transition-all duration-200 ${
                                    isActive 
                                        ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white shadow-lg shadow-indigo-900/20' 
                                        : 'text-indigo-200 hover:bg-white/10 hover:text-white'
                                }`}
                                onMouseEnter={() => collapsed && setShowTooltip(item.text)}
                                onMouseLeave={() => setShowTooltip(null)}
                            >
                                <div className={`${isActive ? 'text-blue-400' : 'text-indigo-400 group-hover:text-blue-400'} transition-colors ${collapsed ? 'mx-auto text-lg' : ''}`}>
                                    {item.icon}
                                </div>
                                {!collapsed && (
                                    <span className={`ml-4 text-sm font-medium ${isActive ? 'text-blue-100' : 'group-hover:text-blue-100'}`}>
                                        {item.text}
                                    </span>
                                )}
                                {isActive && !collapsed && (
                                    <span className="ml-auto w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
                                )}
                                
                                {/* Tooltip for collapsed state */}
                                {collapsed && showTooltip === item.text && (
                                    <div className="absolute left-20 z-50 px-3 py-2 bg-gray-900/90 backdrop-blur-sm text-white text-sm rounded-md shadow-lg whitespace-nowrap border border-indigo-500/20 animate-fade-in">
                                        {item.text}
                                    </div>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="mt-auto pt-4 border-t border-white/10">
                    <button
                        className="group flex items-center rounded-xl py-3 px-4 w-full text-red-300 hover:bg-red-500/10 hover:text-red-200 transition-all duration-200"
                        onMouseEnter={() => collapsed && setShowTooltip('Sign Out')}
                        onMouseLeave={() => setShowTooltip(null)}
                    >
                        <div className={`text-red-400 group-hover:text-red-300 ${collapsed ? 'mx-auto text-lg' : ''}`}>
                            <FaSignOutAlt />
                        </div>
                        {!collapsed && (
                            <span className="ml-4 text-sm font-medium">
                                Sign Out
                            </span>
                        )}
                        
                        {/* Tooltip for sign out */}
                        {collapsed && showTooltip === 'Sign Out' && (
                            <div className="absolute left-20 z-50 px-3 py-2 bg-gray-900/90 backdrop-blur-sm text-white text-sm rounded-md shadow-lg whitespace-nowrap border border-red-500/20 animate-fade-in">
                                Sign Out
                            </div>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;