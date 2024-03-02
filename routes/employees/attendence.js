const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();

const {checkToken, isAnEmployee}=require('../../utilities/jwtUtilis');
// eslint-disable-next-line max-len
const {submitAttendance,validateCheckIn,checkStatus,checkWorkingDay}=require('../../controllers/employeeControl/attendence');
const upload = require('./../../utilities/multer')


router.post('/attendence', [
  checkToken,
  isAnEmployee,
  checkWorkingDay,
  validateCheckIn,
  checkStatus,
  upload.single('photo'),
  submitAttendance,
]);

module.exports = router;


