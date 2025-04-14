import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../services/UseAuth.jsx';
import api from '../../services/api.js';
import { 
  FaStickyNote, FaTicketAlt, FaUser,
  FaChartLine, FaClipboardCheck, FaBell, FaCalendarAlt,
  FaSpinner
} from 'react-icons/fa';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [userStats, setUserStats] = useState({
    myNotes: 0,
    myTickets: 0,
    openTickets: 0,
    completedTickets: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [activityLoading, setActivityLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        // Fetch real stats for the current user from the API
        const responses = await Promise.all([
          api.get('/api/notes/user'),
          api.get('/api/tickets/user'),
          api.get('/api/tickets/user/status/open'),
          api.get('/api/tickets/user/status/completed')
        ]);
        
        setUserStats({
          myNotes: responses[0].data.length,
          myTickets: responses[1].data.length,
          openTickets: responses[2].data.length,
          completedTickets: responses[3].data.length
        });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user dashboard stats:', err);
        setError('Failed to load your dashboard statistics. Please try again later.');
        setLoading(false);
        
        // Fallback to some default values if API fails
        setUserStats({
          myNotes: 0,
          myTickets: 0,
          openTickets: 0,
          completedTickets: 0
        });
      }
    };

    const fetchUserActivity = async () => {
      try {
        setActivityLoading(true);
        // Fetch recent activity for current user from the API
        const response = await api.get('/api/activity/user');
        setRecentActivity(response.data);
        setActivityLoading(false);
      } catch (err) {
        console.error('Error fetching user activity:', err);
        // Fallback to empty activity list
        setRecentActivity([]);
        setActivityLoading(false);
      }
    };

    // Execute both fetches
    fetchUserData();
    fetchUserActivity();
    
    // Set up a refresh interval (every 5 minutes)
    const refreshInterval = setInterval(() => {
      fetchUserData();
      fetchUserActivity();
    }, 5 * 60 * 1000);
    
    // Clean up interval on component unmount
    return () => clearInterval(refreshInterval);
  }, []);

  // Stat cards data
  const statCards = [
    { 
      title: 'My Notes', 
      count: userStats.myNotes, 
      icon: <FaStickyNote className="text-yellow-400" size={24} />,
      link: '/user/notes',
      color: 'from-yellow-500/20 to-amber-500/20',
      textColor: 'text-yellow-300'
    },
    { 
      title: 'My Tickets', 
      count: userStats.myTickets, 
      icon: <FaTicketAlt className="text-purple-400" size={24} />,
      link: '/user/tickets',
      color: 'from-purple-500/20 to-pink-500/20',
      textColor: 'text-purple-300'
    },
    { 
      title: 'Open Tickets', 
      count: userStats.openTickets, 
      icon: <FaTicketAlt className="text-blue-400" size={24} />,
      link: '/user/tickets?status=open',
      color: 'from-blue-500/20 to-indigo-500/20',
      textColor: 'text-blue-300'
    },
    { 
      title: 'Completed', 
      count: userStats.completedTickets, 
      icon: <FaTicketAlt className="text-green-400" size={24} />,
      link: '/user/tickets?status=completed',
      color: 'from-green-500/20 to-emerald-500/20',
      textColor: 'text-green-300'
    }
  ];

  // Fallback recent activity data if API fails
  const fallbackActivity = [
    { id: 1, type: 'note', action: 'You created a new note', time: '10 minutes ago', icon: <FaStickyNote className="text-yellow-400" /> },
    { id: 2, type: 'ticket', action: 'You submitted a new ticket', time: '30 minutes ago', icon: <FaTicketAlt className="text-purple-400" /> },
    { id: 3, type: 'ticket', action: 'Your ticket was updated', time: '1 hour ago', icon: <FaTicketAlt className="text-blue-400" /> },
    { id: 4, type: 'profile', action: 'You updated your profile', time: '2 hours ago', icon: <FaUser className="text-green-400" /> },
  ];

  // Activity data with icon mapping
  const getActivityIcon = (type) => {
    switch (type) {
      case 'note': return <FaStickyNote className="text-yellow-400" />;
      case 'ticket': return <FaTicketAlt className="text-purple-400" />;
      case 'profile': return <FaUser className="text-green-400" />;
      default: return <FaBell className="text-gray-400" />;
    }
  };

  // Quick links
  const quickLinks = [
    { title: 'Create Note', icon: <FaStickyNote />, link: '/user/notes/create', color: 'bg-yellow-500/20 text-yellow-300' },
    { title: 'Submit Ticket', icon: <FaTicketAlt />, link: '/user/tickets/create', color: 'bg-purple-500/20 text-purple-300' },
    { title: 'My Profile', icon: <FaUser />, link: '/user/profile', color: 'bg-blue-500/20 text-blue-300' },
    { title: 'Calendar', icon: <FaCalendarAlt />, link: '/user/calendar', color: 'bg-green-500/20 text-green-300' },
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
          My Dashboard
        </h1>
        <p className="text-gray-400 mt-2">
          Welcome{currentUser ? `, ${currentUser.name || currentUser.email || 'User'}` : ''}! Here's an overview of your activity.
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
                <div className="text-xs text-gray-400">View all</div>
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
              My Recent Activity
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
              Quick Actions
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