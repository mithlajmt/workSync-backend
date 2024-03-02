const employee = require('./../../models/employee');
const Attendance = require('../../models/attendence');
const Company = require('./../../models/company');
const { DateTime } = require('luxon');

// Middleware to check if it's a working day (not Sunday)
const checkWorkingDay = async (req, res, next) => {
  const today = new Date().getDay();
  if (today === 0) {
    // Sunday, cannot mark attendance
    res.status(400).json({
      message: 'Attendance cannot be marked today; it\'s Sunday. Enjoy your holiday.',
    });
  } else {
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
    // Extract company ID from the request user object
    const { companyID } = req.user;

    // Find the company with the provided ID
    const company = await Company.findOne({ companyID });

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
        startTimeArray[1]
      );

      // Create ending time object
      const endingTime = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        endTimeArray[0],
        endTimeArray[1]
      );

      // Get current time in milliseconds (replace with appropriate logic)
      const currentTime = new Date().getTime(); // Replace with logic to get the current time in milliseconds

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
      res.status(404).json({ success: false, message: 'Company not found.', reason: 'Invalid company ID.' });
    }
  } catch (err) {
    console.log(err); // Log any errors
    res.status(500).json({ success: false, message: 'Internal Server Error', reason: 'Something went wrong on the server.' });
  }
};

// Middleware to check if the user has already checked in on the current day
const checkStatus = async (req, res, next) => {
  try {
    const { companyID, employeeID } = req.user;
    const currentDate = DateTime.now().toFormat('dd/MM/yyyy');
    const user = await Attendance.findOne({ employeeID, date: currentDate });

    if (user) {
      const checkIn = await user.checkIn;

      res.status(400).json({
        success: false,
        message: `User has already checked in today at ${checkIn}. Please check out and try again tomorrow.`,
      });
    } else {
      next();
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Unexpected error. User status check failed. Please try again later.",
    });
  }
};

// Controller to submit employee attendance
const submitAttendance = async (req, res) => {
  try {
    const { department, role, companyID, employeeID } = req.user;
    const Image = req.file.location;
    const today = new Date();
    const formattedTime = today.toLocaleTimeString();
    const company = await Company.findOne({ companyID });
    const formattedDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    if (company) {
      const startTime = company.workingHours.startTime;
      const parsedStartTime = new Date().setHours(
        parseInt(startTime.split(':')[0]), // Extract hours
        parseInt(startTime.split(':')[1]), // Extract minutes
        0 // Set seconds and milliseconds to 0 for accurate comparison
      );

      const now = DateTime.now();
      const formattedDate = now.toFormat('dd/MM/yyyy');
      console.log(formattedDate);
      const timeDifference = Math.floor((today - parsedStartTime) / (1000 * 60)); // Convert milliseconds to minutes
      console.log(timeDifference);

      const isLate = timeDifference > 10;

      const attendance = new Attendance({
        companyID,
        employeeID,
        Image,
        checkIn: formattedTime,
        date: formattedDate,
        role,
        isLate,
      });

      await attendance.save();
      res.status(200).json({
        message: 'Attendance submitted successfully.',
      });
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  submitAttendance,
  validateCheckIn,
  checkWorkingDay,
  checkStatus,
};