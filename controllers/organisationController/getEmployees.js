const employees = require('../../models/employee');
const getFullEmployeeList = async (req, res)=>{
  try {
    console.log('hi');
    const {companyID} =req.user;
    console.log(companyID);
    employeeList = await employees.aggregate([
      {
        $match: {companyID: {$eq: companyID}},
      },
    ]);
    res.json(employeeList);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({error: 'Internal Server Error'});
  }
};

module.exports={
  getFullEmployeeList,
};
