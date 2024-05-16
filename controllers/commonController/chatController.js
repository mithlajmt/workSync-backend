const Employees = require('./../../models/employee');
const Company = require('./../../models/company');
const Messages = require('../../models/messages');


// Register the schema as the "messages" model


const getChatlist = async (req, res, next) => {
  console.log(req.user);
  const {companyID, employeeID, role} = req.user;

  try {
    if (role === 'companyAdmin') {
      const employees = await Employees.aggregate([
        {
          $match: {companyID, role: 'departmentHead', isActive: true},
        },
        {
          $project: {
            _id: 1,
            userName: '$employeeName',
            department: 1,
            photo: 1,
            userID: '$employeeID',
          },
        },
      ]);

      res.status(200).json({success: true, data: employees});
    } else if (role === 'departmentHead') {
      const employee = await Employees.find({employeeID});
      depname = employee[0].department;

      const companyAdmin = await Company.aggregate([
        {
          $match: {companyID},
        },
        {
          $project: {
            _id: 1,
            userName: '$companyName',
            photo: 1,
            userID: '$companyID',
          },
        },
      ]);

      const recipients = await Employees.aggregate([
        {
          $match: {companyID, department: depname, isActive: true},
        },
        {
          $project: {
            _id: 1,
            userName: '$employeeName',
            department: 1,
            photo: 1,
            userID: '$employeeID',
          },
        },
      ]);

      const combinedData = [...companyAdmin, ...recipients];

      res.status(200).json({success: true, data: combinedData});
    } else if (role === 'employee') {
      const departmentHead = await Employees.aggregate([
        {
          $match: {
            employeeID, // Match the user by their employeeID
          },
        },
        {
          $lookup: {
            from: 'employees',
            localField: 'department',
            foreignField: 'department',
            as: 'departmentData',
          },
        },
        {
          $unwind: '$departmentData',
        },
        {
          $match: {
            'departmentData.role': 'departmentHead',
            'departmentData.isActive': true,
          },
        },
        {
          $project: {
            _id: 1,
            userName: '$departmentData.employeeName',
            role: '$departmentData.role',
            photo: '$departmentData.photo',
            userID: '$departmentData.employeeID',
          },
        },
      ]);

      res.status(200).json({success: true, data: departmentHead});
    } else {
      res.status(403).json({success: false, message: 'Access forbidden'});
    }
  } catch (error) {
    console.error('Error fetching chat list:', error);
    res.status(500).json({success: false, error: 'Internal Server Error'});
  }
};


const recieverProfile = async (req, res, next) => {
  const userID = req.params.id;

  try {
    let userPro;

    const userId = userID.split('-');
    if (userId[0] === 'COM') {
      userPro = await Company.aggregate([
        {
          $match: {companyID: userID},
        },
        {
          $project: {
            _id: 1,
            name: '$companyName',
            photo: '$photo',
          },
        },
      ]);

      res.status(200).json({
        success: true,
        data: userPro});
    } else if (userId[0] === 'EMP') {
      userPro = await Employees.aggregate([
        {
          $match: {employeeID: userID},
        },
        {
          $project: {
            _id: 1,
            name: '$employeeName',
            photo: '$photo',
            department: 1,
          },
        },
      ]);

      res.status(200).json({
        success: true,
        data: userPro});
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format'});
    }

    if (userPro.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found'});
    }
  } catch (error) {
    console.error(
        'Error fetching user profile:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error'});
  }
};

const getMessages = async (req, res) => {
  try {
    const recieverID = req.params.id;
    const senderID = req.user._id;

    console.log('Receiver ID:', recieverID);
    console.log('Sender ID:', senderID);

    const messages = await Messages.aggregate([
      {
        $match: {
          $or: [
            {sender: senderID, reciever: recieverID},
            {sender: recieverID, reciever: senderID},
          ],
        },
      },
    ]);


    // Send success response with data
    res.status(200).json({
      success: true,
      message: 'Messages retrieved successfully',
      data: messages,
    });
  } catch (error) {
    // Handle errors
    console.error('Error retrieving messages:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving messages',
      error: error.message,
    });
  }
};


module.exports = {
  getChatlist,
  recieverProfile,
  getMessages,
};
