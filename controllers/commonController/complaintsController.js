const Complaints = require('./../../models/complaint');
const Employee = require('./../../models/employee');

const getComplaintsList = async (req, res)=>{
  try {
    const {companyID, role, employeeID} = req.user;

    const complaintsPipeline = [
      {
        $match: {companyID, recipient: role},
      },
      {
        $lookup: {
          from: 'employees',
          localField: 'employeeID',
          foreignField: 'employeeID',
          as: 'employeedata',
        },
      },
      {
        $project: {
          '_id': 0,
          'title': 1,
          'attachment': 1,
          'description': 1,
          'employeeID': 1,
          'recipient': 1,
          'employeedata.employeeName': 1,
          'employeedata.department': 1,
        },
      },
    ];

    if (role==='departmentHead') {
      const dephead = await Employee.findOne({employeeID});
      const dep = dephead.department;
      complaintsPipeline.push({$match: {'employeedata.department': dep}});
    }

    const complaints = await Complaints.aggregate(complaintsPipeline);
    console.log(complaints);

    res.json({
      data: complaints,
    });
  } catch (error) {
    console.error('Error fetching unreviewed complaints:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
    });
  }
};

module.exports={
  getComplaintsList,
};
