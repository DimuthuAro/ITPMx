import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  FaTimes
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
  
  const menuItems = [
    { icon: <FaHome />, label: 'Dashboard', to: '/dashboard' },
    { icon: <FaUsers />, label: 'User Management', to: '/users' },
    { icon: <FaTicketAlt />, label: 'Tickets', to: '/tickets' },
    { icon: <FaMoneyBillWave />, label: 'Payments', to: '/payments' },
    { icon: <FaChartBar />, label: 'Analytics', to: '/analytics' },
    { icon: <FaBell />, label: 'Notifications', to: '/notifications' },
    { icon: <FaCog />, label: 'Settings', to: '/settings' },
  ];

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
            <Link to="/" className="flex items-center">
              <div className="h-10 w-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <span className="text-white font-bold text-lg">IT</span>
              </div>
              <h1 className="ml-3 text-xl font-semibold text-white">ITPM System</h1>
            </Link>
          )}
          {collapsed && (
            <Link to="/" className="mx-auto">
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
          <Link
            to="/logout"
            className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-200"
          >
            <span className="text-lg"><FaSignOutAlt /></span>
            {!collapsed && <span className="font-medium">Sign Out</span>}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 