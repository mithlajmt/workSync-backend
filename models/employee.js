const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  // Personal Information
  employeeName: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
    required: true,
  },

  // Company Information
  companyID: {
    type: String,
    required: true,
  },
  employeeID: {
    type: String,
    required: true,
    unique: true, // Assuming employeeID is unique
  },

  // Contact Information
  contactEmail: {
    type: String,
    required: true,
    unique: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },

  // Hire Date and Department
  hireDate: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },

  // Role/Position
  role: {
    type: String,
    enum: ['departmentHead', 'employee'],
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  salary: {
    type: Number, // Assuming salary is stored as a numeric value
  },

  // Additional Information
  adharID: {
    type: String, // Assuming adharID is a string
  },
  photo: {
    type: String, // Assuming photo URL is stored as a string
    default: 'https://i.pinimg.com/originals/6e/4c/9d/6e4c9d2edd4e96ebf5aa313f15827b15.jpg',
  },

  // Bio
  bio: {
    type: String,
  },
  // address: {
    // type: String,
  // },
  // Status
  isActive: {
    type: Boolean,
    required: true,
    default: true,
  },
});

// Compound index on email and CompanyID
// employeeSchema.index({ email: 1, CompanyID: 1 }, { unique: true });

const Employee = mongoose.model('Employees', employeeSchema);

module.exports = Employee;
