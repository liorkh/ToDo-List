// src/server.ts
import http from 'http';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from './app';
import { initializeSocketIO } from './models/socketIO';  // Updated import path

dotenv.config({ path: './dev.env' });

const server = http.createServer(app);
const io = initializeSocketIO(server);

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

// Real-time updates (Socket.IO connection)
io.on('connection', (socket) => {
  console.log('A user connected');
  
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
