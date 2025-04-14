import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../header';
import Footer from '../footer';
import Sidebar from '../sidebar';

const AppContainer = () => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    // Handle window resize to detect mobile view
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (mobile) setIsSidebarCollapsed(true);
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Initial check
        
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Toggle sidebar visibility
    const toggleSidebar = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed);
    };

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950">
            {/* Decorative background elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-64 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
                <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-600/5 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-64 left-1/3 w-96 h-96 bg-indigo-600/5 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
            </div>

            {/* Header */}
            <Header toggleSidebar={toggleSidebar} isSidebarCollapsed={isSidebarCollapsed} />
            
            {/* Main Content */}
            <div className="flex flex-1 pt-16">
                {/* Sidebar */}
                <Sidebar collapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} />
                
                {/* Main Content Area */}
                <main 
                    className={`flex-1 transition-all duration-300 ease-in-out relative z-10 min-h-[calc(100vh-4rem)] ${
                        isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'
                    }`}
                >
                    <div className="p-6">
                        <Outlet />
                    </div>
                </main>
            </div>
            
            {/* Footer */}
            <Footer />
        </div>
    );
};

export default AppContainer; 