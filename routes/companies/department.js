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
  getDepEmployees,
}= require('../../controllers/organisationController/department');

const {isCompanyAdminOrDepartmentHead} =require('./../../utilities/jwtUtilis');


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

router.get('/departments',
    [
      validateToken,
      checkRole,
      getDepartments,

    ],
);

router.get('/department/:ID',
    [
      validateToken,
      isCompanyAdminOrDepartmentHead,
      getDepEmployees,
    ],
);


module.exports = router;
