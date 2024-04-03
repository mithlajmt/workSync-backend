/* eslint-disable max-len */
const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const {checkToken, isCompanyAdmin, isCompanyAdminOrDepartmentHead}=require('./../../utilities/jwtUtilis');
const {userData, addTask, getTask}= require('./../../controllers/commonController/commonControl');
const {getProfileData, updateProfile, profileName}= require('./../../controllers/commonController/profileController');
const {getComplaintsList,EditComplaint}= require('./../../controllers/commonController/complaintsController');
const upload = require('./../../utilities/multer');
const {addToCollection}=require('./../../controllers/commonController/notificationController');
const {getChatlist, recieverProfile, getMessages} = require('./../../controllers/commonController/chatController');
const{getFullEmployeeData}=require('../../controllers/organisationController/employeesreq')

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


module.exports = router;
