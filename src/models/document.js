const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['Proposal', 'Progress Report', 'Thesis', 'Other'], required: true },
  submissionDate: { type: Date, required: true },
  status: { type: String, enum: ['Pending Review', 'In Progress', 'Approved', 'Rejected'], default: 'Pending Review' },
  fileUrl: { type: String },
  advisor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  feedback: [
    {
      faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      comments: String,
      grade: { type: String, enum: ['A', 'B', 'C', 'D', 'F'] },
      recommendation: { type: String, enum: ['approve', 'approve_with_minor', 'revise', 'reject'] },
      date: { type: Date, default: Date.now }
    }
  ]
});

module.exports = mongoose.model('Document', documentSchema);
