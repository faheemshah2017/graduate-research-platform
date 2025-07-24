const express = require('express');
const router = express.Router();
const User = require('../models/user');
const multer = require('multer');
const path = require('path');
const upload = multer({
  dest: path.join(__dirname, '../../uploads'),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'));
    }
    cb(null, true);
  }
});
const userController = require('../controllers/userController');

// Get all users, or filter by role
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.role) filter.role = req.query.role;
    const users = await User.find(filter).select('name email role department');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Profile update route
router.post('/update-profile', upload.single('photo'), userController.updateProfile);

module.exports = router;
