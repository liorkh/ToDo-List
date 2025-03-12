import { Server } from 'socket.io';

let io: Server;

const corsOptions = {
  origin: 'http://localhost:4200', // Frontend URL (Angular)
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
};

export const initializeSocketIO = (server: any) => {
  if (!io) {
    io = new Server(server, { cors: corsOptions });  // Apply CORS options here
  }
  return io;
};

export const getSocketIO = () => {
  if (!io) {
    throw new Error('Socket.IO not initialized');
  }
  return io;
};
