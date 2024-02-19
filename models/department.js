const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  departmentName: {
    type: String,
    required: [true, 'please enter department name'],
  },
  description: {
    type: String,
    requires: [true, 'please enter your description'],
  },
  budget: {
    type: String,
    require: [true, 'please enter the budget'],
  },
  companyID: {
    type: String,
    required: [true, 'enter your company id'],
  },
  departmentID: {
    type: String,
    require: [true, 'enter your company id'],
  },
});

const Department = mongoose.model('departments', departmentSchema);

module.exports = Department;
