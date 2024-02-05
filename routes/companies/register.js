/* eslint-disable new-cap */
// requiring express
const express = require('express');
// eslint-disable-next-line max-len
const {getOtp} = require('../../controllers/organisationController/registerControl');

// using express router

// eslint-disable-next-line new-cap
// register.js


const router = express.Router();

router.post('/get-otp', getOtp);

module.exports = router;
