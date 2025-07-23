const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');
// const auth = require('../middleware/auth'); // Uncomment if you have auth middleware

// Search students, documents, feedback
router.get('/', /*auth,*/ searchController.search);

module.exports = router;
