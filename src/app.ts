import express, { Application } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Temporary in-memory storage for tasks
let tasks: { id: string; title: string; completed: boolean }[] = [];

// Basic route
app.get('/', (req, res) => {
  res.send('Welcome to the To-Do List API!');
});

// Route to create a new task
app.post('/tasks', (req, res) => {
  const { title } = req.body;

  // Validate input
  if (!title || typeof title !== 'string') {
    return res.status(400).json({ error: 'Title is required and must be a string' });
  }

  // Create a new task
  const newTask = {
    id: uuidv4(), // Generate a unique ID
    title,
    completed: false, // Default to incomplete
  };

  // Add the task to the array
  tasks.push(newTask);

  // Respond with the created task
  res.status(201).json(newTask);
});

// Route to get all tasks
app.get('/tasks', (req, res) => {
  res.status(200).json(tasks);
});

// Route to update a task
app.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;

  // Find the task with the given ID
  const task = tasks.find((task) => task.id === id);

  // If the task is not found, return a 404 error
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  // Update the task's title and/or completed status
  if (title !== undefined) {
    if (typeof title !== 'string') {
      return res.status(400).json({ error: 'Title must be a string' });
    }
    task.title = title;
  }

  if (completed !== undefined) {
    if (typeof completed !== 'boolean') {
      return res.status(400).json({ error: 'Completed must be a boolean' });
    }
    task.completed = completed;
  }

  // Respond with the updated task
  res.status(200).json(task);
});

// Route to delete a task
app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;

  // Find the index of the task with the given ID
  const taskIndex = tasks.findIndex((task) => task.id === id);

  // If the task is not found, return a 404 error
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  // Remove the task from the array
  const deletedTask = tasks.splice(taskIndex, 1);

  // Respond with the deleted task
  res.status(200).json(deletedTask[0]);
});

// Global error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});