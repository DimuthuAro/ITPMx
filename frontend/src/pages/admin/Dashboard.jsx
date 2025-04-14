import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../services/UseAuth.jsx';
import api from '../../services/api';
import { 
  FaUsers, FaStickyNote, FaCreditCard, FaTicketAlt,
  FaChartLine, FaClipboardCheck, FaBell, FaCalendarAlt,
  FaSpinner
} from 'react-icons/fa';

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
  const [recentActivity, setRecentActivity] = useState([]);
  const [activityLoading, setActivityLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // Fetch real stats from the API
        const responses = await Promise.all([
          api.get('/api/users/count'),
          api.get('/api/notes/count'),
          api.get('/api/payments/count'),
          api.get('/api/tickets/count')
        ]);
        
        setStats({
          users: responses[0].data.count,
          notes: responses[1].data.count,
          payments: responses[2].data.count,
          tickets: responses[3].data.count
        });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError('Failed to load dashboard statistics. Please try again later.');
        setLoading(false);
        
        // Fallback to some default values if API fails
        setStats({
          users: 0,
          notes: 0,
          payments: 0,
          tickets: 0
        });
      }
    };

    const fetchActivity = async () => {
      try {
        setActivityLoading(true);
        // Fetch recent activity from the API
        const response = await api.get('/api/activity/recent');
        setRecentActivity(response.data);
        setActivityLoading(false);
      } catch (err) {
        console.error('Error fetching recent activity:', err);
        // Fallback to empty activity list
        setRecentActivity([]);
        setActivityLoading(false);
      }
    };

    // Execute both fetches
    fetchStats();
    fetchActivity();
    
    // Set up a refresh interval (every 5 minutes)
    const refreshInterval = setInterval(() => {
      fetchStats();
      fetchActivity();
    }, 5 * 60 * 1000);
    
    // Clean up interval on component unmount
    return () => clearInterval(refreshInterval);
  }, []);

  // Stat cards data
  const statCards = [
    { 
      title: 'Users', 
      count: stats.users, 
      icon: <FaUsers className="text-blue-400" size={24} />,
      link: '/admin/users',
      color: 'from-blue-500/20 to-indigo-500/20',
      textColor: 'text-blue-300'
    },
    { 
      title: 'Notes', 
      count: stats.notes, 
      icon: <FaStickyNote className="text-yellow-400" size={24} />,
      link: '/admin/notes',
      color: 'from-yellow-500/20 to-amber-500/20',
      textColor: 'text-yellow-300'
    },
    { 
      title: 'Payments', 
      count: stats.payments, 
      icon: <FaCreditCard className="text-green-400" size={24} />,
      link: '/admin/payments',
      color: 'from-green-500/20 to-emerald-500/20',
      textColor: 'text-green-300'
    },
    { 
      title: 'Tickets', 
      count: stats.tickets, 
      icon: <FaTicketAlt className="text-purple-400" size={24} />,
      link: '/admin/tickets',
      color: 'from-purple-500/20 to-pink-500/20',
      textColor: 'text-purple-300'
    }
  ];

  // Fallback recent activity data if API fails
  const fallbackActivity = [
    { id: 1, type: 'user', action: 'New user registered', time: '10 minutes ago', icon: <FaUsers className="text-blue-400" /> },
    { id: 2, type: 'note', action: 'New note created', time: '30 minutes ago', icon: <FaStickyNote className="text-yellow-400" /> },
    { id: 3, type: 'payment', action: 'Payment processed', time: '1 hour ago', icon: <FaCreditCard className="text-green-400" /> },
    { id: 4, type: 'ticket', action: 'Ticket resolved', time: '2 hours ago', icon: <FaTicketAlt className="text-purple-400" /> },
  ];

  // Activity data with icon mapping
  const getActivityIcon = (type) => {
    switch (type) {
      case 'user': return <FaUsers className="text-blue-400" />;
      case 'note': return <FaStickyNote className="text-yellow-400" />;
      case 'payment': return <FaCreditCard className="text-green-400" />;
      case 'ticket': return <FaTicketAlt className="text-purple-400" />;
      default: return <FaBell className="text-gray-400" />;
    }
  };

  // Quick links
  const quickLinks = [
    { title: 'Analytics', icon: <FaChartLine />, link: '/admin/analytics', color: 'bg-blue-500/20 text-blue-300' },
    { title: 'Tasks', icon: <FaClipboardCheck />, link: '/admin/tasks', color: 'bg-green-500/20 text-green-300' },
    { title: 'Notifications', icon: <FaBell />, link: '/admin/notifications', color: 'bg-yellow-500/20 text-yellow-300' },
    { title: 'Calendar', icon: <FaCalendarAlt />, link: '/admin/calendar', color: 'bg-purple-500/20 text-purple-300' },
  ];

  // Function to format date from ISO string
  const formatTime = (isoString) => {
    if (!isoString) return '';
    
    const date = new Date(isoString);
    const now = new Date();
    const diffMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} hours ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString();
  };

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
          Welcome back{currentUser ? `, ${currentUser.name || currentUser.email || 'Admin'}` : ''}! Here's an overview of your system.
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {loading ? (
          // Loading skeleton for stats
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="bg-white/5 backdrop-blur-sm rounded-xl shadow-xl border border-white/10 overflow-hidden animate-pulse">
              <div className="p-6 h-32">
                <div className="flex justify-center items-center h-full">
                  <FaSpinner className="animate-spin text-gray-500" size={24} />
                </div>
              </div>
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
              {activityLoading ? (
                // Loading skeleton for activity
                Array(4).fill(0).map((_, i) => (
                  <div key={i} className="flex items-start p-3 rounded-lg bg-white/5 animate-pulse">
                    <div className="p-2 bg-white/10 rounded-lg mr-4 h-10 w-10"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-white/10 rounded mb-2 w-3/4"></div>
                      <div className="h-3 bg-white/10 rounded w-1/4"></div>
                    </div>
                  </div>
                ))
              ) : recentActivity && recentActivity.length > 0 ? (
                // Real activity data
                recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                    <div className="p-2 bg-white/10 rounded-lg mr-4">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-white">{activity.action}</div>
                      <div className="text-xs text-gray-400">{formatTime(activity.timestamp)}</div>
                    </div>
                  </div>
                ))
              ) : (
                // Fallback to mock data if empty
                fallbackActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                    <div className="p-2 bg-white/10 rounded-lg mr-4">
                      {activity.icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-white">{activity.action}</div>
                      <div className="text-xs text-gray-400">{activity.time}</div>
                    </div>
                  </div>
                ))
              )}
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