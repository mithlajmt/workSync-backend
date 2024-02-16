/* eslint-disable require-jsdoc */
function validateEmployeeFields(req) {
  const requiredFields = [
    'firstName',
    'lastName',
    'dateOfBirth',
    'gender',
    'CompanyID',
    'employeeID',
    'email',
    'phoneNumber',
    'hireDate',
    'department',
    'position',
    'role',
  ];
  for (const field of requiredFields) {
    if (!req.body[field]) {
      // If any required field is missing, return false
      return false;
    }
  }
  // All required fields are present
  return true;
}
