import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Users } from 'lucide-react';
import { useTaskStore } from '../Store/TaskStore';
import { useAuthStore } from '../Store/AuthStore';
import TaskCard from './TaskCard';
import CreateTaskModal from './CreateTaskModal';
import ActivityLog from './ActivityLog';
import toast from 'react-hot-toast';

const KanbanBoard = () => {
  const { tasks, fetchTasks, fetchActions, isLoading } = useTaskStore();
  const { authUser } = useAuthStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [draggedTask, setDraggedTask] = useState(null);

  useEffect(() => {
    fetchTasks();
    fetchActions();
  }, [fetchTasks, fetchActions]);

  const columns = [
    { id: 'todo', title: 'To Do', color: 'bg-gray-800' },
    { id: 'in-progress', title: 'In Progress', color: 'bg-blue-900' },
    { id: 'done', title: 'Done', color: 'bg-green-900' },
  ];

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, status) => {
    e.preventDefault();
    if (!draggedTask || draggedTask.status === status) {
      setDraggedTask(null);
      return;
    }

    try {
      await useTaskStore.getState().updateTask(draggedTask._id, {
        status,
        version: draggedTask.version,
      });
      setDraggedTask(null);
    } catch (error) {
      if (error.response?.status === 409) {
        // Conflict detected - refresh tasks
        fetchTasks();
      }
      setDraggedTask(null);
    }
  };

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-200"></div>
      </div>
    );
  }

  return (
    <div className="h-[80vh] bg-gray-900 p-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Collaborative Kanban Board</h1>
            <p className="text-gray-300 mt-2">Welcome back, {authUser?.name}!</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-300">
              <Users className="w-5 h-5" />
              <span>Real-time collaboration</span>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Task
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex gap-6">
        {/* Kanban Columns */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map((column) => (
            <motion.div
              key={column.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`${column.color} rounded-lg p-4 min-h-[500px] border border-gray-800`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">{column.title}</h2>
                <span className="bg-gray-900 px-2 py-1 rounded-full text-sm font-medium text-gray-200 border border-gray-700">
                  {getTasksByStatus(column.id).length}
                </span>
              </div>
              
              <div className="space-y-3">
                {getTasksByStatus(column.id).map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onDragStart={handleDragStart}
                    currentUser={authUser}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Activity Log */}
        <div className="w-80 h-44">
          <ActivityLog />
        </div>
      </div>

      {/* Create Task Modal */}
      {showCreateModal && (
        <CreateTaskModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            toast.success('Task created successfully!');
          }}
        />
      )}
    </div>
  );
};

export default KanbanBoard; 