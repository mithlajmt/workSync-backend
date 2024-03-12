// Import required modules and functions
const express = require('express');
const router = express.Router();

const {
  checkToken,
  isCompanyAdminOrDepartmentHead,
} = require('./../../utilities/jwtUtilis');

const {
  getDepartment,
} = require('./../../controllers/departmentHeadController/basicController');


// Define a route for getting department by ID
router.get('/department/:ID', [
  // Middleware for checking token
  checkToken,

  // Middleware for checking if the user is an admin or department head
  isCompanyAdminOrDepartmentHead,

  getDepartment,
]);

// Export the router for use in other files
module.exports = router;
