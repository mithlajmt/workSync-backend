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
    console.log(req?.file?.location, 'll');
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

module.exports = {
  addToCollection,
};
