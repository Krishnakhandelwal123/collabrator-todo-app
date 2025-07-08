import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit, Trash2, User, Zap, Calendar, Flag } from 'lucide-react';
import { useTaskStore } from '../Store/TaskStore';
import { useAuthStore } from '../Store/AuthStore';
import EditTaskModal from './EditTaskModal';
import toast from 'react-hot-toast';

const TaskCard = ({ task, onDragStart, currentUser }) => {
  const { deleteTask, smartAssignTask } = useTaskStore();
  const [showEditModal, setShowEditModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const priorityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800',
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    setIsDeleting(true);
    try {
      await deleteTask(task._id);
    } catch (error) {
      console.error('Delete error:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSmartAssign = async () => {
    try {
      await smartAssignTask(task._id);
    } catch (error) {
      console.error('Smart assign error:', error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString();
  };

  const isAssignedToMe = task.assignees?.some(assignee => 
    assignee._id === currentUser._id
  );

  return (
    <>
      <motion.div
        draggable
        onDragStart={(e) => onDragStart(e, task)}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.02 }}
        className="bg-white rounded-lg shadow-md p-4 cursor-move hover:shadow-lg transition-shadow"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">
            {task.title}
          </h3>
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowEditModal(true);
              }}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              disabled={isDeleting}
              className="p-1 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-3">
          {task.description}
        </p>

        {/* Priority */}
        <div className="flex items-center gap-2 mb-3">
          <Flag className="w-4 h-4 text-gray-400" />
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}>
            {task.priority}
          </span>
        </div>

        {/* Due Date */}
        {task.dueDate && (
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-600">
              Due: {formatDate(task.dueDate)}
            </span>
          </div>
        )}

        {/* Assignees */}
        <div className="flex items-center gap-2 mb-3">
          <User className="w-4 h-4 text-gray-400" />
          <div className="flex flex-wrap gap-1">
            {task.assignees?.length > 0 ? (
              task.assignees.map((assignee) => (
                <span
                  key={assignee._id}
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    assignee._id === currentUser._id
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {assignee.name}
                </span>
              ))
            ) : (
              <span className="text-xs text-gray-500">Unassigned</span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
          {!isAssignedToMe && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSmartAssign();
              }}
              className="flex items-center gap-1 px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors"
            >
              <Zap className="w-3 h-3" />
              Smart Assign
            </button>
          )}
          
          {task.smartAssigned && (
            <span className="text-xs text-purple-600 font-medium">
              Auto-assigned
            </span>
          )}
        </div>

        {/* Created by */}
        <div className="mt-2 text-xs text-gray-500">
          Created by {task.createdBy?.name || 'Unknown'}
        </div>
      </motion.div>

      {/* Edit Modal */}
      {showEditModal && (
        <EditTaskModal
          task={task}
          onClose={() => setShowEditModal(false)}
          onSuccess={() => {
            setShowEditModal(false);
            toast.success('Task updated successfully!');
          }}
        />
      )}
    </>
  );
};

export default TaskCard; 