const express = require('express');
const router = express.Router();
const {checkToken, isAnEmployee}=require('./../../utilities/jwtUtilis');
// eslint-disable-next-line max-len
const {validateFields,registerComplaint}=require('../../controllers/employeeControl/requestControl');
const upload = require('./../../utilities/multer');


router.post('/complaints', [
  checkToken,
  isAnEmployee,
  upload.single('identityProof'),
  validateFields,
  registerComplaint,
]);

module.exports = router;
