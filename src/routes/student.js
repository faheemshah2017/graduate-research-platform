const express = require('express');
const router = express.Router();
const Document = require('../models/document');
const Grade = require('../models/grade');
const User = require('../models/user');

// GET /api/student/analytics?studentId=...
router.get('/analytics', async (req, res) => {
    try {
        const studentId = req.query.studentId;
        if (!studentId) return res.status(400).json({ error: 'Missing studentId' });
        // Documents submitted
        const documentsSubmitted = await Document.countDocuments({ student: studentId });
        // Approved documents
        const approvedDocuments = await Document.countDocuments({ student: studentId, status: 'Approved' });
        // Pending reviews
        const pendingReviews = await Document.countDocuments({ student: studentId, status: { $in: ['Pending Review', 'In Progress'] } });
        // Feedback received
        const feedbackReceived = await Grade.countDocuments({ student: studentId });
        res.json({ documentsSubmitted, approvedDocuments, pendingReviews, feedbackReceived });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
