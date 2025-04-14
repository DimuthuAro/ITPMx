import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../services/UseAuth.jsx';

const Navbar = () => {
  const location = useLocation();
  const [userRole, setUserRole] = useState('user');
  const { logout } = useAuth();
  
  // Get user data from localStorage
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUserRole(parsedUser.role || 'user');
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  // Define navigation links for each role
  const adminLinks = [
    { path: '/admin/dashboard', label: 'Dashboard' },
    { path: '/admin/users', label: 'Users' },
    { path: '/admin/notes', label: 'Notes' },
    { path: '/admin/tickets', label: 'Tickets' },
    { path: '/admin/payments', label: 'Payments' }
  ];

  const userLinks = [
    { path: '/user/dashboard', label: 'Dashboard' },
    { path: '/user/profile', label: 'Profile' },
    { path: '/user/notes', label: 'My Notes' },
    { path: '/user/tickets', label: 'My Tickets' }
  ];

  // Choose links based on role
  const navLinks = userRole === 'admin' ? adminLinks : userLinks;

  return (
    <nav className="bg-[#101649] backdrop-blur-lg overflow-hidden flex justify-center h-[60px] pt-4 pb-2.5">
      <ul className="flex">
        {navLinks.map((link, index) => (
          <li key={link.path} className={`inline-block p-4 ${index !== navLinks.length - 1 ? 'border-r border-gray-700' : ''}`}>
            <Link 
              to={link.path} 
              className={`text-white no-underline px-5 py-3.5 hover:font-bold ${
                location.pathname === link.path ? 'font-bold text-blue-300' : ''
              }`}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;