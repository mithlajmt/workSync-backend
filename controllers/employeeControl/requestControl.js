/* eslint-disable max-len */
/* eslint-disable valid-jsdoc */
// eslint-disable-next-line max-len
// Import the Complaint model and the utility function for checking required fields
const Complaint = require('./../../models/complaint');
const checkRequiredFields = require('./../../utilities/checkRequiredFeilds');

/**
 * Middleware to validate required fields in the request body.
 * Throws an error if any required field is missing.
 */
const validateFields = async (req, res, next) => {
  const required = ['title', 'description', 'attachment', 'recipient'];

  try {
    // Check for required fields using utility function
    checkRequiredFields(req, res, required);
    next(); // Continue to the next middleware if validation passes
  } catch (error) {
    // Handle validation error and send a detailed response
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      error: error.message,
    });
  }
};

/**
 * Controller to register a new complaint.
 * Saves the complaint to the database and responds with success or error messages.
 */
const registerComplaint = async (req, res) => {
  const { companyID, employeeID } = req.user;
  
  const { title, description, recipient } = req.body;
  const attachment = req.file;

  try {
    // Create a new Complaint instance
    const newComplaint = new Complaint({
      title,
      description,
      recipient,
      companyID,
      employeeID,
      attachment,
    });

    // Save the new complaint to the database
    await newComplaint.save();

    // Respond with a success message
    res.status(201).json({
      success: true,
      message: 'Complaint registered successfully',
    });
  } catch (error) {
    // Handle database or unexpected errors
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

// Export the middleware and controller for use in routes
module.exports = {
  validateFields,
  registerComplaint,
};
