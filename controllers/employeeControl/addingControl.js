const employee = require('../../models/employee');
const jwt = require('jsonwebtoken');
const Employees = require('../../models/employee');
const {hashPassword, generatePassword} = require('../../utilities/password');
const {sendWelcomeEmail} = require('../../utilities/nodemail');

const validateEmployeeFields = async (req, res, next) => {
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
      return res.status(400).json({
        success: false,
        message: `Please provide the required field: ${field}`,
      });
    }
  }

  console.log(req.body, 'hi');
  next();
};

const validateToken = async (req, res, next) => {
  // eslint-disable-next-line max-len
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  const secretKey = process.env.JWT_SECRET;

  if (!token) {
    console.log('notoken');
    return res.status(401).json({
      success: false,
      message: 'Authorization header missing, unauthorized access',
    });
  }

  try {
    const decodedToken = jwt.verify(token, secretKey);
    req.user = decodedToken;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired. Please re-authenticate.',
      });
    } else {
      console.error(error);
      return res.status(401).json({
        success: false,
        message: 'Invalid token.',
      });
    }
  }
};

const checkRole = async (req, res, next) => {
  const {role} = req.user;

  if (role === 'companyAdmin') {
    next();
  } else {
    console.log('no-admin');
    res.status(403).json({
      success: false,
      message: 'Authorization denied. Insufficient role privileges',
    });
  }
};

const checkExisting = async (req, res, next) => {
  const {companyID} = req.user;
  const {contactEmail} = req.body;

  console.log(req.body);
  console.log(companyID, contactEmail);

  try {
    const existingUser = await employee.findOne({contactEmail, companyID});

    if (existingUser) {
      console.log('existing user');
      return res.status(409).json({
        success: false,
        message: 'Email already in use by an existing employee in the firm',
      });
    } else {
      next();
    }
  } catch (error) {
    console.error('Error checking existing user:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error while checking existing user',
    });
  }
};

const generateEmployeeID = async (req, res, next) => {
  try {
    const {contactNumber, contactEmail, employeeName, hiringDate} = req.body;

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
    req.employeeID = employeeID;
    console.log(req.employeeID, 'employee ID');

    // You can send the employeeID in the response or store it as needed

    // Continue with the next middleware or response handling
    next();
  } catch (error) {
    // Handle any errors that might occur during the ID generation process
    console.error('Error generating employee ID:', error);
    // eslint-disable-next-line max-len
    res.status(500).json({success: false, message: 'Internal Server Error while generating employee ID'});
  }
};

const addEmployeeToDatabase = async (req, res) => {
  try {
    let {
      // Personal Information
      employeeName,
      dateOfBirth,
      gender,
      salary,

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

    const status = true;
    const employeeID = req.employeeID;
    const {companyID} = req.user;

    const password = generatePassword(employeeName, contactEmail);

    const securityPass = await hashPassword(password);


    const departmentHead = await Employees.aggregate(
        [
          {
            $match: {department},
          },
        ],
    );

    if (departmentHead.length === 0) {
      role = 'departmentHead';
      console.log('No department heads found for the specified department.');
    }


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
      salary,

      // Role/Position
      position,
      role,

      identityproof,
      photo,
      status,
      employeeID,
      companyID,
      password: securityPass,
    });

    await newEmployee.save();
    await sendWelcomeEmail(contactEmail, employeeID, password);
    res.status(201).json({
      success: true,
      message: 'Employee added successfully',
      note: 'userID and password shared to employee email',
    });
  } catch (error) {
    console.error('Error adding employee to database:', error);
    // eslint-disable-next-line max-len
    res.status(500).json({success: false, message: 'Internal Server Error while adding employee to database'});
  }
};

module.exports = {
  validateToken,
  checkRole,
  validateEmployeeFields,
  checkExisting,
  generateEmployeeID,
  addEmployeeToDatabase,
};
