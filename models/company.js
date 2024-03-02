const mongoose = require('mongoose');
// const validator = require('validator');
const validator = require('validator');

const companySchema = new mongoose.Schema({
  // Company Name
  companyName: {
    type: String,
    required: [true, 'Please enter your company name'],
    // unique: true,
  },

  // ... other company details ...
  workingHours: {
    type: Object,
    required: true,
    properties: {
      startTime: {
        type: String,
        description: 'The start time of the working day in HH:MM format.',
      },
      endTime: {
        type: String,
        description: 'The end time of the working day in HH:MM format.',
      },
    },
  },


  // Industry (optional)
  industry: String,

  // Contact Email
  contactEmail: {
    type: String,
    required: [true, 'Please enter an email'],
    unique: true,
    // lowercase: true,
    validate: {
      validator: validator.isEmail,
      message: 'Invalid email format',
    },
  },

  // Contact Number (optional)
  contactNumber: {
    type: Number,
  },

  // Password
  password: {
    type: String,
    required: [true, 'Please enter a password'],
  },

  // Terms and Conditions
  terms: {
    type: Boolean, // Assuming acceptance is indicated by a boolean field
    required: [true, 'Terms and conditions acceptance is required'],
  },

  // Company ID (optional)
  companyID: {
    type: String,
    required: [true, 'Please provide a company ID'],
    unique: true,
  },

  verified: {
    type: Boolean,
    required: [true, 'Authentication failed, please verify your account'],
  },
  role: {
    type: String,
    enum: ['companyAdmin'],
    default: 'companyAdmin', // Set 'admin' as the default role
  },
});
const Company = mongoose.model('companies', companySchema);

module.exports = Company;
