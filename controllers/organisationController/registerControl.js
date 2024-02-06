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



const otpVerify= async (req, res)=>{
  try {
    const {otp, username, email, password, phoneNumber, role}=req.body;
    const phone=+phoneNumber;

    // verification check
    const verificationCheck =await client.verify.v2.services(serviceSid)
        .verificationChecks.create({to: '+918606893474', code: otp});
        console.log(verificationCheck.status);
  }
  catch(err){
    console.log(err.message);
    console.log('hmm verification work but failed');
  }
}
// Export the functions for external use
module.exports = {
  getOtp,
  otpVerify,
};
