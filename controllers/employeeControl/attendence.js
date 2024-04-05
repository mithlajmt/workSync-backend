/* eslint-disable max-len */
const Attendance = require('../../models/attendence');
const Employees = require('../../models/employee');
const Company = require('./../../models/company');
const {DateTime} = require('luxon');
const {getDatesBetween}=require('./../../utilities/dateUtility');
const LeaveRequest = require('./../../models/leaveRequest');

// Middleware to check if it's a working day (not Sunday)
const checkWorkingDay = async (req, res, next) => {
  // Check the day of the week
  const today = new Date().getDay();
  if (today === 0) {
    // If it's Sunday, prevent attendance marking
    res.status(400).json({
      message: 'Attendance cannot be marked today; it\'s Sunday. Enjoy your holiday.',
    });
  } else {
    // Continue to the next middleware if it's a working day
    next();
  }
};

// Middleware to validate employee check-in based on working hours
const validateCheckIn = async (req, res, next) => {
  // Time zone options for formatting IST time
  const IST_OPTIONS = {
    timeZone: 'Asia/Kolkata',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  };

  try {
    // Extract company ID from the request user objecty
    const {companyID} = req.user;

    // Find the company with the provided ID
    const company = await Company.findOne({companyID});

    if (company) {
      // Extract start and end time strings from company working hours
      const startTimeArray = company.workingHours.startTime.split(':');
      const endTimeArray = company.workingHours.endTime.split(':');

      // Create Date objects for start and end times using today's date
      const today = new Date();
      const bufferTime = 60 * 60 * 1000; // One hour in milliseconds

      // Adjust starting time to allow check-ins one hour early
      const startingTime = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
          startTimeArray[0],
          startTimeArray[1],
      );

      // Create ending time object
      const endingTime = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
          endTimeArray[0],
          endTimeArray[1],
      );

      // Get current time in milliseconds (replace with appropriate logic)
      const currentTime = new Date().getTime();

      // Log formatted start, end, and current times (optional)
      console.log('Starting Time:', startingTime.toLocaleString('en-IN'));
      console.log('Ending Time:', endingTime.toLocaleString('en-IN'));
      console.log('Current Time:', new Date(currentTime).toLocaleString('en-IN', IST_OPTIONS));

      // Check if current time is within allowed work timeframe (including buffer)
      if (currentTime >= startingTime.getTime() - bufferTime && currentTime <= endingTime.getTime()) {
        console.log('Employee can check in.'); // Allow check-in
        next();
      } else {
        console.log('Employee cannot check in.'); // Disallow check-in
        res.status(403).json({
          success: false,
          message: 'Employee cannot check in at the moment.',
          reason: 'Outside working hours or too early.',
        });
      }
    } else {
      console.log('Company not found.');
      res.status(404).json({success: false, message: 'Company not found.', reason: 'Invalid company ID.'});
    }
  } catch (err) {
    console.log(err); // Log any errors
    res.status(500).json({success: false, message: 'Internal Server Error', reason: 'Something went wrong on the server.'});
  }
};

// Middleware to check if the user has already checked in on the current day
const checkStatus = async (req, res, next) => {
  try {
    // Extract employee ID and current date
    const {employeeID} = req.user;
    const currentDate = DateTime.now().toFormat('yyyy/MM/dd');
    console.log(currentDate);

    // Find attendance record for the current user and date
    const user = await Attendance.findOne({employeeID, date: currentDate});
    // console.log(currentDate, employeeID);
    // console.log(user);

    if (user) {
      // If user has already checked in, prevent duplicate check-ins
      const checkIn = user.checkIn;
      res.status(400).json({
        success: false,
        message: `User has already checked in today at ${checkIn}. Please check out and try again tomorrow.`,
      });
    } else {
      // Continue to the next middleware if user hasn't checked in yet
      next();
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Unexpected error. User status check failed. Please try again later.',
    });
  }
};

// Controller to submit employee attendance
const submitAttendance = async (req, res) => {
  try {
    // Extract user details and current date/time
    const {role, companyID, employeeID} = req.user;
    const today = new Date();
    const formattedTime = today.toLocaleTimeString();
    const company = await Company.findOne({companyID});
    const Employee = await Employees.findOne({companyID, employeeID});
    const currentDate = DateTime.now().toFormat('yyyy/MM/dd');
    const department = Employee.department;
    if (company) {
      // Extract company working hours and start time
      const startTime = company.workingHours.startTime;
      const parsedStartTime = new Date().setHours(
          parseInt(startTime.split(':')[0]), // Extract hours
          parseInt(startTime.split(':')[1]), // Extract minutes
          0, // Set seconds and milliseconds to 0 for accurate comparison
      );

      // Calculate time difference in minutes from start time
      const timeDifference = Math.floor((today - parsedStartTime) / (1000 * 60));

      // Determine if the user is late
      const isLate = timeDifference > 10;

      // Determine attendance status based on presence or lateness
      let status;
      if (isLate) {
        status = 'late';
      } else {
        status = 'present';
      }

      // Create Attendance record
      const attendance = new Attendance({
        companyID,
        employeeID,
        checkIn: formattedTime,
        date: currentDate, // cgnged
        role,
        isLate,
        status,
        department,
      });

      // Save the attendance record
      await attendance.save();

      // Respond with success message
      res.status(200).json({
        success: true,
        message: 'Attendance submitted successfully.',
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({success: false, message: 'Internal Server Error'});
  }
};

// Middleware to check if the user has already checked in on the current day
const checkInExists = async (req, res, next) => {
  const {employeeID} = req.user;
  const currentDate = DateTime.now().toFormat('yyyy/MM/dd');
  console.log(currentDate);

  const log = await Attendance.findOne({employeeID, date: currentDate});
  if (!log) {
    res.status(400).json({
      success: false,
      message: 'User hasn\'t checked in today! Check in first and retry.',
    });
  } else {
    next();
  }
};

// Middleware to register employee check-out
const registerCheckOut = async (req, res, next) => {
  try {
    // Extract employee ID and current date
    const {employeeID} = req.user;
    const currentDate = DateTime.now().toFormat('yyyy/MM/dd');
    const checkOut = new Date().toLocaleTimeString();

    // Define MongoDB query, update, and options for check-out
    const query = {employeeID, date: currentDate};
    const update = {$set: {checkOut: checkOut}};
    const options = {new: true};

    // Find and update the attendance record
    const attendance = await Attendance.findOneAndUpdate(query, update, options);
    console.log(attendance);

    // Respond with success message
    if (!attendance) {
      res.status(404).json({success: false, message: 'Check-in record not found'});
    } else {
      res.json({success: true, message: 'Check-out successful'});
    }
  } catch (err) {
    console.error('Error during check-out:', err);
    res.status(500).json({success: false, message: 'Internal Server Error'});
  }
};

// Controller to get attendance status of the day
const getAttendanceStatus = async (req, res) => {
  const {employeeID} = req.user;
  const currentDate = DateTime.now().toFormat('yyyy/MM/dd');

  try {
    // Find attendance record for the current user and date
    const status = await Attendance.findOne({employeeID, date: currentDate});

    if (status) {
      // Respond with checked-in or checked-out status
      if (status.checkOut) {
        res.status(200).json({
          success: true,
          checkedIn: false,
          message: 'Employee has already checked out.',
        });
      } else {
        res.status(200).json({
          success: true,
          checkedIn: true,
          message: 'Employee has checked in.',
        });
      }
    } else {
      // No attendance record found for the current date
      res.status(200).json({
        success: true,
        checkedIn: false,
        message: 'No attendance record found for the current date.',
      });
    }
  } catch (err) {
    // Internal server error
    res.status(500).json({
      success: false,
      message: 'Internal server error or something seems off.',
    });
  }
};

// Controller to get attendance type details for a user
const attendanceType = async (req, res) => {
  const {employeeID} = req.user;
  try {
    // Aggregate query to get attendance details
    const details = await Attendance.aggregate([
      {
        $match: {
          employeeID: employeeID,
        },
      },
      {
        $project: {
          _id: 0,
          title: '',
          date: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$date',
              timezone: 'Asia/Kolkata',
            },
          },
          color: {
            $switch: {
              branches: [
                {case: {$eq: ['$status', 'leave']}, then: 'red'},
                {case: {$eq: ['$status', 'present']}, then: 'green'},
                {case: {$eq: ['$status', 'late']}, then: 'yellow'},
              ],
              default: 'black',
            },
          },
        },
      },
    ]);
    // Respond with the attendance details
    res.status(200).json({
      success: true,
      data: details,
    });
  } catch (err) {
    console.error(err);
    // Internal server error
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
    });
  }
};

// Middleware to validate leave days
const validateLeaveDays = async (req, res, next) => {
  try {
    const {start, end} = req.body;
    const startd = new Date(start);
    const endt = new Date(end);

    if (startd <= endt) {
      // If start date is less than or equal to end date, proceed to the next middleware or route handler
      next();
    } else {
      // If start is not less than or equal to end, send a bad request response
      res.status(400).json({
        success: false,
        error: 'Start date must be less than or equal to end date',
      });
    }
  } catch (error) {
    // Handle unexpected errors
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
    });
  }
};

// Route handler to register a leave request
const registerLeaveRequest = async (req, res) => {
  try {
    // Extract necessary information from the request
    const {employeeID,companyID} = req.user;
    const {title, description, start, end} = req.body;
    const attachment = req.file?.location;

    // Assuming getDatesBetween is a function that returns an array of dates
    const requestedDates = getDatesBetween(start, end);

    // Check if the requestedDates array is empty
    if (requestedDates.length < 1) {
      return res.status(400).json({
        success: false,
        error: 'No valid dates found for the leave request. Please check your date range.',
      });
    }

    // Continue with the rest of your logic if there are requestedDates
    // ...


    // Create a new LeaveRequest document
    const newLeaveRequest = new LeaveRequest({
      title,
      description,
      attachment,
      date: new Date(), // Current date
      requestedDates,
      employeeID,
      companyID,
    });

    // Save the newLeaveRequest document to the database
    await newLeaveRequest.save();

    // Respond with a success message and the created leave request data
    res.status(201).json({
      success: true,
      data: '',
      message: 'Your leave request has been successfully submitted for review.',
    });
  } catch (error) {
    // Handle unexpected errors
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
    });
  }
};


// Export the controllers and middlewares
module.exports = {
  submitAttendance,
  validateCheckIn,
  checkWorkingDay,
  checkStatus,
  getAttendanceStatus,
  checkInExists,
  registerCheckOut,
  attendanceType,
  validateLeaveDays,
  registerLeaveRequest,
};
