import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../Store/AuthStore';
import { socketManager } from '../lib/socket';
import KanbanBoard from './KanbanBoard';
import { LogOut, Wifi, WifiOff } from 'lucide-react';

const Initial = () => {
  const { authUser, logout } = useAuthStore();
  const [socketStatus, setSocketStatus] = useState('disconnected');

  useEffect(() => {
    // Connect to Socket.IO when component mounts
    if (authUser) {
      // Get JWT token from cookies
      const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
      };
      
      const token = getCookie('jwt');
      if (token) {
        console.log('🔌 Attempting to connect to Socket.IO...');
        const socket = socketManager.connect(token);
        
        socket.on('connect', () => {
          console.log('✅ Socket.IO Connected Successfully!');
          setSocketStatus('connected');
        });
        
        socket.on('disconnect', () => {
          console.log('❌ Socket.IO Disconnected');
          setSocketStatus('disconnected');
        });
        
        socket.on('connect_error', (error) => {
          console.error('❌ Socket.IO Connection Error:', error);
          setSocketStatus('error');
        });
      } else {
        console.log('❌ No JWT token found in cookies');
      }
    }

    // Cleanup on unmount
    return () => {
      socketManager.disconnect();
    };
  }, [authUser]);

  const handleLogout = async () => {
    await logout();
    socketManager.disconnect();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-950 shadow-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-white">
                Collaborative Todo App
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Socket.IO Status Indicator */}
              <div className="flex items-center gap-2 px-3 py-1 rounded-full text-sm">
                {socketStatus === 'connected' ? (
                  <div className="flex items-center gap-1 text-green-400">
                    <Wifi className="w-4 h-4" />
                    <span>Live</span>
                  </div>
                ) : socketStatus === 'error' ? (
                  <div className="flex items-center gap-1 text-red-400">
                    <WifiOff className="w-4 h-4" />
                    <span>Offline</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-yellow-400">
                    <WifiOff className="w-4 h-4" />
                    <span>Connecting...</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {authUser?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm text-white">{authUser?.name}</span>
              </div>
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-sm text-white hover:text-gray-200 hover:bg-gray-800 rounded-md transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <KanbanBoard />
      </main>
    </div>
  );
};

export default Initial;
