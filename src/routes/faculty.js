const express = require('express');
const router = express.Router();
const facultyController = require('../controllers/facultyController');
// const auth = require('../middleware/auth'); // Uncomment if you have auth middleware

// Faculty analytics dashboard
router.get('/analytics', /*auth,*/ facultyController.getFacultyAnalytics);

module.exports = router;
