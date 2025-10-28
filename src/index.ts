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
    origin: (origin, callback) => {
      //Define Allowed Origins
      const allowedOrigins: string[] = [];

      // Checks for FRONTEND_URL environment variable in production and Add Production frontend URL
      if (process.env.NODE_ENV === 'production') {
        if (!process.env.FRONTEND_URL) {
          throw new Error(
            'FRONTEND_URL environment variable must be set in production'
          );
        }
        allowedOrigins.push(process.env.FRONTEND_URL);
      }

      // Add development origins in non production environments ONLY
      if (process.env.NODE_ENV !== 'production') {
        allowedOrigins.push('http://localhost:5173');
        allowedOrigins.push('http://localhost:3000');
        allowedOrigins.push('http://127.0.0.1:5173');
      }

      // No Origin (postman, curl, etc) - allow ONLY in development
      if (!origin && process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }

      // Checking if the origin is in allowed list
      if (origin && allowedOrigins.includes(origin)) {
        callback(null, true);
      } else if (origin) {
        callback(new Error('Not allowed by CORS'));
      } else {
        // No Origin (postman, curl, etc) - reject in production
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    optionsSuccessStatus: 200,
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
