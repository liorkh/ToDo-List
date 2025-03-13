import cors from 'cors';
import express from 'express';
import taskRoutes from '../routes/taskRoutes';
import { corsOptions } from './socketIO';

const app = express();
app.use(cors(corsOptions));
app.use(express.json());
app.use('/tasks', taskRoutes);

export default app;
