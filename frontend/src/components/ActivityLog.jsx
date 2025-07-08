import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, User, Activity } from 'lucide-react';
import { useTaskStore } from '../Store/TaskStore';

const ActivityLog = () => {
  const { actions, fetchActions } = useTaskStore();

  useEffect(() => {
    fetchActions();
  }, [fetchActions]);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const getActionIcon = (type) => {
    switch (type) {
      case 'create':
        return '➕';
      case 'update':
        return '✏️';
      case 'delete':
        return '🗑️';
      case 'assign':
        return '👤';
      case 'status-change':
        return '🔄';
      case 'priority-change':
        return '⚡';
      default:
        return '📝';
    }
  };

  const getActionColor = (type) => {
    switch (type) {
      case 'create':
        return 'text-green-600';
      case 'update':
        return 'text-blue-600';
      case 'delete':
        return 'text-red-600';
      case 'assign':
        return 'text-purple-600';
      case 'status-change':
        return 'text-orange-600';
      case 'priority-change':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-gray-600" />
        <h2 className="text-lg font-semibold text-gray-900">Activity Log</h2>
      </div>

      <div className="space-y-3 max-h-[375px] overflow-y-auto">
        <AnimatePresence>
          {actions.map((action, index) => (
            <motion.div
              key={action._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex-shrink-0">
                <span className="text-lg">{getActionIcon(action.type)}</span>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">
                    {action.user?.name || 'Unknown User'}
                  </span>
                </div>
                
                <p className={`text-sm ${getActionColor(action.type)} font-medium`}>
                  {action.description}
                </p>
                
                <div className="flex items-center gap-2 mt-2">
                  <Clock className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-500">
                    {formatTime(action.createdAt)}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {actions.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Activity className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No activity yet</p>
            <p className="text-xs">Actions will appear here as they happen</p>
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          Shows last 20 actions • Updates in real-time
        </p>
      </div>
    </div>
  );
};

export default ActivityLog; 