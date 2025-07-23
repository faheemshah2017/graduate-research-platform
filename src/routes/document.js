const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const multer = require('multer');
const path = require('path');
// const auth = require('../middleware/auth'); // Uncomment if you have auth middleware

// Set up multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// List documents for review
router.get('/review', /*auth,*/ documentController.listForReview);

// Get document details
router.get('/:id', /*auth,*/ documentController.getDocument);

// Submit review/feedback/grade
router.post('/:id/review', /*auth,*/ documentController.submitReview);

// Download document file
router.get('/:id/download', /*auth,*/ documentController.download);

// View document online
router.get('/:id/view', /*auth,*/ documentController.view);

// Submit new document (student upload)
router.post('/', /*auth,*/ upload.single('file'), documentController.createDocument);

module.exports = router;
