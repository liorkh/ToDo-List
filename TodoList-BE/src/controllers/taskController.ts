import { Request, Response } from 'express';
import Task from '../models/taskModel';
import { getSocketIO } from '../models/socketIO';

export const createTask = async (req: Request, res: Response) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'Title is required' });
  }

  try {
    const newTask = new Task({ title, completed: false, editing: false });
    await newTask.save();

    const io = getSocketIO();
    io.emit('taskAdded', newTask);

    res.status(201).json(newTask);
  } catch (err) {
    console.error('Error creating task:', err);
    res.status(400).json({ message: err.message });
  }
};

export const getTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await Task.find().select('-__v');
    res.status(200).json(tasks);
  } catch (err) {
    console.error('Error fetching tasks:', err);
    res.status(400).json({ message: err.message });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, completed, editing } = req.body;
  const socketId = req.headers['socket-id'];

  if (!title && completed === undefined && editing === undefined) {
    return res.status(400).json({ message: 'At least one field must be provided to update the task' });
  }

  try {
    const updatedTask = await Task.findByIdAndUpdate(id, { title, completed, editing }, { new: true });

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const io = getSocketIO();

    if (socketId) {
      io.sockets.sockets.forEach((socket) => {
        if (socket.id !== socketId) {
          socket.emit('taskUpdated', updatedTask);
        }
      });
    }

    res.status(200).json(updatedTask);
  } catch (err) {
    console.error('Error updating task:', err);
    res.status(400).json({ message: err.message });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const io = getSocketIO();
    io.emit('taskDeleted', deletedTask);

    res.status(200).json(deletedTask);
  } catch (err) {
    console.error('Error deleting task:', err);
    res.status(400).json({ message: err.message });
  }
};
