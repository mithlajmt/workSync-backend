const Employee = require('../models/employee');

const employeeExist = async (req, res, next)=> {
  try {
    const employeeID = req.query.selected;
    const {companyID}=req.user;

    const employee = await Employee.findOne({employeeID, companyID});

    if (employee) {
      console.log('employee exist ');
      next();
    } else {
      res.status(404).json({
        success: false,
        error: 'Employee not found',
        employeeID});
    }
  } catch (error) {
    console.error('Error checking employee existence: server is down', error);
    // Handle the error appropriately
    throw error;
  }
};

module.exports={
  employeeExist,
};

// Example usage
