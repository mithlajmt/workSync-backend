const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  attachment: String,
  start: {
    type: Date,
    required: true,
  },
  end: {
    type: Date,
    // required: true,
  },
  target: {
    type: String,
    enum: ['departmentHead', 'ALL'],
    required: true,
  },
  recipients: {
    type: [String], 
    default: [],
  },
  priority: {
    type: String,
    enum: ['HIGH', 'MEDIUM', 'LOW'],
    default: 'MEDIUM',  
  },
  companyID: {
    type: String,
    required: true,
  },
  creatorId: {
    type: String,
    // required: true,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  isValid: {
    type: Boolean,
    default: false,
  },
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports= Notification
