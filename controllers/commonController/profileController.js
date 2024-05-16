/* eslint-disable max-len */
const Employee = require('./../../models/employee');
const Company = require('./../../models/company');

// Function to fetch profile data of an employee
const getProfileData = async (req, res) => {
  const {employeeID, companyID} = req.user;

  try {
    // Check if an employee with the given employeeID exists
    const employeeProfile = await Employee.findOne({employeeID});

    if (employeeProfile) {
      // If employee exists, fetch their profile data
      const employeeData = await Employee.aggregate([
        {
          $match: {
            employeeID,
            companyID,
          },
        },
        {
          $project: {
            _id: 0,
            employeeName: 1,
            gender: 1,
            contactEmail: 1,
            contactNumber: 1,
            department: 1,
            dateOfBirth: 1,
            address: 1,
            secondPhoneNumber: 1,
            bio: 1,
            photo: 1,
          },
        },
      ]);

      res.status(200).json({
        success: true,
        data: employeeData,
        message: 'Profile fetched successfully',
      });
    } else {
      // If employee not found, return error message
      res.status(404).json({
        success: false,
        message: 'Employee data not found',
      });
    }
  } catch (error) {
    // Handle any errors that occur during the database operation
    console.error('Error fetching employee profile:', error);
    res.status(500).json({success: false, message: 'Internal server error'});
  }
};

// Function to update employee profile
const updateProfile = async (req, res, next) => {
  try {
    const {employeeID} = req.user;
    const {name, age, email, gender, phoneNumber, secondPhoneNumber, bio, address} = req.body;
    const photo = req?.file?.location;

    // Update employee data
    const updatedEmployee = await Employee.findOneAndUpdate(
        {employeeID},
        {
          $set: {
            name,
            age,
            email,
            gender,
            phoneNumber,
            secondPhoneNumber,
            address,
            bio,
            photo,
          },
        },
        {new: true}, // To return the updated document
    );

    res.status(200).json({success: true, message: 'Employee profile updated successfully', data: updatedEmployee});
  } catch (error) {
    console.error('Error updating employee profile:', error);
    res.status(500).json({success: false, message: 'Internal server error'});
  }
};


// Function to fetch profile name based on user role
const profileName = async (req, res) => {
  const {employeeID, role, companyID} = req.user;

  try {
    if (role === 'companyAdmin') {
      // If user is a company admin, fetch company name and photo
      const company = await Company.aggregate([
        {
          $match: {companyID},
        },
        {
          $project: {
            name: '$companyName',
            _id: 1,
            photo: 1,
          },
        },
      ]);

      res.status(200).json({
        success: true,
        data: company,
        message: 'Profile name fetched successfully',
      });
    } else if (role === 'employee' || role === 'departmentHead') {
      // If user is an employee or department head, fetch employee name and photo
      const employee = await Employee.aggregate([
        {
          $match: {employeeID},
        },
        {
          $project: {
            name: '$employeeName',
            _id: 1,
            photo: 1,
          },
        },
      ]);

      res.status(200).json({
        success: true,
        data: employee,
        message: 'Profile name fetched successfully',
      });
    } else {
      // If user role is not recognized, return unauthorized access error
      res.status(403).json({
        success: false,
        message: 'Unauthorized access',
      });
    }
  } catch (error) {
    // Handle any errors that occur during the database operation
    console.error('Error fetching profile name:', error);
    res.status(500).json({success: false, message: 'Internal server error'});
  }
};

module.exports = {
  getProfileData,
  updateProfile,
  profileName,
};
