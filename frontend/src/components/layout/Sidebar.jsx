import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../services/UseAuth.jsx';
import { 
  FaHome, 
  FaUsers, 
  FaTicketAlt, 
  FaMoneyBillWave, 
  FaChartBar, 
  FaCog, 
  FaBell, 
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaUserCircle,
  FaClipboardList,
  FaQuestionCircle,
  FaBookmark
} from 'react-icons/fa';

const MenuItem = ({ icon, label, to, active }) => (
  <Link
    to={to}
    className={`flex items-center space-x-3 px-4 py-3 my-1 rounded-xl transition-all duration-300 ${
      active 
        ? 'bg-white/20 text-white font-medium backdrop-blur-lg shadow-lg' 
        : 'text-gray-300 hover:bg-white/10 hover:text-white'
    }`}
  >
    <span className="text-lg">{icon}</span>
    <span className="font-medium">{label}</span>
  </Link>
);

const Sidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState('user');
  const [username, setUsername] = useState('');
  
  // Get user data from localStorage
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUserRole(parsedUser.role || 'user');
        setUsername(parsedUser.username || parsedUser.email || 'User');
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  // Admin menu items
  const adminMenuItems = [
    { icon: <FaHome />, label: 'Dashboard', to: '/admin/dashboard' },
    { icon: <FaUsers />, label: 'User Management', to: '/admin/users' },
    { icon: <FaTicketAlt />, label: 'Tickets', to: '/admin/tickets' },
    { icon: <FaMoneyBillWave />, label: 'Payments', to: '/admin/payments' },
    { icon: <FaClipboardList />, label: 'Notes', to: '/admin/notes' },
    { icon: <FaChartBar />, label: 'Analytics', to: '/admin/analytics' },
    { icon: <FaCog />, label: 'Settings', to: '/admin/settings' },
  ];
  
  // User menu items
  const userMenuItems = [
    { icon: <FaHome />, label: 'Dashboard', to: '/user/dashboard' },
    { icon: <FaUserCircle />, label: 'My Profile', to: '/user/profile' },
    { icon: <FaTicketAlt />, label: 'My Tickets', to: '/user/tickets' },
    { icon: <FaClipboardList />, label: 'My Notes', to: '/user/notes' },
    { icon: <FaBookmark />, label: 'Saved Items', to: '/user/saved' },
    { icon: <FaQuestionCircle />, label: 'Help & Support', to: '/user/support' },
  ];
  
  // Choose menu items based on user role
  const menuItems = userRole === 'admin' ? adminMenuItems : userMenuItems;

  return (
    <div className={`${collapsed ? 'w-20' : 'w-64'} h-screen fixed left-0 top-0 z-30 transition-all duration-300`}>
      {/* Sidebar background with blur and gradient effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/90 to-purple-900/90 backdrop-blur-xl border-r border-white/10 -z-10"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-10 -right-10 w-20 h-20 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-40 -left-10 w-20 h-20 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      
      <div className="flex flex-col h-full py-6 px-4 overflow-y-auto">
        {/* Sidebar header */}
        <div className="flex items-center justify-between mb-8 px-2">
          {!collapsed && (
            <Link to={userRole === 'admin' ? '/admin/dashboard' : '/user/dashboard'} className="flex items-center">
              <div className="h-10 w-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <span className="text-white font-bold text-lg">IT</span>
              </div>
              <h1 className="ml-3 text-xl font-semibold text-white">ITPM System</h1>
            </Link>
          )}
          {collapsed && (
            <Link to={userRole === 'admin' ? '/admin/dashboard' : '/user/dashboard'} className="mx-auto">
              <div className="h-10 w-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <span className="text-white font-bold text-lg">IT</span>
              </div>
            </Link>
          )}
          <button 
            onClick={() => setCollapsed(!collapsed)} 
            className="text-gray-300 hover:text-white p-1 rounded-lg bg-white/10 hover:bg-white/20"
          >
            {collapsed ? <FaBars /> : <FaTimes />}
          </button>
        </div>
        
        {/* User info */}
        {!collapsed && (
          <div className="mb-6 px-4 py-3 bg-white/10 rounded-xl backdrop-blur-sm">
            <p className="text-white font-medium">{username}</p>
            <p className="text-xs text-gray-300 capitalize">{userRole} Account</p>
          </div>
        )}
        
        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => (
            <MenuItem 
              key={item.to}
              icon={item.icon}
              label={collapsed ? '' : item.label}
              to={item.to}
              active={location.pathname === item.to}
            />
          ))}
        </nav>
        
        {/* Sidebar footer */}
        <div className="pt-4 mt-6 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-200"
          >
            <span className="text-lg"><FaSignOutAlt /></span>
            {!collapsed && <span className="font-medium">Sign Out</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;