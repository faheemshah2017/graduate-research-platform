const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Document = require('../models/document');
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

// API: GET /api/reports
// Returns filtered report data from users and documents
// Get all reports (students + their documents)
router.get('/reports', async (req, res) => {
  try {
    // Only fetch students
    const { department, status, supervisor, search } = req.query;
    let userFilter = { role: 'student' };
    if (department && department !== 'all') userFilter.department = department;
    if (supervisor && supervisor !== 'all') userFilter.advisor = supervisor;
    if (search) userFilter.name = { $regex: search, $options: 'i' };
    const students = await User.find(userFilter).select('name email department advisor');
    // For each student, get their last document and supervisor name
    const reports = await Promise.all(students.map(async student => {
      const lastDoc = await Document.findOne({ student: student._id }).populate('advisor', 'name').sort({ submissionDate: -1 });
      if (!lastDoc) return null; // Filter out students with no documents
      let supervisorName = '';
      if (lastDoc.advisor && lastDoc.advisor.name) {
        supervisorName = lastDoc.advisor.name;
      } else if (student.advisor) {
        const advisorUser = await User.findById(student.advisor).select('name');
        supervisorName = advisorUser ? advisorUser.name : '';
      }
      return {
        name: student.name,
        regNumber: student._id,
        projectTitle: lastDoc.title,
        supervisor: supervisorName,
        department: student.department,
        status: lastDoc.status,
        lastSubmission: lastDoc.submissionDate ? lastDoc.submissionDate.toISOString().split('T')[0] : '',
      };
    }));
    res.json(reports.filter(r => r));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: update user by ID
router.put('/:id', userController.adminUpdateUser);

module.exports = router;
