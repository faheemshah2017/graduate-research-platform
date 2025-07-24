const Document = require('../models/document');
const User = require('../models/user');

// List documents for review (optionally filter by advisor/faculty)
exports.listForReview = async (req, res) => {
  try {
    const filter = {};
    if (req.query.advisor) filter.advisor = req.query.advisor;
    const docs = await Document.find(filter)
      .populate('student', 'name email')
      .populate('advisor', 'name email')
      .sort({ submissionDate: -1 });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get document details
exports.getDocument = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id)
      .populate('student', 'name email')
      .populate('advisor', 'name email');
    if (!doc) return res.status(404).json({ error: 'Document not found' });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Submit review/feedback/grade
exports.submitReview = async (req, res) => {
  try {
    const { comments, grade, recommendation, faculty } = req.body;
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Document not found' });
    // Get faculty id from req.user, body, or header
    let facultyId = (req.user && req.user._id) || faculty || req.headers['x-user-id'];
    if (!facultyId) {
      return res.status(400).json({ error: 'Missing faculty id' });
    }
    doc.feedback.push({
      faculty: facultyId,
      comments,
      grade,
      recommendation
    });
    doc.status = recommendation === 'approve' ? 'Approved' : (recommendation === 'reject' ? 'Rejected' : 'In Progress');
    await doc.save();
    res.json({ message: 'Review submitted', doc });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Download document file (assumes fileUrl is a path or URL)
exports.download = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc || !doc.fileUrl) return res.status(404).json({ error: 'File not found' });
    // If fileUrl is a local path, use res.download
    if (doc.fileUrl.startsWith('/uploads/')) {
      // Get absolute path to file
      const path = require('path');
      const filePath = path.join(__dirname, '../..', doc.fileUrl);
      return res.download(filePath);
    }
    // If fileUrl is a remote URL, redirect
    res.redirect(doc.fileUrl);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// View document online (for PDF, etc.)
exports.view = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc || !doc.fileUrl) return res.status(404).json({ error: 'File not found' });
    res.redirect(doc.fileUrl);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Handle student document upload
exports.createDocument = async (req, res) => {
  try {
    // Use authenticated user as student (if available)
    const studentId = req.user ? req.user._id : req.body.student;
    let { title, type, advisor } = req.body;
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    if (!title || !type || !studentId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    // Map form type to enum value
    const typeMap = {
      proposal: 'Proposal',
      progress: 'Progress Report',
      thesis: 'Thesis'
    };
    type = typeMap[type.toLowerCase()] || type;
    // Initialize docData first
    const docData = {
      title,
      type,
      student: studentId,
      submissionDate: new Date(),
      fileUrl: `/uploads/${req.file.filename}`,
      status: 'Pending Review'
    };
    // Only set advisor if provided and not empty, and treat as supervisor
    if (advisor && advisor !== '') docData.advisor = advisor;
    // Optionally, also save as supervisor if your schema supports it
    // docData.supervisor = advisor;
    const doc = new Document(docData);
    await doc.save();
    res.status(201).json({ message: 'Document submitted', document: doc });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
