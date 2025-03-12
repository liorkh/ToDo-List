// src/server.ts
import http from 'http';
import cors from 'cors'; 
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from './app';
import { initializeSocketIO } from './models/socketIO';  // Updated import path

dotenv.config({ path: './dev.env' });

const server = http.createServer(app);
const io = initializeSocketIO(server);

const corsOptions = {
  origin: 'http://localhost:4200', // Frontend URL (Angular)
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
};

// Apply CORS to both HTTP and WebSocket connections
app.use(cors(corsOptions)); // Enable CORS for HTTP requests


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

