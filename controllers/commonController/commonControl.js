const company = require('./../../models/company');
const employee = require('./../../models/employee');
const complaint = require('./../../models/complaint')

const userData = async (req, res) => {
  try {
    const employeeID = req.user.employeeID;
    let userType;

    // Determine user type based on the presence of employeeID
    if (!employeeID) {
      userType = 'COMPANY';
    } else {
      userType = 'EMPLOYEE';
    }

    if (userType === 'EMPLOYEE') {
      const { companyID } = req.user;
      const com = await company.findOne({ companyID });

      if (!com) {
        return res.status(404).json({
          success: false,
          message: 'Company not found',
        });
      }

      const companyName = com.companyName;
      const employeeData = await employee.findOne({ employeeID });

      if (!employeeData) {
        return res.status(404).json({
          success: false,
          message: 'Employee not found',
        });
      }

      // Use aggregation to project specific fields for employee
      const data = await employee.aggregate([
        {
          $match: {
            employeeID: employeeData.employeeID,
          },
        },
        {
          $project: {
            _id: 0,
            role: 1,
            companyName: companyName,
            employeeName: 1,
          },
        },
      ]);

      res.status(200).json({
        success: true,
        data: data,
      });
    } else {
      const { companyID } = req.user;
      const data = await company.aggregate([
        {
          $match: {
            companyID: companyID,
          },
        },
        {
          $project: {
            _id: 0,
            companyName: 1,
            role: 1,
          },
        },
      ]);

      if (!data || data.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Company not found',
        });
      }

      res.status(200).json({
        success: true,
        data: data,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};






module.exports = {
  userData,
};
