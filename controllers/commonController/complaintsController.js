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
          '_id': 1,
          'title': 1,
          'attachment': 1,
          'status': 1,
          'description': 1,
          'employeeID': 1,
          'recipient': 1,
          'postDate': 1,
          'employeedata.employeeName': 1,
          'employeedata.department': 1,
          'employeedata.photo': 1,
        },
      },
    ];

    if (role==='departmentHead') {
      const dephead = await Employee.findOne({employeeID});
      const dep = dephead.department;
      complaintsPipeline.push({$match: {'employeedata.department': dep}});
    }

    const complaints = await Complaints.aggregate(complaintsPipeline);

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

const mongoose = require('mongoose');

const EditComplaint = async (req, res) => {
  const id = req.params.id;

  // Convert id to MongoDB ObjectId
  const objectId = new mongoose.Types.ObjectId(id);

  // Update the complaint using findByIdAndUpdate
  try {
    // eslint-disable-next-line max-len
    const complaint = await Complaints.findByIdAndUpdate(objectId, req.body, {new: true});
    // Send response
    res.status(200).json(complaint);
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({message: 'Internal server error'});
  }
};

const getMyComplaints = async (req, res)=>{
  try {
    const {companyID, employeeID} = req.user;

    const complaintsPipeline = [
      {
        $match: {companyID, employeeID},
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
          '_id': 1,
          'title': 1,
          'attachment': 1,
          'status': 1,
          'description': 1,
          'employeeID': 1,
          'recipient': 1,
          'postDate': 1,
          'employeedata.employeeName': 1,
          'employeedata.department': 1,
          'employeedata.photo': 1,
        },
      },
    ];


    const complaints = await Complaints.aggregate(complaintsPipeline);

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
  EditComplaint,
  getMyComplaints,
};
