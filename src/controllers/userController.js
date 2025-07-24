const User = require('../models/user');
const fs = require('fs');
const path = require('path');

exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user?._id || req.body._id || req.body.userId || (req.body.email ? (await User.findOne({ email: req.body.email }))._id : null);
        if (!userId) return res.status(400).json({ error: 'User not found' });
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });
        // Update fields
        if (req.body.name) user.name = req.body.name;
        if (req.body.department) user.department = req.body.department;
        if (req.body.advisor) user.advisor = req.body.advisor;
        if (req.body.password) user.password = req.body.password;
        // Handle photo upload
        if (req.file) {
            // Remove old photo if exists
            if (user.photo) {
                const oldPath = path.join(__dirname, '../../uploads', user.photo);
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }
            user.photo = req.file.filename;
        }
        await user.save();
        res.json({ user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
