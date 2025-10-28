// --- 1. Import necessary packages ---
const express = require('express');
const mongoose = require('mongoose'); // <-- Mongoose is imported HERE
const cors = require('cors');
require('dotenv').config(); // This loads the variables from .env

// --- 2. Import routes ---
const authRoutes = require('./auth');
const chatRoutes = require('./chat');

// --- 3. Initialize the app ---
const app = express();
const PORT = process.env.PORT || 5000;

// --- 4. Middleware ---
app.use(cors()); // Allows the frontend to talk to this backend
app.use(express.json()); // Allows the server to accept JSON data

// --- 5. Connect to MongoDB ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB connected successfully.');
        // Start the server ONLY after the DB connection is successful
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1); // Exit the process if DB connection fails
    });

// --- 6. API Routes ---
app.get('/', (req, res) => {
    res.send('AI Mental Health API is running!');
});

// Use the authentication and chat routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

// --- NOTE: We moved app.listen inside the mongoose.connect().then() block ---

