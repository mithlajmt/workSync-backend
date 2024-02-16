const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  // Personal Information
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  dateOfBirth: {type: String, required: true},
  gender: {type: String, enum: ['male', 'female'], required: true},

  //
  CompanyID: {type: String, required: true},
  employeeID: {type: String, required: true},


  // Contact Information
  email: {type: String, required: true, unique: true},
  phoneNumber: {type: String, required: true},

  // Hire Date and Department
  hireDate: {type: String, required: true},
  department: {type: String, required: true},

  // Role/Position
  position: {type: String, required: true},
  role: {type: String, enum: ['department head', 'employee'], required: true},

  adharID: {type: String},
  photo: {type: String},
});

// Compound index on email and CompanyID
employeeSchema.index({email: 1, CompanyID: 1}, {unique: true});

const Employee = mongoose.model('employees', employeeSchema);

module.exports = Employee;
