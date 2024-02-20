const Department = require('../../models/department');
require('dotenv').config();
const jwt = require('jsonwebtoken');

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
  const {departmentName} = req.body;

  console.log(req.body);

  try {
    const existingDep = await Department.findOne({departmentName, companyID});

    if (existingDep) {
      console.log('existing dep');
      return res.status(409).json({
        success: false,
        message: 'Email already in use by an existing employee in the firm',
      });
    } else {
      next();
    }
  } catch (error) {
    console.error('Error creating dep:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error while generatin department',
    });
  }
};


// const generateID = async(req,res)=>{

// }

const storeDepartment = async (req, res, next)=>{
  try {
    const {departmentName, description, budgetAllocation: budget} = req.body;
    const {companyID} = req.user;

    const newDepartment = new Department({
      departmentName,
      description,
      companyID,
      budget,
    });

    await newDepartment.save();
    res.status(201).json({
      success: true,
      message: 'User added successfully',
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
  checkExisting,
  storeDepartment,
};
