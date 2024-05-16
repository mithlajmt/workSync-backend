// Import required modules and functions
const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();

const {
  checkToken,
  isCompanyAdminOrDepartmentHead,
} = require('./../../utilities/jwtUtilis');

const {
  getDepartment,
} = require('./../../controllers/departmentHeadController/basicController');


router.get('/department/:ID', [
  checkToken,
  isCompanyAdminOrDepartmentHead,
  getDepartment,
]);

// Export the router for use in other files
module.exports = router;
