const mongoose = require('mongoose');

const leaveRequestSchema = new mongoose.Schema({

  employeeID: {
    type: String,
    required: true,
  },

  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  attachment: {
    type: String,
  },

  requestedDates: {
    type: [Date], // Array of Date objects
    required: true,
  },

  date: {
    type: Date,
    default: new Date(),

  },

  reviewStatus: {
    type: String,
    enum: ['pending', 'approved', 'denied'],
    default: 'pending',
  },

  approvedDays: {
    type: [Date],
    default: [],
  },
});

const LeaveRequest = mongoose.model('LeaveRequest', leaveRequestSchema);

module.exports = LeaveRequest;
