/* eslint-disable max-len */
const Notification = require('./../../models/notification');
const Employees = require('./../../models/employee');

const addToCollection = async (req, res) => {
  try {
    const {
      title,
      start,
      end,
      description,
      target,
      recipients,
      eventType,
    } = req.body;

    const recieps = recipients.split(',').map((recipient) => recipient.trim());
    const {companyID} = req.user;
    console.log(req?.file?.location);
    const location = req?.file?.location;


    const newNotification = new Notification({
      companyID,
      title,
      start,
      end,
      description,
      target,
      recipients: recieps,
      eventType,
      attachment: location,
      isValid: true,
    });
    // console.log(newNotification);

    // Save the newNotification to the database
    await newNotification.save();

    // Respond with a success message
    res.status(201).json({
      success: true,
      message: 'Notification created successfully.',
    });
  } catch (error) {
    // Handle unexpected errors
    console.error('Error in addToCollection:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.',
    });
  }
};


const getNotificationListCompany = async (req, res) => {
  try {
    const {companyID} = req.user;

    // Get current date
    const currentDate = new Date();

    // Fetch upcoming notifications
    const upcomingNotifications = await Notification.aggregate([
      {
        $match: {
          companyID: companyID,
          start: {$gte: currentDate},
        },
      },
    ]);

    // Fetch previous or all notifications
    const previousOrAllNotifications = await Notification.aggregate([
      {
        $match: {
          companyID: companyID,
          start: {$lt: currentDate},
        },
      },
    ]);

    // Send response with both types of notifications
    res.status(200).json({
      upcomingNotifications: upcomingNotifications,
      previousOrAllNotifications: previousOrAllNotifications,
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({error: 'Internal server error'});
  }
};
const getNotificationList = async (req, res) => {
  console.log('ji');
  try {
    const {companyID, employeeID, role} = req.user;
    const employee = await Employees.findOne({employeeID, isActive: true});

    if (!employee) {
      return res.status(404).json({error: 'Employee not found'});
    }

    const department = employee.department;
    const currentDate = new Date();

    // Aggregation pipeline for upcoming notifications
    const upcomingpipeLine = [
      {
        $match: {
          companyID: companyID,
          start: {$gte: currentDate},
          recipients: {$in: [department]},
        },
      },
    ];

    // Aggregation pipeline for previous or all notifications
    const previouspipeline = [
      {
        $match: {
          companyID: companyID,
          start: {$lt: currentDate},
          recipients: {$in: [department]},
        },
      },
    ];

    // Adjust the pipelines for employee role
    if (role === 'employee') {
      upcomingpipeLine.push({$match: {target: 'ALL'}});
      previouspipeline.push({$match: {target: 'ALL'}});
    }

    // Log the aggregation pipelines for debugging
    console.log('Upcoming Pipeline:', JSON.stringify(upcomingpipeLine, null, 2));
    console.log('Previous Pipeline:', JSON.stringify(previouspipeline, null, 2));

    // Execute the aggregation pipelines
    const upcomingNotifications = await Notification.aggregate(upcomingpipeLine);
    const previousOrAllNotifications = await Notification.aggregate(previouspipeline);

    // Log the results for debugging
    console.log('Upcoming Notifications:', upcomingNotifications);
    console.log('Previous or All Notifications:', previousOrAllNotifications);

    // Send the response
    res.status(200).json({
      upcomingNotifications: upcomingNotifications,
      previousOrAllNotifications: previousOrAllNotifications,
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({error: 'Internal server error'});
  }
};

const getDatesBetween = (startDate, endDate) => {
  console.log(startDate);
  const dates = [];
  const currentDate = new Date(startDate);
  const lastDate = new Date(endDate);

  while (currentDate <= lastDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};


const calendarData = async (req, res) => {
  try {
    const {companyID, employeeID, role} = req.user;

    //
    // Fetch the employee record
    const employee = await Employees.findOne({employeeID, isActive: true});
    if (!employee) {
      return res.status(404).json({error: 'Employee not found'});
    }


    const department = employee.department;

    const aggregationPipe = [
      {
        $match: {
          companyID,
          recipients: {$in: [department]},
        },
      },
    ];

    // Adjust pipeline for employee role
    if (role === 'employee') {
      aggregationPipe.push({$match: {target: 'ALL'}});
    }


    const notifications = await Notification.aggregate(aggregationPipe);

    const dataForCalendar = [];
    notifications.forEach((notification) => {
      const startDate = new Date(notification.start);
      const endDate = new Date(notification.end);

      const datesBetween = getDatesBetween(startDate, endDate);

      datesBetween.forEach((date) => {
        let color;
        switch (notification.priority) {
          case 'HIGH':
            color = 'red';
            break;
          case 'MEDIUM':
            color = 'green';
            break;
          case 'LOW':
            color = 'yellow';
            break;
          default:
            color = 'black';
        }

        dataForCalendar.push({
          date: date.toISOString().split('T')[0],
          title: notification.title,
          color: color,
        });
      });
    });


    res.status(200).json({
      data: dataForCalendar,
    });
  } catch (err) {
    console.error('Error fetching calendar data:', err);
    res.status(500).json({error: 'Internal server error'});
  }
};


module.exports = {
  addToCollection,
  getNotificationListCompany,
  getNotificationList,
  calendarData,
};
