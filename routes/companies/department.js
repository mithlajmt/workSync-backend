const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const {
  validateToken,
  checkRole,
  checkExisting,
  storeDepartment,
}= require('../../controllers/organisationController/department');


router.post('/department',
    [
      validateToken,
      checkRole,
      checkExisting,
      storeDepartment,
    ],
);


module.exports = router;
