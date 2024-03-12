const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
// eslint-disable-next-line max-len
const {checkToken, isAdmin, isAdminOrDepartmentHead}=require('./../../utilities/jwtUtilis');
const {userData}= require('./../../controllers/commonController/commonControl');
const upload = require('./../../utilities/multer');
// eslint-disable-next-line max-len
const {addToCollection}=require('./../../controllers/commonController/notificationController');

router.get('/userData', [
  checkToken,
  userData,
]);


router.post('/notification', [
  checkToken,
  isAdmin,
  upload.single('attachment'),
  addToCollection,
]);


module.exports = router;
