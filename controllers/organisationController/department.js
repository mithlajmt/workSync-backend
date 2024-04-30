const Department = require('../../models/department');
require('dotenv').config();
const jwt = require('jsonwebtoken');

const validateToken = async (req, res, next) => {
  // eslint-disable-next-line max-len
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  const secretKey = process.env.JWT_SECRET;

  if (!token) {
    // console.log('notoken');
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

  // console.log(req.body);

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
    const {companyID, departmentID} = req.user;

    const newDepartment = new Department({
      departmentName,
      description,
      companyID,
      budget,
      departmentID,
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

const generateDepartmentID = async (req, res, next) => {
  try {
    const {companyID} = req.user;
    const {departmentName} = req.body;

    // Extract the last two letters of companyID
    const lastTwoCompanyID = companyID.slice(-2);

    // Extract the first two letters of departmentName
    const firstTwoDepartmentName = departmentName.slice(0, 2);

    // Generate two random characters
    const randomChars = Math.random().toString(36).substring(2, 4);

    // Combine the extracted and random values to create a unique ID
    // eslint-disable-next-line max-len
    const departmentID = `${lastTwoCompanyID}${firstTwoDepartmentName}${randomChars}`;

    // Use the generated departmentID as needed
    // console.log(`Generated Department ID: ${departmentID}`);

    // Send the departmentID in the response or perform other actions
    req.user.departmentID = departmentID;

    next();
  } catch (error) {
    console.error('Error generating department ID:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};


const getDepartmentsNames = async (req, res) => {
  try {
    const {companyID} = req.user;

    // Use 'await' to handle the asynchronous operation
    const departmentsData = await Department.aggregate([
      {
        $match: {
          companyID: companyID,
        },
      },
      {
        $project: {
          _id: 0,
          name: '$departmentName',
        },
      },
    ]);

    if (departmentsData.length === 0) {
      // Return a meaningful response when no departments are found
      return res.status(404).json({
        success: false,
        message: 'No departments found for the company at the moment.',
      });
    }

    // Return the successful response with data
    res.status(200).json({
      success: true,
      data: departmentsData,
    });
  } catch (error) {
    // Handle unexpected errors and return a clear error response
    console.error('Error in getDepartmentsNames:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.',
    });
  }
};

// Define an asynchronous function to fetch department data
const getDepartments = async (req, res) => {
  try {
    // Extracting companyID from the user object in the request
    const {companyID} = req.user;

    // Creating a new Date object to represent the current date
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to the beginning of the day

    // Aggregating data for departments with employee and attendance counts
    const departmentsSummary = await Department.aggregate([
      // Stage 1: Match departments based on companyID
      {$match: {companyID}},

      // Stage 2: Left outer join with employees collection
      {
        $lookup: {
          from: 'employees',
          localField: 'departmentName',
          foreignField: 'department',
          as: 'employees',
        },
      },

      // Stage 3: Left outer join with attendances collection
      {
        $lookup: {
          from: 'attendances',
          let: {departmentName: '$departmentName'},
          pipeline: [
            // eslint-disable-next-line max-len
            // Sub-pipeline: Match attendance records for today's date and the current department
            {
              $match: {
                $expr: {
                  $and: [
                    {$eq: ['$department', '$$departmentName']},
                    // eslint-disable-next-line max-len
                    {$gte: ['$date', today]}, // Filter for today's date or later
                  ],
                },
              },
            },
          ],
          as: 'attendance',
        },
      },

      // Stage 4: Project department details and counts
      // Stage 4: Project department details and counts
      {
        $project: {
          departmentName: 1,
          departmentID: 1, // Include departmentID in the projection
          totalEmployees: {$size: '$employees'},
          attendancesToday: {$size: '$attendance'},
        },
      },

    ]);

    // Log the aggregated departmentsSummary for debugging purposes
    // console.log(departmentsSummary);

    // Sending the response with the successfully loaded departmentsSummary
    res.json({
      success: true,
      data: departmentsSummary,
      message: 'Department summary loaded successfully.',
    });
  } catch (error) {
    // Handling errors that may occur during the process
    console.error('Error fetching department summary:', error);
    res.status(500).json({
      success: false,
      // eslint-disable-next-line max-len
      message: 'An error occurred while fetching department summary. Try again later.',
    });
  }
};

const getDepEmployees = async (req, res, next) => {
  try {
    const depID = req.params.ID;


    // Get today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const depEmp = await Department.aggregate([
      {
        $match: {departmentID: depID},
      },
      {
        $lookup: {
          from: 'employees',
          localField: 'departmentName',
          foreignField: 'department',
          as: 'employees',
        },
      },
      {
        $unwind: '$employees', // Unwind the employees array
      },
      {
        $lookup: {
          from: 'attendances',
          let: {empId: '$employees.employeeID'},
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {$eq: ['$employeeID', '$$empId']},
                    {$eq: ['$date', today]}, // Filter for today's date
                  ],
                },
              },
            },
          ],
          as: 'attendance',
        },
      },
      {
        $unwind: {path: '$attendance', preserveNullAndEmptyArrays: true},
      },
      {
        $group: {
          _id: '$_id',
          employees: {
            $push: {
              Name: '$employees.employeeName',
              employeeID: '$employees.employeeID',
              Email: '$employees.contactEmail',
              role: '$employees.role',
              // eslint-disable-next-line max-len
              attendanceStatus: {$ifNull: ['$attendance.status', 'Absent']}, // Include attendance status or default to 'Absent'
            },
          },
        },
      },
    ]);

    // console.log(depEmp);
    res.status(200).json({
      success: true,
      data: depEmp,
      message: 'employee data of the department fetched succesfully',
    }); // Send the department employees data as a response
  } catch (error) {
    console.error('Error fetching department employees:', error);
    res.status(500).json({message: 'Internal server error'});
  }
};


module.exports = {
  validateToken,
  checkRole,
  checkExisting,
  storeDepartment,
  getDepartmentsNames,
  getDepartments,
  generateDepartmentID,
  getDepEmployees,
};
