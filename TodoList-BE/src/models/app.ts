import cors from 'cors';
import express from 'express';
import taskRoutes from '../routes/taskRoutes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/tasks', taskRoutes);

export default app;
