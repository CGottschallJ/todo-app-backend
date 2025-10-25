import 'dotenv/config'; // This will load the environment variables from the .env file

import express from 'express';
import cors from 'cors';
import listsRouter from './routes/lists';
import todosRouter from './routes/todos';

const app = express(); // This is the express application
const PORT = process.env.PORT || 3000; // This is the port that the server will run on

/* Middleware */

// Cors is a middleware that will allow the server to be accessed from the frontend
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  })
);

// express.json() is a middleware that will parse the request body
app.use(express.json());

// Test route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend express server is running' });
});

app.use('/api/lists', listsRouter);
app.use('/api/todos', todosRouter);
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
