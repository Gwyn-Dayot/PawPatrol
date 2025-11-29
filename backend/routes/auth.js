import express from 'express';
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

const router = express.Router();

const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
};

//Register
router.post('/register', asyncHandler(async (req, res) => {
    const { fullname, email, password, role } = req.body;
    if (!fullname || !email || !password) return res.status(400).json({ message: 'Please provide all required fields' });

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'Email is already used' });

    const user = new User({ fullname, email, password, role });
    await user.save();

    res.status(201).json({
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
        token: generateToken(user),
    });
}));

//Login
router.post('/login', asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Please provide email and password' });

    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
        res.json({
            id: user._id,
            fullname: user.fullname,
            email: user.email,
            role: user.role,
            token: generateToken(user),
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
}));

export default router;