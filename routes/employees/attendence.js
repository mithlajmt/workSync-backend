const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();

const {checkToken, isAnEmployee}=require('../../utilities/jwtUtilis');
// eslint-disable-next-line max-len
const {submitAttendance, validateCheckIn, checkStatus, checkWorkingDay, getAttendenceStatus,checkInExists,registerCheckOut, attendanceType}=require('../../controllers/employeeControl/attendence');
const upload = require('./../../utilities/multer');


router.post('/checkIn', [
  checkToken,
  isAnEmployee,
  // checkWorkingDay,
  validateCheckIn,
  checkStatus,
  // upload.single('photo'),
  submitAttendance,
]);

router.post('/checkOut', [
  checkToken,
  isAnEmployee,
  // checkWorkingDay,
  checkInExists,
  // upload.single('photo'),
  registerCheckOut,
]);

router.get('/status', [
  checkToken,
  isAnEmployee,
  getAttendenceStatus,
]);

router.get('/type', [
  checkToken,
  isAnEmployee,
  attendanceType,
]);

module.exports = router;


