/* eslint-disable max-len */
const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const {checkToken, isCompanyAdmin, isCompanyAdminOrDepartmentHead}=require('./../../utilities/jwtUtilis');
const {userData}= require('./../../controllers/commonController/commonControl');
const {getProfileData, updateProfile, profileName}= require('./../../controllers/commonController/profileController');
const {getComplaintsList}= require('./../../controllers/commonController/complaintsController');
const upload = require('./../../utilities/multer');
const {addToCollection}=require('./../../controllers/commonController/notificationController');

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

router.get('/profileInfo', [
  checkToken,
  profileName,
]);

module.exports = router;
