/* eslint-disable max-len */
/* eslint-disable new-cap */
// requiring express
const express = require('express');
// eslint-disable-next-line max-len
const {getOtp, otpVerify} = require('../../controllers/organisationController/registerControl');
// using express router

// eslint-disable-next-line new-cap
// register.js


const router = express.Router();

router.post('/get-otp', getOtp);
router.post('/verify-otp', otpVerify)
// router.post('/verify-otp')

module.exports = router;
