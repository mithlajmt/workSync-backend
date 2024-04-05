const Leaves = require('../../models/leaveRequest');
const mongoose = require('mongoose');

const getLeaveRequest = async (req, res) => {
  try {
    const {companyID, role, employeeID} = req.user;
    const matchQuery = {companyID, reviewStatus: 'pending'};
    console.log(role);

    // If the user is not a CompanyAdmin, filter by employeeID
    if (role !== 'companyAdmin') {
      matchQuery.employeeID = employeeID;
    }

    const leaveRequests = await Leaves.aggregate([
      {
        $match: matchQuery,
      },
      {
        $lookup: {
          from: 'employees',
          localField: 'employeeID',
          foreignField: 'employeeID',
          as: 'employeeData',
        },
      },
      {
        $project: {
          'employeeID': 1,
          'title': 1,
          'description': 1,
          'reviewStatus': 1,
          'requestedDates': 1,
          'attachment': 1,
          'userName': '$employeeData.employeeName',
          'photo': '$employeeData.photo',
        },
      },
      {
        $project: {
          employeeID: 1,
          title: 1,
          requestedDates: 1,
          description: 1,
          reviewStatus: 1,
          attachment: 1,
          userName: {$arrayElemAt: ['$userName', 0]},
          photo: {$arrayElemAt: ['$photo', 0]},
        },
      },
    ]);

    if (leaveRequests.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No pending leave requests found.',
      });
    }

    console.log(leaveRequests, 'lololo');
    return res.status(200).json({
      success: true,
      data: leaveRequests,
      message: 'Pending leave requests retrieved successfully.',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
};


const upDateLeaveRequest = async (req, res) => {
  try {
    const id = req.params.id;
    const mID = new mongoose.Types.ObjectId(id); // Convert id to ObjectId
    const {status} = req.body;

    // eslint-disable-next-line max-len
    const updatedLeave = await Leaves.findByIdAndUpdate(mID, {reviewStatus: status}, {new: true});

    if (!updatedLeave) {
      return res.status(404).json({
        message: 'Leave request not found'});
    }

    res.status(200).json({
      success: true,
      message: 'Leave request updated successfully',
      updatedLeave});
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'});
  }
};

module.exports = {
  getLeaveRequest,
  upDateLeaveRequest,
};
