/* eslint-disable max-len */
require('dotenv').config();
const validator = require('validator');
const twilio = require('twilio');
const bcrypt = require('bcrypt');
const Company = require('../../models/company');
const jwt = require('jsonwebtoken');
// const nodemailer = require('nodemailer');


const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authId = process.env.TWILIO_AUTH_TOKEN;
const serviceSid = process.env.TWILIO_SERVICE_SID;
const countryCode = process.env.COUNTRY_CODE;

const client = twilio(accountSid, authId);

// Asynchronous function to generate and send OTP
const otpGenerate = async function(phone) {
  console.log('OTP function invoked');

  try {
    // Create a verification request using Twilio's Verify API
    await client.verify.v2.services(serviceSid)
        .verifications.create({to: `${countryCode}${phone}`, channel: 'sms'});
  } catch (err) {
    console.error('Error generating OTP:', err.message);
    throw err;
  }
};

// Function to handle OTP generation request
const getOtp = async (req, res, next) => {
  const {contactNumber} = req.body;

  // Convert contactNumber to string
  const formattedContactNumber = String(contactNumber);
  console.log('Formatted Contact Number:', formattedContactNumber);

  // Generate OTP and handle the result
  try {
    await otpGenerate(formattedContactNumber);
    next();
    // res.json('OTP generated successfully');
  } catch (err) {
    console.error('Error in OTP generationgggg:', err.message);
    res.status(500).json('Error generating OTP');
  }
};

// Function to handle OTP verification
const otpVerify = async (req, res, next) => {
  const {contactNumber, otp} = req.body.otp;

  try {
    const formattedContactNumber = String(contactNumber);

    // Verification check using Twilio's Verify API
    const verificationCheck = await client.verify.v2.services(serviceSid)
        .verificationChecks.create({to: `${countryCode}${formattedContactNumber}`, code: otp});


    console.log(verificationCheck.status);
    console.log(verificationCheck);

    if (verificationCheck.status === 'approved') {
      next();
    } else {
      res.status(200).json({
        success: false,
        message: 'OTP verification failed, please retry again',
      });
    }
  } catch (err) {
    res.status(401).json({
      success: false,
      data: {
        message: 'OTP verification failed.',
      },
    });
  }
};

// Middleware to check required company data
const checkCompanyData = (req, res, next) => {
  const {
    companyName,
    contactEmail,
    contactNumber,
    password,
    confirmPassword,
    workingHours,
    terms,
  } = req.body;

  const missingFields = [];

  if (!companyName) missingFields.push('companyName');
  if (!contactEmail) missingFields.push('contactEmail');
  if (!contactNumber) missingFields.push('contactNumber');
  if (!workingHours) missingFields.push('workingTime');
  if (!password) missingFields.push('password');
  if (!confirmPassword) missingFields.push('confirmPassword');
  if (terms === undefined || terms === null) missingFields.push('terms');

  if (missingFields.length > 0) {
    console.error(`Missing fields: ${missingFields.join(', ')}`);
    return res.status(400).json({
      success: false,
      data: {
        message: 'Invalid data set. Please provide all the required fields.',
        missingFields: missingFields,
      },
    });
  }

  // All required fields present, proceed to the next middleware or route handler
  next();
};

// Middleware for pattern validation
const patternValidation = async (req, res, next) => {
  const passPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const {contactEmail, password, confirmPassword} = req.body;

  if (!passPattern.test(password)) {
    console.error('Password does not match the pattern');
    return res.status(401).json({
      success: false,
      data: {
        message: 'Password does not match the pattern.',
      },
    });
  }

  if (!validator.isEmail(contactEmail)) {
    console.error('Invalid email format');
    return res.status(400).json({
      success: false,
      data: {
        message: 'Invalid email format.',
      },
    });
  }

  if (password !== confirmPassword) {
    console.error('Password and confirmPassword do not match');
    return res.status(401).json({
      success: false,
      data: {
        message: 'Password and confirmPassword do not match.',
      },
    });
  }

  next();
};

// Middleware to check if email and phone are already used
const isEmailAndPhoneAlreadyUsed = async (req, res, next) => {
  try {
    const {contactEmail, contactNumber} = req.body;

    const existingEmail = await Company.findOne({contactEmail: contactEmail});
    const existingNumber = await Company.findOne({contactNumber: contactNumber});

    if (existingEmail && existingNumber) {
      return res.status(400).json({
        success: false,
        data: {
          message: 'Email and phone number already used',
        },
      });
    } else if (existingEmail) {
      return res.status(400).json({
        success: false,
        data: {
          message: 'Email already used by an existing account',
        },
      });
    } else if (existingNumber) {
      return res.status(400).json({
        success: false,
        data: {
          message: 'Phone number already used by an existing account',
        },
      });
    }

    next();
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      data: {
        message: 'Internal server error',
      },
    });
  }
};


// Combined function to generate a company ID with "COM-" prefix
const generateCompanyID = async (companyName, contactNumber) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  // Remove any non-alphabetic characters and convert to uppercase
  const sanitizedCompanyName = companyName.replace(/[^a-zA-Z]/g, '').toUpperCase();

  // Take the first three letters of the company name
  const firstThreeLetters = sanitizedCompanyName.slice(0, 3);

  // Take the last three digits of the contact number
  const lastThreeDigits = contactNumber.slice(-3);

  // Generate a random string of length 4
  let randomString = '';
  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(randomIndex);
  }

  // Combine the parts to create the company ID with "COM-" prefix
  const companyID = `COM-${firstThreeLetters}${lastThreeDigits}${randomString}`;
  console.log(companyID);
  return companyID;
};


const hashPassword = async (password) => {
  const saltRound = 10;
  const salt = await bcrypt.genSalt(saltRound);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

const verifyRegistration = async (req, res) => {
  const {
    companyName,
    industry,
    contactEmail,
    contactNumber,
    password,
    terms,
    workingHours,
  } = req.body.otp;
  console.log(workingHours);

  const startTime = workingHours.split('-')[0];
  const endTime = workingHours.split('-')[1];

  try {
    const companyID = await generateCompanyID(companyName, contactNumber);
    const securitypass = await hashPassword(password);
    const verified = true;

    const newCompany = new Company({
      companyName,
      industry,
      contactEmail,
      contactNumber,
      password: securitypass,
      terms,
      companyID,
      verified,
      workingHours: {
        startTime,
        endTime,
      },
      role: 'companyAdmin',
    });

    await newCompany.save();

    const secretKey = process.env.JWT_SECRET;
    const payload={
      companyID,
      contactEmail,
      role: 'companyAdmin',
    };


    const token = jwt.sign(payload, secretKey, {
      expiresIn: '1hr',
    });


    res.status(200).json({
      success: true,
      message: 'Registration successful',
      token,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      data: {
        message: err.message,
      },
    });
  }
};


module.exports = {
  getOtp,
  otpVerify,
  verifyRegistration,
  checkCompanyData,
  patternValidation,
  isEmailAndPhoneAlreadyUsed,
};
