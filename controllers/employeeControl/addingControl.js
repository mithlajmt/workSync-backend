const employee = require('../../models/employee');
const jwt = require('jsonwebtoken');

// const jwtDecode = require('jwt-decode');


// import jwt_decode from 'jwt-decode';


/* eslint-disable require-jsdoc */
//  const validateEmployeeFields = async (req,res,next) {
//     const requiredFields = [
//       'firstName',
//       'lastName',
//       'dateOfBirth',
//       'gender',
//       'email',
//       'phoneNumber',
//       'hireDate',
//       'department',
//       'role',
//     ];
//     for (const field of requiredFields) {
//       if (!req.body[field]) {
//         // If any required field is missing, return false
//         res.status(400).json({
//             success:false,
//             message:'please provide all required fields'
//         })
//       }
//     }
//     // All required fields are present
//     next()
//   }


//   const checkDuplicate = async(req,res,next)=>{
//     console.log('sfksafjsaflkjsax');
//     const {email} =req.body
//     const token = jwtDecode(req.headers.authorization)
//     console.log(token);
//     res.send(token,email)
//   }




const checkDuplicate = async (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    const secretKey = process.env.JWT_SECRET
  
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authorization header missing',
      });
    }
  
    try {
      const decodedToken = jwt.verify(token, secretKey); // Replace with your actual secret key
      req.user = decodedToken; // Attach the decoded token data to the request object
      console.log(req.user);
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({
        success: false,
        message: 'Invalid token',
      });
    }
  };
module.exports = { checkDuplicate };


module.exports = { checkDuplicate };

