const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();

const {checkToken, isAnEmployee}=require('../../utilities/jwtUtilis');
const {getLeaveRequest} = require('../../controllers/organisationController/leaveRequest')
// eslint-disable-next-line max-len
const {
  submitAttendance,
  validateCheckIn,
  checkStatus,
  checkWorkingDay,
  getAttendanceStatus,
  checkInExists,
  registerCheckOut,
  attendanceType,
  validateLeaveDays,
  registerLeaveRequest
} = require('../../controllers/employeeControl/attendence');

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
  getAttendanceStatus,
]);

router.get('/type', [
  checkToken,
  isAnEmployee,
  attendanceType,
]);

router.post('/leaveRequest', [
  checkToken,
  isAnEmployee,
  upload.single('attachment'),
  validateLeaveDays,
  registerLeaveRequest,
]);

router.get('/leaveRequest',[
  checkToken,
  getLeaveRequest,
])


module.exports = router;


