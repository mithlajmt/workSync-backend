/* eslint-disable max-len */
const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const {checkToken, isCompanyAdmin, isCompanyAdminOrDepartmentHead}=require('./../../utilities/jwtUtilis');
const {userData, addTask, getTask, editTask, deleteTask}= require('./../../controllers/commonController/commonControl');
const {getProfileData, updateProfile, profileName}= require('./../../controllers/commonController/profileController');
const {getComplaintsList, EditComplaint, getMyComplaints}= require('./../../controllers/commonController/complaintsController');
const upload = require('./../../utilities/multer');
const {addToCollection}=require('./../../controllers/commonController/notificationController');
const {getChatlist, recieverProfile, getMessages} = require('./../../controllers/commonController/chatController');
const {getFullEmployeeData}=require('../../controllers/organisationController/employeesreq');
const {getDepId}=require('./../../controllers/departmentHeadController/basicController');
const {calendarData} = require('./../../controllers/commonController/notificationController');
const saveContact = require('./../../controllers/commonController/portfolioController');
const {getEmployeeAttendance}=require('./../../controllers/employeeControl/attendence')

router.get('/userData', [
  checkToken,
  userData,
]);


router.post('/notification', [
  checkToken,
  isCompanyAdmin,
  upload.single('attachment'),
  addToCollection,
]);

router.get('/complaintsList', [
  checkToken,
  isCompanyAdminOrDepartmentHead,
  getComplaintsList,
]);

router.patch('/complaintsList/:id', [
  checkToken,
  isCompanyAdminOrDepartmentHead,
  EditComplaint,
]);
router.get('/profile', [
  checkToken,
  getProfileData,
]);

router.patch('/profile', [
  checkToken,
  upload.single('image'),
  updateProfile,
]);

router.get('/profileInfo', [
  checkToken,
  profileName,
]);

router.post('/todo', [
  checkToken,
  addTask,
]);
router.get('/todo', [
  checkToken,
  getTask,
]);

router.patch('/todo', [
  checkToken,
  editTask,
]);

router.delete('/todo/:id', [
  checkToken,
  deleteTask,
]);

router.get('/chatlist', [
  checkToken,
  getChatlist,
]);

router.get('/recieverProfile/:id', [
  checkToken,
  recieverProfile,
]);

router.get('/messages/:id',
    [
      checkToken,
      getMessages,
    ]);

router.get('/employee/:id',
    [
      checkToken,
      getFullEmployeeData,
    ]);

router.get('/complaints',
    [
      checkToken,
      getMyComplaints,
    ]);

router.get('/events',
    [
      checkToken,
      calendarData,
    ]);

router.get('/departmentID',
    [
      checkToken,
      isCompanyAdminOrDepartmentHead,
      getDepId,
    ]);

router.post('/submit', [
  saveContact,
]);

router.get('/attendance/:id', [
  checkToken,
  isCompanyAdminOrDepartmentHead,
  getEmployeeAttendance,

]);

module.exports = router;
