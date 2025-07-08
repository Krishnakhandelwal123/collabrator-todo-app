import { io } from 'socket.io-client';
import { useTaskStore } from '../Store/TaskStore.js';

class SocketManager {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  connect(token) {
    if (this.socket) {
      this.socket.disconnect();
    }

    this.socket = io(import.meta.env.MODE === "development" ? "http://localhost:3000" : "/", {
      auth: {
        token: token,
      },
    });

    this.socket.on('connect', () => {
      console.log('✅ Socket.IO Connected Successfully!');
      this.isConnected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Socket.IO Disconnected');
      this.isConnected = false;
    });

    // Listen for real-time updates
    this.socket.on('taskCreated', (data) => {
      console.log('📝 Real-time: Task Created', data.task.title);
      const { addTask, addAction } = useTaskStore.getState();
      addTask(data.task);
      addAction(data.action);
    });

    this.socket.on('taskUpdated', (data) => {
      console.log('✏️ Real-time: Task Updated', data.task.title);
      const { updateTaskInStore, addAction } = useTaskStore.getState();
      updateTaskInStore(data.task);
      addAction(data.action);
    });

    this.socket.on('taskDeleted', (data) => {
      console.log('🗑️ Real-time: Task Deleted', data.taskId);
      const { removeTask, addAction } = useTaskStore.getState();
      removeTask(data.taskId);
      addAction(data.action);
    });

    this.socket.on('taskAssigned', (data) => {
      console.log('👤 Real-time: Task Assigned', data.task.title);
      const { updateTaskInStore, addAction } = useTaskStore.getState();
      updateTaskInStore(data.task);
      addAction(data.action);
    });

    this.socket.on('taskSmartAssigned', (data) => {
      console.log('⚡ Real-time: Task Smart Assigned', data.task.title);
      const { updateTaskInStore, addAction } = useTaskStore.getState();
      updateTaskInStore(data.task);
      addAction(data.action);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  getSocket() {
    return this.socket;
  }
}

export const socketManager = new SocketManager(); 