import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';  // Corrected import
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config({ path: './dev.env' });

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server);  // Now `SocketIOServer` can be called like a function

// Middleware
app.use(cors());
app.use(express.json());

let num =6;
let num1 =6
let num2 =6
let num3 =6


// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(
    () => console.log('MongoDB connected')
  )
  .catch((err) => console.log(err));


// Task schema
const taskSchema = new mongoose.Schema({
  title: String,
  completed: Boolean,
  editing: Boolean
});

let num4 =6

// const Task = mongoose.model('Task', taskSchema);

// // Real-time updates
// io.on('connection', (socket) => {
//   console.log('A user connected');
  
//   socket.on('disconnect', () => {
//     console.log('User disconnected');
//   });
// });

// // CRUD routes
// app.post('/tasks', async (req, res) => {
//   const { title } = req.body;
//   try {
//     const newTask = new Task({ title, completed: false, editing: false });
//     await newTask.save();
//     io.emit('taskAdded', newTask);  // Emit real-time update
//     res.status(201).json(newTask);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });
