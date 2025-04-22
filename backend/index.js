// index.js
import express from 'express';
import cors from 'cors';
import connectDB from './src/config/db.js';
import cookieParser from 'cookie-parser';        // ensure this is used in index.js
import 'express-async-errors'; // For async error handling


// Import routes
import authRoutes from './src/routes/auth.js';
import profileRoutes from './src/routes/profile.js';
import referralRoutes from './src/routes/referrals.js';
import uploadRoutes from './src/routes/upload.js';
import usersRoutes from "./src/routes/users.js";

const app = express();

// Middleware

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173"; // Default for local dev


app.use(cors({
  origin: CLIENT_URL,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use('/referrals', referralRoutes);
app.use('/upload', uploadRoutes);
app.use('/users', usersRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Backend is running.' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server after connecting to DB
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
