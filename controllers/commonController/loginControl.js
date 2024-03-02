/* eslint-disable max-len */
const Company = require('../../models/company');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Employee = require('../../models/employee');
require('dotenv').config();


const checkData = async (req, res) => {
  const {userID, password} = req.body;
  const userType = userID.substring(0, 3);

  if (userType === 'COM') {
    try {
      const user = await Company.findOne({companyID: userID});

      if (user) {
        const {companyID, contactEmail, role, _id, password: hashedPassword} = user;

        const authorised = await bcrypt.compare(password, hashedPassword);

        if (authorised) {
          const secretKey = process.env.JWT_SECRET;
          const payload = {
            companyID,
            contactEmail,
            _id,
            role,
          };

          const token = jwt.sign(payload, secretKey, {
            expiresIn: '2hr',
          });
          console.log(token);

          return res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
          });
        } else {
          // Password doesn't match
          return res.status(401).json({
            success: false,
            message: 'Login failed. Password does not match',
          });
        }
      } else {
        // User not found
        return res.status(404).json({success: false, message: 'Authorization failed. User not found'});
      }
    } catch (error) {
      console.error('Error finding user:', error);
      return res.status(500).json({success: false, message: 'Internal Server Error'});
    }
  } else if (userType === 'EMP') {
    try {
      const user = await Employee.findOne({employeeID: userID}); // note inclde compny also in emp

      if (user) {
        const {companyID, contactEmail, role, password: hashedPassword, _id, employeeID} = user;

        // const authorised = await bcrypt.compare(password, hashedPassword);
         const authorised=true

        if (authorised) {
          const secretKey = process.env.JWT_SECRET;
          const payload = {
            companyID,
            contactEmail,
            employeeID,
            _id,
            role,
          };

          const token = jwt.sign(payload, secretKey, {
            expiresIn: '3h',
          });

          return res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
          });
        } else {
          // Password doesn't match
          return res.status(401).json({
            success: false,
            message: 'Login failed. Password does not match',
          });
        }
      } else {
        // User not found
        return res.status(404).json({success: false, message: 'Authorization failed. User not found'});
      }
    } catch (error) {
      console.error('Error finding user:', error);
      return res.status(500).json({success: false, message: 'Internal Server Error'});
    }
  } else {
    return res.status(400).json({success: false, message: 'Invalid userType'});
  }
};

module.exports = checkData;
