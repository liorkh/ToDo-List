import express from 'express';
import cors from 'cors';
import taskRoutes from './routes/taskRoutes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/tasks', taskRoutes);

export default app;
