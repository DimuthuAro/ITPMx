import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaInfo, FaEnvelope, FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const navItems = [
        { path: '/', icon: <FaHome className="mr-2" />, text: 'Home' },
        { path: '/about', icon: <FaInfo className="mr-2" />, text: 'About' },
        { path: '/contact', icon: <FaEnvelope className="mr-2" />, text: 'Contact' },
    ];

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className="bg-gradient-to-r from-indigo-950/90 via-purple-950/90 to-indigo-950/90 backdrop-blur-md text-white shadow-lg fixed top-16 left-0 right-0 z-30 border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-12">
                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button 
                            className="text-indigo-200 hover:text-white focus:outline-none"
                            onClick={toggleMenu}
                        >
                            {isOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
                        </button>
                    </div>

                    {/* Desktop menu */}
                    <div className="hidden md:flex md:items-center">
                        <div className="flex space-x-1">
                            {navItems.map((item) => {
                                const isActive = location.pathname === item.path;
                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={`
                                            px-4 py-1.5 rounded-lg text-sm font-medium flex items-center transition-all duration-200
                                            ${isActive 
                                                ? 'bg-gradient-to-r from-blue-600/20 to-indigo-600/20 text-white border-b-2 border-indigo-500' 
                                                : 'text-indigo-200 hover:bg-white/10 hover:text-white border-b-2 border-transparent'
                                            }
                                        `}
                                    >
                                        {item.icon}
                                        {item.text}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right section placeholder for potential future elements */}
                    <div className="hidden md:block">
                        {/* Can be used for additional navigation elements */}
                    </div>
                </div>
            </div>

            {/* Mobile menu, show/hide based on menu state */}
            <div className={`md:hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-indigo-950/90 border-t border-white/10">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`
                                    block px-3 py-2 rounded-lg text-base font-medium flex items-center transition-all duration-200
                                    ${isActive 
                                        ? 'bg-gradient-to-r from-blue-600/20 to-indigo-600/20 text-white' 
                                        : 'text-indigo-200 hover:bg-white/10 hover:text-white'
                                    }
                                `}
                                onClick={() => setIsOpen(false)}
                            >
                                {item.icon}
                                {item.text}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;