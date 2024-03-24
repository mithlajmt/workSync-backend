/* eslint-disable max-len */
const express = require('express');
const router = express.Router()
const {checkToken, isCompanyAdmin, isCompanyAdminOrDepartmentHead}=require('./../../utilities/jwtUtilis');

const {addToCollection,getNotificationListCompany}=require('./../../controllers/commonController/notificationController');
const upload = require('./../../utilities/multer');




router.get('/notification',[
  checkToken,
  isCompanyAdmin,
  getNotificationListCompany,
])

router.post('/notification', [
    checkToken,
    isCompanyAdmin,
    upload.single('attachment'),
    addToCollection,
  ]);

  module.exports = router