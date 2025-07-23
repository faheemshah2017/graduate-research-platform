const express = require('express');
const router = express.Router();
const gradeController = require('../controllers/gradeController');
// const auth = require('../middleware/auth'); // Uncomment if you have auth middleware

// List grades (optionally filter by faculty or student)
router.get('/', /*auth,*/ gradeController.listGrades);

// Assign a grade to a document
router.post('/', /*auth,*/ gradeController.assignGrade);

module.exports = router;
