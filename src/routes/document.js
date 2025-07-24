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

// API: GET /api/documents/archive
// Returns all approved documents (archive)
const Document = require('../models/document');
const User = require('../models/user');

// Get all approved documents (archive)
router.get('/archive', async (req, res) => {
  try {
    const docs = await Document.find({ status: 'Approved' })
      .populate('student', 'name email department')
      .sort({ approvedDate: -1 });
    // Format for frontend
    const archive = docs.map(doc => ({
      _id: doc._id,
      title: doc.title,
      authorName: doc.student ? doc.student.name : '',
      type: doc.type,
      department: doc.student ? doc.student.department : '',
      approvedDate: doc.approvedDate || doc.submissionDate,
      filename: doc.fileUrl,
      url: doc.fileUrl
    }));
    res.json(archive);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get document details
router.get('/:id', /*auth,*/ documentController.getDocument);

// Submit review/feedback/grade
router.post('/:id/review', /*auth,*/ documentController.submitReview);

// Download document file
router.get('/:id/download', async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc || !doc.fileUrl) return res.status(404).send('File not found');
    const filePath = path.join(__dirname, '../../uploads', doc.fileUrl);
    res.download(filePath, doc.title + (path.extname(doc.fileUrl) || '.pdf'));
  } catch (err) {
    res.status(500).send('Download error');
  }
});

// View document online
router.get('/:id/view', async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc || !doc.fileUrl) return res.status(404).send('File not found');
    const filePath = path.join(__dirname, '../../uploads', doc.fileUrl);
    res.sendFile(filePath);
  } catch (err) {
    res.status(500).send('View error');
  }
});

// Submit new document (student upload)
router.post('/', /*auth,*/ upload.single('file'), documentController.createDocument);

module.exports = router;
