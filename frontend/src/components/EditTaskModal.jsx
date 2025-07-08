import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Flag, AlertTriangle } from 'lucide-react';
import { useTaskStore } from '../Store/TaskStore';

const EditTaskModal = ({ task, onClose, onSuccess }) => {
  const { updateTask, isUpdating } = useTaskStore();
  const [formData, setFormData] = useState({
    title: task.title,
    description: task.description,
    priority: task.priority,
    dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
  });
  const [conflict, setConflict] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim()) {
      return;
    }

    try {
      await updateTask(task._id, {
        ...formData,
        version: task.version,
        dueDate: formData.dueDate ? new Date(formData.dueDate) : null,
      });
      onSuccess();
    } catch (error) {
      if (error.response?.status === 409) {
        // Conflict detected
        setConflict({
          currentVersion: error.response.data.currentVersion,
          serverTask: error.response.data.serverTask,
        });
      } else {
        console.error('Update task error:', error);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resolveConflict = async (useServerVersion = false) => {
    try {
      if (useServerVersion) {
        // Use server version
        setFormData({
          title: conflict.serverTask.title,
          description: conflict.serverTask.description,
          priority: conflict.serverTask.priority,
          dueDate: conflict.serverTask.dueDate ? new Date(conflict.serverTask.dueDate).toISOString().split('T')[0] : '',
        });
      }
      
      await updateTask(task._id, {
        ...formData,
        version: conflict.currentVersion,
        dueDate: formData.dueDate ? new Date(formData.dueDate) : null,
      });
      
      setConflict(null);
      onSuccess();
    } catch (error) {
      console.error('Resolve conflict error:', error);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Edit Task</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Conflict Resolution */}
          {conflict && (
            <div className="p-6 border-b bg-yellow-50">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                <h3 className="font-medium text-yellow-800">Conflict Detected</h3>
              </div>
              <p className="text-sm text-yellow-700 mb-4">
                This task has been modified by another user. Choose how to resolve the conflict:
              </p>
              <div className="space-y-2">
                <button
                  onClick={() => resolveConflict(false)}
                  className="w-full px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Use My Changes
                </button>
                <button
                  onClick={() => resolveConflict(true)}
                  className="w-full px-3 py-2 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                  Use Server Version
                </button>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter task title"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description * (min 15 characters)
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter task description"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.description.length}/15 characters minimum
              </p>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <div className="flex items-center gap-2">
                <Flag className="w-4 h-4 text-gray-400" />
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date
              </label>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Actions */}
            {!conflict && (
              <div className="flex items-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating || !formData.title.trim() || formData.description.length < 15}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdating ? 'Updating...' : 'Update Task'}
                </button>
              </div>
            )}
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EditTaskModal; 