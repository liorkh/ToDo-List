import { Request, Response } from 'express';
import TaskRepository from '../repositories/taskRepository';
import { getSocketIO } from '../models/socketIO';  

// Create a new task
export const createTask = async (req: Request, res: Response) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'Title is required' });
  }

  try {
    const newTask = await TaskRepository.createTask(title); 
    const io = getSocketIO();
    io.emit('taskAdded', newTask);  

    res.status(201);
  } catch (err) {
    console.error('Error creating task:', err);
    res.status(400).json({ message: err.message });
  }
};

// Get all tasks
export const getTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await TaskRepository.getAllTasks(); 
    res.status(200).json(tasks);  
  } catch (err) {
    console.error('Error fetching tasks:', err);
    res.status(400).json({ message: err.message });
  }
};

// Update an existing task
export const updateTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, completed, editing } = req.body;
  const socketId = req.headers['socket-id']; 

  if (!title && completed === undefined && editing === undefined) {
    return res.status(400).json({ message: 'At least one field must be provided to update the task' });
  }

  try {
    const updatedTask = await TaskRepository.updateTask(id, title, completed, editing); 

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const io = getSocketIO();

    // Emit task update event to all clients except the one with socketId
    if (socketId) {
      io.sockets.sockets.forEach((socket) => {
        if (socket.id !== socketId) {
          socket.emit('taskUpdated', updatedTask);
        }
      });
    }

    res.status(200);
  } catch (err) {
    console.error('Error updating task:', err);
    res.status(400).json({ message: err.message });
  }
};

// Delete an existing task
export const deleteTask = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deletedTask = await TaskRepository.deleteTask(id); 

    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const io = getSocketIO();
    io.emit('taskDeleted', deletedTask);

    res.status(200); 
  } catch (err) {
    console.error('Error deleting task:', err);
    res.status(400).json({ message: err.message });
  }
};
