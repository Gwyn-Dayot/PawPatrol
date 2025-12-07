import express from 'express';
import asyncHandler from 'express-async-handler';
import multer from 'multer';
import path from 'path';
import Application from '../models/Application.js';
import { protect } from '../middleware/auth.js';
import { authorizeRoles } from '../middleware/roles.js';

const router = express.Router();

// --- Configuration ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

// Limit file size to 5MB and check file types if needed
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } 
});

// --- Routes ---

// @desc    Submit a new application
// @route   POST /api/applications
// @access  Private
router.post('/', protect, upload.fields([
    { name: 'main', maxCount: 1 },
    { name: 'img2', maxCount: 1 },
    { name: 'img3', maxCount: 1 },
    { name: 'img4', maxCount: 1 }
  ]),
  asyncHandler(async (req, res) => {
    // 1. Check if user already has a pending application
    const existingApp = await Application.findOne({ 
      userId: req.user._id, 
      status: 'pending' 
    });

    if (existingApp) {
      res.status(400);
      throw new Error('You already have a pending application.');
    }

    // 2. Process uploaded images
    const images = {};
    if (req.files) {
      ['main', 'img2', 'img3', 'img4'].forEach(key => {
        if (req.files[key]) {
          images[key] = req.files[key][0].path;
        }
      });
    }

    // 3. Create Application
    // Note: ...req.body will now only contain the address and home details 
    // sent from the shortened frontend.
    const application = new Application({
      userId: req.user._id, // Securely get ID from the auth token
      ...req.body,
      images
    });

    const createdApplication = await application.save();
    res.status(201).json(createdApplication);
  })
);

// @desc    Get logged-in user's applications
// @route   GET /api/applications/my
// @access  Private
router.get('/my', protect, asyncHandler(async (req, res) => {
    const applications = await Application.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    res.json(applications);
  })
);

// @desc    Get all applications (Admin)
// @route   GET /api/applications
// @access  Admin
router.get('/', protect, authorizeRoles('admin'), asyncHandler(async (req, res) => {
    const applications = await Application.find({})
      .populate('userId', 'fullname email')
      .sort({ createdAt: -1 });
    res.json(applications);
  })
);

// @desc    Update application status (Admin)
// @route   PUT /api/applications/:id/status
// @access  Admin
router.put('/:id/status', protect, authorizeRoles('admin'), asyncHandler(async (req, res) => {
    const { status } = req.body;
    
    const app = await Application.findById(req.params.id);
    
    if (!app) {
      res.status(404);
      throw new Error('Application not found');
    }

    app.status = status;
    await app.save();

    res.json({ message: `Application status updated to ${status}` });
  })
);

export default router;