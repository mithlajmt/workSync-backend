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

const {
  getNotificationList,
} = require('./../../controllers/commonController/notificationController');


router.get('/department/:ID', [
  checkToken,
  isCompanyAdminOrDepartmentHead,
  getDepartment,
]);

router.get('/notification', [
  checkToken,
  isCompanyAdminOrDepartmentHead,
  getNotificationList,
]);

// Export the router for use in other files
module.exports = router;
