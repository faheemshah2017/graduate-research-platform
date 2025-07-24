const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const documentRoutes = require('./routes/document');
const gradeRoutes = require('./routes/grade');
const searchRoutes = require('./routes/search');
const userRoutes = require('./routes/user');
const chatRoutes = require('./routes/chat');
const facultyRoutes = require('./routes/faculty');
const studentRoutes = require('./routes/student');
const dbConfig = require('./config/db');
const swaggerSetup = require('./swagger');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
dbConfig();

// Swagger docs
swaggerSetup(app);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/grades', gradeRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/student', studentRoutes);

// Serve static files from the public folder (one level up from src)
app.use(express.static(path.join(__dirname, '..', 'public')));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// For SPA: serve index.html for any unknown routes (except API)
app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});