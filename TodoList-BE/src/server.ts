import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import app from './app';
import { corsOptions, initializeSocketIO } from './models/socketIO';
import connectDB from './models/db';

dotenv.config({ path: './dev.env' });

const server = http.createServer(app);
initializeSocketIO(server);
connectDB();

app.use(cors(corsOptions));

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
