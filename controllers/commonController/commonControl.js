const company = require('./../../models/company');
const employee = require('./../../models/employee');
// const complaint = require('./../../models/complaint');
const Todo = require('./../../models/todo');

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
      const {companyID} = req.user;
      const com = await company.findOne({companyID});

      if (!com) {
        return res.status(404).json({
          success: false,
          message: 'Company not found',
        });
      }

      const companyName = com.companyName;
      const employeeData = await employee.findOne({employeeID});

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
      const {companyID} = req.user;
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


const addTask = async (req, res) => {
  const {companyID, employeeID} = req.user;
  const {title, description} = req.body;

  let userID;

  // Determine the userID based on the user's type
  if (employeeID) {
    userID = employeeID;
  } else {
    userID = companyID;
  }

  try {
    // Find the user's todo list by userID
    const todoList = await Todo.findOne({userID});

    // If the user already has a todo list, add the new task to it
    if (todoList) {
      const newTask = {
        title,
        description,
      };
      todoList.tasks.push(newTask);
      await todoList.save();

      // Send success response with added task details
      res.status(201).json({
        success: true,
        message: 'Task added successfully',
        task: newTask});
    } else {
      // If the user does not have a todo list, create a new todo list
      const newTodo = new Todo({
        userID,
        companyID,
        tasks: [{
          title,
          description,
        }],
      });

      await newTodo.save();

      // Send success response with added task details
      res.status(201).json({
        success: true,
        message: 'Task added successfully',
        task: newTodo.tasks[0]});
    }
  } catch (error) {
    console.error('Error adding task:', error);

    // Send error response
    res.status(500).json({success: false, error: 'Internal Server Error'});
  }
};


const getTask = async (req, res, next) => {
  const {companyID, employeeID} = req.user;

  try {
    let userID;

    if (employeeID) {
      userID = employeeID;
      // If the user is an employee, find their todo list using employeeID
    } else {
      userID = companyID;
      // If the user is a company, find all todo lists associated
    }

    const tasks = await Todo.aggregate([
      {
        $match: {userID},
      },
      {
        $project: {
          _id: 0, // Exclude the _id field
          __v: 0, // Exclude the __v field
          companyID: 0, // Exclude the companyID field
          userID: 0, // Exclude the userID field
        },
      },
    ]);

    // Send success response with the found tasks
    res.status(200).json({success: true, data: tasks});
  } catch (error) {
    // If an error occurs, log the error and send a 500 response
    console.error('Error fetching tasks:', error);
    res.status(500).json({success: false, error: 'Internal Server Error'});
  }
};
module.exports = {
  userData,
  addTask,
  getTask,
};
