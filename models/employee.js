const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  // Personal Information
  employeeName: {type: String, required: true},
  dateOfBirth: {type: String, required: true},
  gender: {type: String, enum: ['male', 'female'], required: true},

  //
  companyID: {type: String, required: true},
  employeeID: {type: String, required: true},


  // Contact Information
  contactEmail: {type: String, required: true, unique: true},
  contactNumber: {type: String, required: true},

  // Hire Date and Department
  hireDate: {type: String, required: true},
  department: {type: String, required: true},

  // Role/Position
  role: {type: String, enum: ['departmentHead', 'employee'], required: true},
  password: {type: String, required: true},

  adharID: {type: String},
  photo: {type: String},
  isActive: {type: Boolean},
});

// Compound index on email and CompanyID
// employeeSchema.index({email: 1, CompanyID: 1}, {unique: true});

const Employee = mongoose.model('poni', employeeSchema);

module.exports = Employee;
