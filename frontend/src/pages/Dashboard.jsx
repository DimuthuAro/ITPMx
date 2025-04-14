import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../services/UseAuth.jsx';
import { 
  FaUsers, FaStickyNote, FaCreditCard, FaTicketAlt,
  FaChartLine, FaClipboardCheck, FaBell, FaCalendarAlt
} from 'react-icons/fa';
import axios from 'axios';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({
    users: 0,
    notes: 0,
    payments: 0,
    tickets: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // In a real app, you would fetch these stats from your API
        // For now, we'll use mock data or could fetch from real endpoints
        
        // Uncomment this in production with real API
        // const responses = await Promise.all([
        //   axios.get('http://localhost:3000/api/users/count'),
        //   axios.get('http://localhost:3000/api/notes/count'),
        //   axios.get('http://localhost:3000/api/payments/count'),
        //   axios.get('http://localhost:3000/api/tickets/count')
        // ]);
        
        // setStats({
        //   users: responses[0].data.count,
        //   notes: responses[1].data.count,
        //   payments: responses[2].data.count,
        //   tickets: responses[3].data.count
        // });
        
        // Mock data for development
        setTimeout(() => {
          setStats({
            users: 24,
            notes: 58,
            payments: 36,
            tickets: 12
          });
          setLoading(false);
        }, 500);
        
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError('Failed to load dashboard data.');
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Stat cards data
  const statCards = [
    { 
      title: 'Users', 
      count: stats.users, 
      icon: <FaUsers className="text-blue-400" size={24} />,
      link: '/users',
      color: 'from-blue-500/20 to-indigo-500/20',
      textColor: 'text-blue-300'
    },
    { 
      title: 'Notes', 
      count: stats.notes, 
      icon: <FaStickyNote className="text-yellow-400" size={24} />,
      link: '/notes',
      color: 'from-yellow-500/20 to-amber-500/20',
      textColor: 'text-yellow-300'
    },
    { 
      title: 'Payments', 
      count: stats.payments, 
      icon: <FaCreditCard className="text-green-400" size={24} />,
      link: '/payments',
      color: 'from-green-500/20 to-emerald-500/20',
      textColor: 'text-green-300'
    },
    { 
      title: 'Tickets', 
      count: stats.tickets, 
      icon: <FaTicketAlt className="text-purple-400" size={24} />,
      link: '/tickets',
      color: 'from-purple-500/20 to-pink-500/20',
      textColor: 'text-purple-300'
    }
  ];

  // Activity feed mock data
  const recentActivity = [
    { id: 1, type: 'user', action: 'New user registered', time: '10 minutes ago', icon: <FaUsers className="text-blue-400" /> },
    { id: 2, type: 'note', action: 'New note created', time: '30 minutes ago', icon: <FaStickyNote className="text-yellow-400" /> },
    { id: 3, type: 'payment', action: 'Payment processed', time: '1 hour ago', icon: <FaCreditCard className="text-green-400" /> },
    { id: 4, type: 'ticket', action: 'Ticket resolved', time: '2 hours ago', icon: <FaTicketAlt className="text-purple-400" /> },
  ];

  // Quick links
  const quickLinks = [
    { title: 'Analytics', icon: <FaChartLine />, link: '#', color: 'bg-blue-500/20 text-blue-300' },
    { title: 'Tasks', icon: <FaClipboardCheck />, link: '#', color: 'bg-green-500/20 text-green-300' },
    { title: 'Notifications', icon: <FaBell />, link: '#', color: 'bg-yellow-500/20 text-yellow-300' },
    { title: 'Calendar', icon: <FaCalendarAlt />, link: '#', color: 'bg-purple-500/20 text-purple-300' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 left-1/3 w-96 h-96 bg-blue-600/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-1/2 -right-32 w-96 h-96 bg-purple-600/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          Dashboard
        </h1>
        <p className="text-gray-400 mt-2">
          Welcome back{currentUser ? `, ${currentUser.name || 'User'}` : ''}! Here's an overview of your system.
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {loading ? (
          // Loading skeleton for stats
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="bg-white/5 backdrop-blur-sm rounded-xl shadow-xl border border-white/10 overflow-hidden animate-pulse">
              <div className="p-6 h-32"></div>
            </div>
          ))
        ) : (
          // Stats cards
          statCards.map((stat, index) => (
            <Link 
              to={stat.link} 
              key={index}
              className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-xl border border-white/10 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className={`p-6 bg-gradient-to-br ${stat.color} flex flex-col`}>
                <div className="flex justify-between items-start mb-4">
                  <div className={`font-semibold ${stat.textColor}`}>
                    {stat.title}
                  </div>
                  <div className="p-2 bg-white/10 backdrop-blur-sm rounded-lg">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stat.count}</div>
                <div className="text-xs text-gray-400">View all {stat.title.toLowerCase()}</div>
              </div>
            </Link>
          ))
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-xl border border-white/10 overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-4">
              Recent Activity
            </h2>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  <div className="p-2 bg-white/10 rounded-lg mr-4">
                    {activity.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-white">{activity.action}</div>
                    <div className="text-xs text-gray-400">{activity.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-xl border border-white/10 overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-4">
              Quick Links
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {quickLinks.map((link, index) => (
                <Link 
                  key={index} 
                  to={link.link}
                  className={`flex flex-col items-center justify-center p-4 rounded-lg ${link.color} transition-all duration-300 hover:scale-105`}
                >
                  <div className="text-2xl mb-2">{link.icon}</div>
                  <div className="text-sm font-medium">{link.title}</div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200">
          {error}
        </div>
      )}
    </div>
  );
};

export default Dashboard; 