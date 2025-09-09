const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Import Models
const Admin = require('./models/Admin');
const Settings = require('./models/Settings');

// Database Connection with error handling
const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/gym_management';
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB connected successfully');

        // Check for and create initial settings document if it doesn't exist
        const settings = await Settings.findOne();
        if (!settings) {
            console.log('No settings found. Creating initial settings...');
            const newSettings = new Settings({
                location: {
                    latitude: 12.9716, // Default Latitude (e.g., Bangalore, India)
                    longitude: 77.5946  // Default Longitude (e.g., Bangalore, India)
                }
            });
            await newSettings.save();
            console.log('Initial settings created with default location.');
        }

    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        console.log('Please ensure MongoDB is running on your system');
        // Don't exit the process, allow server to run without DB for now
    }
};

connectDB();

// Test route
app.get('/api/test', (req, res) => {
    res.json({ message: 'Server is running!' });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/fighters', require('./routes/fighters'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/attendance', require('./routes/attendance'));

// Global error handler
app.use((err, req, res, next) => {
    console.error('Global error:', err.stack);
    res.status(500).json({ msg: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`JWT_SECRET configured: ${!!process.env.JWT_SECRET}`);
});