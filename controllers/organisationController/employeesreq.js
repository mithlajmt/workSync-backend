/* eslint-disable max-len */
const employees = require('../../models/employee');
const getFullEmployeeList = async (req, res) => {
  try {
    const { companyID } = req.user;
    console.log(companyID);
    const employeeList = await employees.aggregate([
      {
        $match: { companyID: companyID, isActive: true }
      },
    ]);
    res.json(employeeList);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const terminateEmployee = async (req, res) => {
  try {
    const employeeID = req.query.selected;
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
      // The result.nModified is a property provided by MongoDB's updateOne operation.
      // It represents the number of documents that were actually modified during the update.
      //  If nModified is greater than 0, it means that at least one document was found and successfully updated.

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

module.exports={
  getFullEmployeeList,
  terminateEmployee,
};
