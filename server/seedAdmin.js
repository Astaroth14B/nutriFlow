const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // 1. Delete all existing users
        await User.deleteMany({});
        console.log('SUCCESS: All existing users have been wiped from the database.');

        // 2. Create the new admin (password will be hashed automatically by Mongoose pre-save hook)
        const adminUser = new User({
            name: 'admin',
            email: 'admin@gmail.com',
            password: 'admin', // Raw password goes here, Mongoose hooks handle hashing
            role: 'admin'
        });

        await adminUser.save();

        process.exit(0);
    } catch (err) {
        console.error('Error seeding admin:', err);
        process.exit(1);
    }
};

seedAdmin();
