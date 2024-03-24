const Notification = require('./../../models/notification');

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

    const {companyID} = req.user;
    console.log(req?.file?.location);
    const location = req?.file?.location;

    // const attachment = req.file.location;

    // Create a new instance of the Notification model
    const newNotification = new Notification({
      companyID,
      title,
      start,
      end,
      description,
      target,
      recipients,
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


module.exports = {
  addToCollection,
  getNotificationListCompany,

};
