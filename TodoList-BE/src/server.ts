import http from 'http';
import dotenv from 'dotenv';
import app from './models/app';
import connectDB from './models/db';
import {initializeSocketIO } from './models/socketIO';

dotenv.config({ path: './dev.env' });

const server = http.createServer(app);
initializeSocketIO(server);
connectDB();

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
