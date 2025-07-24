const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    meetLink: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    attended: { type: Boolean, default: false }
});

module.exports = mongoose.model('Notification', NotificationSchema);