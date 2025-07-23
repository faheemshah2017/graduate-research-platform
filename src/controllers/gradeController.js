const Grade = require('../models/grade');
const Document = require('../models/document');
const User = require('../models/user');

// List grades assigned by faculty
exports.listGrades = async (req, res) => {
  try {
    const filter = {};
    if (req.query.faculty) filter.faculty = req.query.faculty;
    if (req.query.student) filter.student = req.query.student;
    const grades = await Grade.find(filter)
      .populate('document', 'title type')
      .populate('student', 'name email')
      .populate('faculty', 'name email')
      .sort({ date: -1 });
    res.json(grades);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Assign a grade to a document
exports.assignGrade = async (req, res) => {
  try {
    const { documentId, studentId, grade, comments } = req.body;
    // Optionally: check if faculty is authorized to grade this document
    const newGrade = new Grade({
      document: documentId,
      student: studentId,
      faculty: req.user._id, // assuming req.user is set by auth middleware
      grade,
      comments
    });
    await newGrade.save();
    res.json({ message: 'Grade assigned', grade: newGrade });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
