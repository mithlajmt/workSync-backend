// Import required modules and initialize Twilio client
require('dotenv').config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authId = process.env.TWILIO_AUTH_TOKEN;
const serviceSid = process.env.TWILIO_SERVICE_SID;
const countryCode = process.env.COUNTRY_CODE;
const twilio = require('twilio');
const client = twilio(accountSid, authId);

// Asynchronous function to generate and send OTP
const otpGenerate = async function(phone) {
  console.log('OTP function invoked');

  try {
    // Create a verification request using Twilio's Verify API
    const verification = await client.verify.v2.services(serviceSid)
        .verifications.create({to: `+${countryCode}${phone}`, channel: 'sms'});

    console.log(verification.status);
  } catch (err) {
    console.error('Error generating OTP:', err.message);
    throw err;
  }
};


// Function to handle OTP generation request
const getOtp = (req, res) => {
  // Destructure request body
  const {
    companyName,
    industry,
    contactEmail,
    contactNumber,
    password,
    confirmPassword,
    terms,
  } = req.body;

  // Convert contactNumber to string
  const formattedContactNumber = String(contactNumber);
  console.log('Formatted Contact Number:', formattedContactNumber);

  // Generate OTP and handle the result
  otpGenerate(formattedContactNumber)
      .then(() => {
        res.json('OTP generated successfully');
      })
      .catch((err) => {
        console.error('Error in OTP generation:', err.message);
        res.status(500).json('Error generating OTP');
      });
};





const otpVerification = async function(otp) {
  console.log('OTP function invoked');
    try {
      const verification_check = await twilio.verify.v2
        .services(serviceId)
        .verificationChecks.create({ to: `+91${phone}`, code: otp });

      console.log(verification_check.status);
  } catch (err) {
    console.error('Error generating OTP:', err.message);
    throw err;
  }
};

const otpVerify = (req, response)=>{
  console.log(req.body, 'minuthaj');
  onetp = req.body
  otpVerification(req.body)
  .then((data)=>{
    console.log(data);
  })
  response.status(200).json({ user: 'savedUser', success: true })}
// Export the functions for external use
module.exports = {
  getOtp,
  otpVerify,
};
