const Document = require('../models/document');
const User = require('../models/user');
const Chat = require('../models/chat');

// Return analytics for faculty dashboard
exports.getFacultyAnalytics = async (req, res) => {
  try {
    const facultyId = req.user?._id || req.query.facultyId;
    // Documents to review (pending)
    const documentsToReview = await Document.countDocuments({ advisor: facultyId, status: 'Pending Review' });
    // Reviews completed
    const reviewsCompleted = await Document.countDocuments({ advisor: facultyId, status: 'Approved' });
    // Pending meetings (stub: count of meetings in chat with status 'pending')
    const pendingMeetings = await Chat.countDocuments({ participants: facultyId, type: 'meeting', status: 'pending' });
    // Unread messages (stub: count of unread chat messages for faculty)
    const unreadMessages = await Chat.countDocuments({ participants: facultyId, unread: true });
    res.json({ documentsToReview, reviewsCompleted, pendingMeetings, unreadMessages });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
