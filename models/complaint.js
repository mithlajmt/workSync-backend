const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  companyID: {
    type: String,
    required: [true, 'Company ID unavailable'],
  },
  employeeID: {
    type: String,
    required: [true, 'Employee ID unavailable'],
  },
  status: {
    type: String,
    enum: ['pending', 'viewed', 'inAction', 'closed'],
    default: 'pending',
  },

  title: {
    type: String,
    required: [true, 'Title is required'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  postDate: {
    type: Date,
    default: Date.now,
  },
  attachment: {
    // You can customize this based on your attachment handling logic
    type: String,
  },
  recipient: {
    type: String,
    enum: ['departmentHead', 'companyAdmin'],
    required: [true, 'Recipient is required'],
  },
});

const Complaint = mongoose.model('Complaint', complaintSchema);

module.exports = Complaint;
