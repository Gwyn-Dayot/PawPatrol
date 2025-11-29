import express from 'express';
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import crypto from 'crypto';
import { sendEmail } from '../utils/sendEmail.js';

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

//ForgotPassword
router.post("/forgot-password", asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user)
    return res.status(200).json({ message: "If account exists, email sent." });

  const resetToken = user.generatePasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  const html = `
    <p>You requested to reset your password.</p>
    <p>Click the link below:</p>
    <a href="${resetURL}">${resetURL}</a>
    <p>This link expires in <strong>10 minutes</strong>.</p>
  `;

  await sendEmail({
    to: user.email,
    subject: "PAWdoption Password Reset",
    html,
  });

  res.json({ message: "Reset link sent to email" });
}));

//ResetPass
router.post("/reset-password/:token", asyncHandler(async (req, res) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) return res.status(400).json({ message: "Token invalid or expired" });

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  res.json({ message: "Password updated successfully!" });
}));

export default router;