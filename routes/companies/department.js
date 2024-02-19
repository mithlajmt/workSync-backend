const express = require('express');
const router = express.Router();
const {
    validateToken,
    checkRole,
    checkExisting,
    storeDepartment,
}= require('../../controllers/organisationController/department')


router.post('/department', validateToken, checkRole, checkExisting, storeDepartment);


module.exports = router;