// Require necessary modules
const express = require('express');
const {
  getOtp,
  otpVerify,
  verifyRegistration,
  checkCompanyData,
  patternValidation,
  isEmailAndPhoneAlreadyUsed,
} = require('../../controllers/organisationController/registerControl');
const bodyParser = require('body-parser');

// Create an Express router
// eslint-disable-next-line new-cap
const router = express.Router();

// Apply body-parser middleware for parsing incoming request bodies
router.use(bodyParser.json());

// Define routes with middleware and comments
router.post('/get-otp', [
  // Validate company data whether all data is available
  checkCompanyData,
  // check whether it follows the pattern for pass and email
  patternValidation,
  // Check for existing email and phone numbers used by any existing user
  isEmailAndPhoneAlreadyUsed,
  // Send OTP using twilio
  getOtp,
]);

router.post('/verify-otp', [
  // Verify OTP
  otpVerify,
  // Complete registration process adding user into collectionn
  verifyRegistration,
]);

// Export the router for use in the main application
module.exports = router;
