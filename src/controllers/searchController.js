const Document = require('../models/document');
const User = require('../models/user');

// Search students, documents, feedback
exports.search = async (req, res) => {
  try {
    const { q, type, department } = req.query;
    let results = {};
    if (!q) return res.status(400).json({ error: 'Missing search query' });
    if (!type || type === 'students') {
      const studentFilter = {
        $or: [
          { name: { $regex: q, $options: 'i' } },
          { email: { $regex: q, $options: 'i' } }
        ],
        role: 'student'
      };
      if (department && department !== 'all') {
        studentFilter.department = department;
      }
      results.students = await User.find(studentFilter).select('name email department');
    }
    if (!type || type === 'documents') {
      results.documents = await Document.find({
        title: { $regex: q, $options: 'i' }
      }).select('title type status department student');
    }
    if (!type || type === 'feedback') {
      results.feedback = await Document.aggregate([
        { $unwind: '$feedback' },
        { $match: { 'feedback.comments': { $regex: q, $options: 'i' } } },
        { $project: {
            title: 1,
            'feedback.comments': 1,
            'feedback.grade': 1,
            'feedback.date': 1
        } }
      ]);
    }
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
