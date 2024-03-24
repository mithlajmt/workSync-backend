// Require necessary modules
const express = require('express');
const upload = require('../../utilities/multer');

const {
  validateToken,
  checkRole,
  validateEmployeeFields,
  checkExisting,
  generateEmployeeID,
  addEmployeeToDatabase,
} = require('../../controllers/employeeControl/addingControl');

// eslint-disable-next-line max-len
const {checkToken, isCompanyAdmin}= require('../../utilities/jwtUtilis');
// eslint-disable-next-line max-len
const {
  getFullEmployeeList,
  terminateEmployee,
  employeeData,
  editEmployeedata,
}=require('../../controllers/organisationController/employeesreq');
const {employeeExist}=require('../../utilities/employeeUtils');


// Create an Express router
// eslint-disable-next-line new-cap
const router = express.Router();

// Apply body-parser middleware for parsing incoming request bodies

router.post('/employee', [
  validateToken,
  checkRole,
  upload.single('identityProof'),
  validateEmployeeFields,
  checkExisting,
  generateEmployeeID,
  addEmployeeToDatabase,
]);

router.get('/employee', [
  checkToken,
  isCompanyAdmin,
  getFullEmployeeList,
]);

router.delete('/employee/:employeeID', [
  checkToken,
  isCompanyAdmin,
  employeeExist,
  terminateEmployee,
]);


router.get('/employee/:employeeID', [
  checkToken,
  isCompanyAdmin,
  employeeExist,
  employeeData,
]);

router.put('/employee/:employeeID', [
  checkToken,
  isCompanyAdmin,
  employeeExist,
  editEmployeedata,
]);


module.exports=router;
