import express from 'express';
import asyncHandler from 'express-async-handler';
import Application from '../models/Application.js';
import { protect } from '../middleware/auth.js'; // Assuming you have this middleware

const router = express.Router();

// @desc    Submit a new application
// @route   POST /api/applications
// @access  Private
router.post(
  '/',
  protect,
  asyncHandler(async (req, res) => {
    // Check if user already has a pending application
    const existingApp = await Application.findOne({ userId: req.user._id, status: 'pending' });
    
    if (existingApp) {
      res.status(400);
      throw new Error('You already have a pending application.');
    }

    const application = new Application({
      userId: req.user._id,
      ...req.body
    });

    const createdApplication = await application.save();
    res.status(201).json(createdApplication);
  })
);

// @desc    Get logged in user's applications
// @route   GET /api/applications/my
// @access  Private
router.get(
  '/my',
  protect,
  asyncHandler(async (req, res) => {
    const applications = await Application.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(applications);
  })
);

export default router;