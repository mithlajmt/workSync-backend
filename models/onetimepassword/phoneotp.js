// Load environment variables from a .env file
require('dotenv').config();

// Retrieve Twilio credentials and configuration from environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authId = process.env.TWILIO_AUTH_TOKEN;
const serviceSid = process.env.TWILIO_SERVICE_SID;
const countryCode = process.env.COUNTRY_CODE;

// Import the Twilio library
// phoneotp.js

// ... (other imports)

// Import the Twilio library
const twilio = require('twilio');

// Create a Twilio client using the retrieved credentials
const client = twilio(accountSid, authId);

// Define an asynchronous function to generate and send OTP
const otpGenerate = async function(phone) {
  console.log('otp function invoked');
  console.log('Country Code:', countryCode);
  console.log('Phone:', phone);

  // Create a verification request using Twilio's Verify API
  verification = await client.verify.v2.services(`${serviceSid}`)
      .verifications.create({to: `+91${phone}`, channel: 'sms' });
};

// Export the OTP generation function for external use
module.exports = {
  otpGenerate,
};
