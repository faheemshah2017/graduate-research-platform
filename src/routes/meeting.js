const express = require('express');
const router = express.Router();
const meetingController = require('../controllers/meetingController');

// POST /api/meetings/notify
router.post('/notify', meetingController.notifyUsers);

// GET /api/meetings/for-user/:userId
router.get('/for-user/:userId', meetingController.getUserMeetings);

// POST /api/meetings/attend/:meetingId
router.post('/attend/:meetingId', meetingController.markAttended);

module.exports = router;
