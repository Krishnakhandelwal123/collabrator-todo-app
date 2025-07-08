import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

let io = null;

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      credentials: true,
    },
  });

  // Authentication middleware for Socket.IO
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-password');
      
      if (!user) {
        return next(new Error('User not found'));
      }

      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`🔌 User connected: ${socket.user.name} (Socket ID: ${socket.id})`);

    // Join the main room for all users
    socket.join('main');

    socket.on('disconnect', () => {
      console.log(`🔌 User disconnected: ${socket.user.name} (Socket ID: ${socket.id})`);
    });
  });

  return io;
};

// Helper function to emit events to all connected clients
export const emitToAll = (event, data) => {
  if (io) {
    console.log(`📡 Emitting ${event} to all clients:`, data.task?.title || data.taskId || 'N/A');
    io.to('main').emit(event, data);
  } else {
    console.log('❌ Socket.IO not initialized');
  }
};

// Get the io instance
export const getIO = () => io; 