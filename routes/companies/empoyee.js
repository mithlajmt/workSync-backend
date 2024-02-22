// Require necessary modules
const express = require('express');

const {
  validateToken,
  checkRole,
  validateEmployeeFields,
  checkExisting,
  generateEmployeeID,
  addEmployeeToDatabase,
} = require('../../controllers/employeeControl/addingControl');

// eslint-disable-next-line max-len
const {checkToken, isAdmin}= require('../../utilities/jwtUtilis');
// eslint-disable-next-line max-len
const {getFullEmployeeList,terminateEmployee}=require('../../controllers/organisationController/employeesreq');
const {employeeExist}=require('../../utilities/employeeUtils')


// Create an Express router
// eslint-disable-next-line new-cap
const router = express.Router();

// Apply body-parser middleware for parsing incoming request bodies

router.post('/employee', [
  validateToken,
  checkRole,
  validateEmployeeFields,
  checkExisting,
  generateEmployeeID,
  addEmployeeToDatabase,
]);

router.get('/employee', [
  checkToken,
  isAdmin,
  getFullEmployeeList,
]);

router.delete('/employee', [
  checkToken,
  isAdmin,
  employeeExist,
  terminateEmployee,

]);
module.exports=router;
