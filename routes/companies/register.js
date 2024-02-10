
// requiring express
const express = require('express');
// eslint-disable-next-line max-len
const {getOtp, otpVerify,verifyRegistration,checkCompanyData,patternValidation,isEmailAndPhoneAlreadyUsed} = require('../../controllers/organisationController/registerControl');
const bodyParser = require('body-parser');


// eslint-disable-next-line new-cap
const router = express.Router();

router.post('/get-otp',
checkCompanyData,patternValidation,isEmailAndPhoneAlreadyUsed,getOtp,);
router.post('/verify-otp', otpVerify,verifyRegistration);
// router.post('/verify-otp')

module.exports = router;
