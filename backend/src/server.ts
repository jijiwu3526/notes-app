import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import routes
import noteRoutes from './routes/noteRoutes';
import userRoutes from './routes/userRoutes';

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
const corsOrigin = process.env.CORS_ORIGIN || '*';
app.use(cors({
  origin: corsOrigin === '*' ? true : corsOrigin.split(','),
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/notes', noteRoutes);
app.use('/api/users', userRoutes);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// Connect to MongoDB and start server
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DATABASE_URL || 'mongodb://localhost:27017/notes');
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

connectDB();

export default app;