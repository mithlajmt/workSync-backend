/* eslint-disable max-len */
const employees = require('../../models/employee');
const getFullEmployeeList = async (req, res) => {
  try {
    const {companyID} = req.user;
    console.log(companyID);
    const employeeList = await employees.aggregate([
      {
        $match: {companyID: companyID, isActive: true},
      },
    ]);
    res.json(employeeList);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({error: 'Internal Server Error'});
  }
};


const terminateEmployee = async (req, res) => {
  try {
    const employeeID = req.params.employeeID;
    console.log(employeeID);
    const {companyID} = req.user;
    console.log(companyID);

    // Use updateOne directly, and await the operation
    const result = await employees.findOneAndUpdate(
        {
          companyID: companyID,
          employeeID: employeeID,
        },
        {$set: {isActive: false}},
        {new: true},
    );

    if (result) {
      console.log('Employee terminated successfully.');
      // eslint-disable-next-line max-len
      res.status(200).json({success: true, message: 'Employee terminated successfully.'});
    } else {
      console.log('Employee not found or not updated.');
      res.status(404).json({success: false, message: 'Employee not found or not updated.'});
    }
  } catch (err) {
    console.error('Error terminating employee:', err);
    res.status(500).json({success: false, message: 'Internal server error.'});
  }
};


const employeeData = async (req, res, next) => {
  try {
    const {companyID} = req.user;
    const employeeID = req.params.employeeID;
    // console.log('hi', employeeID);

    // Assuming `employees` is a model or database collection
    // and you're using async/await for database operations
    const employee = await employees.findOne({
      companyID,
      employeeID,
    });

    // Check if employee is found
    if (employee) {
      res.json({
        success: true,
        data: employee,
      });
    } else {
      res.json({
        success: false,
        message: 'Employee not found',
      });
    }
  } catch (error) {
    console.error('Error fetching employee data:', error);

    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

const editEmployeedata = async (req, res) => {
  const {companyID} = req.user;
  const employeeID = req.params.employeeID;
  const filter = {companyID, employeeID};
  const update = req.body;

  try {
    const updatedEmployee = await employees.findOneAndUpdate(filter, update, {new: true});
    console.log('Document updated successfully:', updatedEmployee);
    res.status(200).json({success: true, message: 'Employee updated successfully.'});
  } catch (error) {
    console.error('Error updating document:', error);
    res.status(500).json({success: false, message: 'Internal server error.'});
  }
};


const photo = async (req, res, next)=>{
  // res.json({
  //   m:'hi u won'
  // })
  console.log('hi')
  next()
}


module.exports={
  getFullEmployeeList,
  terminateEmployee,
  employeeData,
  editEmployeedata,
  photo,
};
