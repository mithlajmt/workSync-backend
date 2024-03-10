const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const {
  validateToken,
  checkRole,
  checkExisting,
  storeDepartment,
  getDepartmentsNames,
}= require('../../controllers/organisationController/department');


router.post('/department',
    [
      validateToken,
      checkRole,
      checkExisting,
      storeDepartment,
    ],
);

router.get('/departmentNames',
    [
      validateToken,
      checkRole,
      getDepartmentsNames,
    ],
);


module.exports = router;
