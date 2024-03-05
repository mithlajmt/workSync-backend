const mongoose = require('mongoose');


const attendanceSchema = new mongoose.Schema({
  companyID: {
    type: String,
    required: [true, 'Please enter your company Name'],
  },
  employeeID: {
    type: String,
    required: [true, 'Please provide your employeeID'],
  },
  Image: {
    type: String,
    // required: [true, 'Please mark your attendance!'],
  },
  date: {
    type: Date,
    required: [true, 'Hmm... it seems the date is missing. Please retry'],
  },
  checkIn: {
    type: String,
    // eslint-disable-next-line max-len
    required: [false, 'hmm.. something seems off try checkin again we couldnt get checkIn time'],
  },
  checkOut: {
    type: String,
    // eslint-disable-next-line max-len
    required: [false, 'hmm.. something seems off try checkin again we couldnt get checkout time'],
  },
  isLate: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    required: [true, 'Please provide your role'],
    enum: ['employee', 'departmentHead'],
  },
  status: {
    type: String,
    required: [true, 'Please provide the status of the day'],
    enum: ['present', 'late', 'leave'],
  },


});

module.exports = mongoose.model('Attendances', attendanceSchema);
