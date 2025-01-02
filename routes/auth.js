const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Ensure the path to the User model is correct
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'yourSecretKey';

// User Signup
router.post('/signup', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            password: hashedPassword,
        });

        await newUser.save();

        return res.status(201).json({ message: 'User created successfully.' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error creating user.' });
    }
});

// User Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, {
            expiresIn: '1h',
        });

        return res.status(200).json({ token, message: 'Login successful.' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error logging in.' });
    }
});

module.exports = router;


