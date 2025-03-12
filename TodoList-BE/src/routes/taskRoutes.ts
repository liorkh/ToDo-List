import express from 'express';
import { createTask, getTasks, updateTask, deleteTask } from '../controllers/taskController';

const router = express.Router();

// Task CRUD routes
router.post('/', async (req, res) => {
    try {
        await createTask(req, res);
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong' });
    }
});

router.get('/', async (req, res) => {
    try {
        await getTasks(res);
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        await updateTask(req, res);
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await deleteTask(req, res);
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong' });
    }
});

export default router;
