import { Request, Response } from 'express';
import Task from '../models/taskModel';
import { getSocketIO } from '../models/socketIO';  // Import the socketIO instance

// Create a new task
export const createTask = async (req: Request, res: Response) => {
  const { title } = req.body;
  
  // Check if title is provided
  if (!title) {
    return res.status(400).json({ message: 'Title is required' });
  }
  
  try {
    // Create a new task and save to database
    const newTask = new Task({ title, completed: false, editing: false });
    await newTask.save();

    // Emit real-time update to all connected clients
    const io = getSocketIO();  // Get the Socket.IO instance
    io.emit('taskAdded', newTask);  // Emit 'taskAdded' event
    
    // Respond with the created task
    res.status(201).json(newTask);
  } catch (err) {
    console.error('Error creating task:', err);
    res.status(400).json({ message: err.message });
  }
};

// Get all tasks
export const getTasks = async (req: Request, res: Response) => {
  try {
    // Fetch all tasks from the database
    const tasks = await Task.find().select('-__v');  // Exclude version field

    // Respond with the tasks data
    res.status(200).json(tasks);
  } catch (err) {
    console.error('Error fetching tasks:', err);
    res.status(400).json({ message: err.message });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, completed, editing } = req.body;
  const socketId = req.headers['socket-id'];  // Get socket ID from request headers

  // Ensure that at least one field is provided for updating
  if (!title && completed === undefined && editing === undefined) {
    return res.status(400).json({ message: 'At least one field must be provided to update the task' });
  }

  try {
    // Find the task by ID and update the fields
    const updatedTask = await Task.findByIdAndUpdate(id, { title, completed, editing }, { new: true });

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const io = getSocketIO(); // Get the Socket.IO instance

    // Emit to all clients except the sender
    // Emit the update to all clients except the sender

    if (socketId) {
      // This broadcasts the update to all clients EXCEPT the sender
    io.sockets.sockets.forEach((socket) => {
        if (socket.id !== socketId) {
          socket.emit('taskUpdated', updatedTask);  // Emit 'taskUpdated' event
        }
      });
    }

    // Respond with the updated task data
    res.status(200).json(updatedTask);
  } catch (err) {
    console.error('Error updating task:', err);
    res.status(400).json({ message: err.message });
  }
};


// Delete a task
export const deleteTask = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Find and delete the task by ID
    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Emit real-time update for the deleted task
    const io = getSocketIO();
    io.emit('taskDeleted', deletedTask);  // Emit 'taskDeleted' event

    // Respond with the deleted task data
    res.status(200).json(deletedTask);
  } catch (err) {
    console.error('Error deleting task:', err);
    res.status(400).json({ message: err.message });
  }
};
