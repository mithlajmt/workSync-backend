/* eslint-disable max-len */
/**
 * Checks if the required fields are present in the request body.
 *
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {string[]} requiredFields - An array of field names that are required.
 * @return {boolean|Object} Returns `true` if all required fields are present,
 *                           otherwise sends a response with missing fields.
 *
 * @example
 * // Example usage in an Express route handler
 * const requiredFields = ['companyID', 'employeeID', 'title', 'description', 'recipient'];
 * router.post('/your-route', (req, res) => {
 *   // Check if all required fields are present
 *   if (checkRequiredFields(req, res, requiredFields)) {
 *     // Continue with your logic
 *     // ...
 *     res.status(200).json({ success: true, message: 'Fields present, continue with logic' });
 *   }
 * });
 */
function checkRequiredFields(req, res, requiredFields) {
  const missingFields = [];
  requiredFields.forEach((field) => {
    if (!(field in req.body)) {
      missingFields.push(field);
    }
  });

  // If any fields are missing, send a response with the missing fields
  if (missingFields.length > 0) {
    return res.status(400).json({
      success: false,
      message: `Missing required fields: ${missingFields.join(', ')}`,
    });
  }

  // If all required fields are present, continue with the next middleware or logic
  return true;
}

module.exports = checkRequiredFields;
