import { Server } from 'socket.io';

let io: Server;

export const initializeSocketIO = (server: any) => {
  if (!io) {
    io = new Server(server);
  }
  return io;
};

export const getSocketIO = () => {
  if (!io) {
    throw new Error('Socket.IO not initialized');
  }
  return io;
};
