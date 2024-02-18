const employee = require('../../models/employee');
const jwt = require('jsonwebtoken');
const Employees =require('../../models/employee')
const {hashPassword,generatePassword} = require('../../utilities/password')
const {sendWelcomeEmail} = require('../../utilities/nodemail');



/* eslint-disable require-jsdoc */
 const validateEmployeeFields = async (req,res,next) => {
    const requiredFields = [
      'employeeName',
      'dateOfBirth',
      'gender',
      'contactEmail',
      'contactNumber', // Corrected name from 'phoneNumber' for consistency
      'hireDate',
      'department',
      'role',
    ];
    for (const field of requiredFields) {
      if (!req.body[field]) {
//         // If any required field is missing, return false
         return res.status(400).json({
            success:false,
            message:'please provide all required fields'
        })
      }
      
    }
    console.log(req.body,'hi');
    next()
    // All required fields are present
   
  }







const validateToken = async (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    const secretKey = process.env.JWT_SECRET
  
    if (!token) {
      console.log('notoken');
      return res.status(401).json({
        success: false,
        message: 'Authorization header missing unautharized access',
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
        message: 'Invalid token:',
      });
    }
  };


  const checkRole = async (req,res,next)=>{
    const {role}=req.user
    if(role === 'companyAdmin'){
      next()
    }
    else{
      console.log('no-admin');
      res.status(401).json({
        success: false,
        message: 'Authorisation deneid !',
      })
    }
    
  }

  const checkExisting = async (req,res,next)=>{
    const {companyID}=req.user
    const {contactEmail}=req.body
    console.log(req.body);
    console.log(companyID,contactEmail);
    const existingUser = await employee.findOne({contactEmail,companyID});
    if (existingUser){
      console.log('existing user');
      res.status(401).json({
        success: false,
        message: 'email already in use by an existing employee in the firm ',
      })
    }else{
      next()
    }

  }

  const generateEmployeeID = async (req, res, next) => {
    try {
      const { contactNumber, contactEmail, employeeName, hiringDate } = req.body;
  
      // Extract first 3 letters from employeeName
      const employeeNameAbbreviation = employeeName.slice(0, 3).toUpperCase();
  
      // Extract 2 letters from email
      const emailAbbreviation = contactEmail.slice(0, 2).toUpperCase();
  
      // Extract last 3 digits from contactNumber
      const lastThreeDigits = contactNumber.slice(-3);
  
      // Extract day of hiring
      const dayOfHiring = new Date(hiringDate).getDate();
  
      // Generate a random number (between 100 and 999)
      const randomNumber = Math.floor(Math.random() * (999 - 100 + 1)) + 100;
  
      // Concatenate the components to form the unique employee ID
      const employeeID =
        'EMP-' +
        employeeNameAbbreviation +
        emailAbbreviation +
        lastThreeDigits +
        dayOfHiring +
        randomNumber;
  
      // Use the generated employeeID as needed
      console.log('Generated Employee ID:', employeeID);
      req.employeeID=employeeID
      console.log(req.employeeID,'employee ID');
  
      // You can send the employeeID in the response or store it as needed
  
      // Continue with the next middleware or response handling
      next();
    } catch (error) {
      // Handle any errors that might occur during the ID generation process
      console.error('Error generating employee ID:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  const addEmployeeToDatabase = async (req,res)=>{
    const {
      // Personal Information
      employeeName,
      dateOfBirth,
      gender,
    
      // Company Information
    
      // Contact Information
      contactEmail,
      contactNumber,
    
      // Hire Date and Department
      hireDate,
      department,
    
      // Role/Position
      position,
      role,
    
      identityproof,
      photo,
    } = req.body;

    
    
    const status=true;
    const employeeID = req.employeeID;
    const {companyID}=req.user;

    const password = generatePassword(employeeName,contactEmail);
    console.log(req.employeeID);
    console.log('dfghjkl',employeeID);
    const securityPass = await hashPassword(password)

    const newEmployee = new Employees({
            // Personal Information
            employeeName,
    
            dateOfBirth,
            gender,
          
            // Company Information
          
            // Contact Information
            contactEmail,
            contactNumber,
          
            // Hire Date and Department
            hireDate,
            department,
          
            // Role/Position
            position,
            role,
          
            identityproof,
            photo,
            status,
            employeeID,
            companyID,
            password: securityPass,
    })

    await newEmployee.save();
    await sendWelcomeEmail(contactEmail,employeeID,password);
    res.status(200).json({
      success:true,
      message:'user added successfully'
    })
    
  }
  

module.exports = {
  validateToken,
  checkRole,
  validateEmployeeFields,
  checkExisting,
  generateEmployeeID,
  addEmployeeToDatabase,
};



