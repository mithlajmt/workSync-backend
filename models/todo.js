const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  status: {
    type: String,
    enum: ['pending', 'done'],
    default: 'pending',
  },
});

const userSchema = new mongoose.Schema({
  companyID: {
    type: String,
    required: true,
  },
  userID: {
    type: String,
    required: true,
  },
  tasks: [taskSchema],
});

module.exports = mongoose.model('User', userSchema);
