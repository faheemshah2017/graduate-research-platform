const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/user');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        // Seed users only once after connection
        const hashedPassword = await bcrypt.hash('Admin@321', 10);
        await User.updateOne(
            { email: 'admin@gmail.com' },
            {
                name: 'Administrator',
                email: 'admin@gmail.com',
                password: hashedPassword,
                role: 'admin',
                department: 'Administration',
            },
            { upsert: true }
        );
        await User.updateOne(
            { email: 'muneebastudent@gmail.com' },
            {
                name: 'Muneeba Student',
                email: 'muneebastudent@gmail.com',
                password: hashedPassword,
                role: 'student',
                department: 'Software Engineering',
            },
            { upsert: true }
        );
        await User.updateOne(
            { email: 'muneebateacher@gmail.com' },
            {
                name: 'Muneeba Teacher',
                email: 'muneebateacher@gmail.com',
                password: hashedPassword,
                role: 'faculty',
                department: 'Software Engineering',
            },
            { upsert: true }
        );
        console.log('MongoDB connected and users seeded successfully');
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;