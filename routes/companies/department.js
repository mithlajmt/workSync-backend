const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const {
  validateToken,
  checkRole,
  checkExisting,
  storeDepartment,
  getDepartmentsNames,
  getDepartments,
  generateDepartmentID,
}= require('../../controllers/organisationController/department');


router.post('/department',
    [
      validateToken,
      checkRole,
      checkExisting,
      generateDepartmentID,
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

router.get('/department',
    [
      validateToken,
      checkRole,
      getDepartments,

    ],
);


module.exports = router;
