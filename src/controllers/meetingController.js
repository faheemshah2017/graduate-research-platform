// Meeting notification controller
const User = require('../models/user');
const Notification = require('../models/notification');

// POST /api/meetings/notify
exports.notifyUsers = async (req, res) => {
    try {
        const { userIds, meetLink } = req.body;
        if (!userIds || !Array.isArray(userIds) || userIds.length === 0 || !meetLink) {
            return res.status(400).json({ error: 'Missing userIds or meetLink' });
        }
        // Fetch users to notify
        const users = await User.find({ _id: { $in: userIds } });
        // For demo: just log notification (replace with email, push, etc. as needed)
        users.forEach(user => {
            console.log(`Notify ${user.name} (${user.email}): Meeting scheduled at ${meetLink}`);
        });
        // Save notification to DB for each user
        await Promise.all(users.map(user => {
            return Notification.create({ user: user._id, meetLink });
        }));
        res.json({ message: 'Notifications sent', notified: users.map(u => u._id) });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET /api/meetings/for-user/:userId
exports.getUserMeetings = async (req, res) => {
    try {
        const userId = req.params.userId;
        const notifications = await Notification.find({ user: userId, attended: false }).sort({ createdAt: -1 });
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Mark meeting notification as attended
exports.markAttended = async (req, res) => {
    try {
        const meetingId = req.params.meetingId;
        await Notification.findByIdAndUpdate(meetingId, { attended: true });
        res.json({ message: 'Meeting marked as attended' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
