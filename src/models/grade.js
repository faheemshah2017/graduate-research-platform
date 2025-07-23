const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
  document: { type: mongoose.Schema.Types.ObjectId, ref: 'Document', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  grade: { type: String, enum: ['A', 'B', 'C', 'D', 'F'], required: true },
  comments: String,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Grade', gradeSchema);
