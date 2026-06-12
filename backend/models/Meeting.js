const mongoose = require('mongoose');

const actionItemSchema = new mongoose.Schema({
  task: {
    type: String,
    required: true,
  },
  assignee: {
    type: String,
    default: '',
  },
  deadline: {
    type: Date,
  },
  priority: {
    type: String,
    enum: ['high', 'medium', 'low'],
    default: 'medium',
  },
});

const meetingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  hostId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  transcript: {
    type: String,
    default: '',
  },
  summary: {
    type: String,
    default: '',
  },
  actionItems: [actionItemSchema],
  recordingUrl: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['scheduled', 'live', 'completed'],
    default: 'scheduled',
  },
  scheduledAt: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Meeting', meetingSchema);
