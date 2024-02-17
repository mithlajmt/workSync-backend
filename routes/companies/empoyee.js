// Require necessary modules
const express = require('express');
const bodyParser = require('body-parser');

const {validateToken,
    checkRole,
    validateEmployeeFields,
    checkExisting,
    generateEmployeeID,
    addEmployeeToDatabase,} = require('../../controllers/employeeControl/addingControl');


// Create an Express router
// eslint-disable-next-line new-cap
const router = express.Router();

// Apply body-parser middleware for parsing incoming request bodies
router.use(bodyParser.json());

router.post('/employee',[
    validateToken,
    checkRole,
    validateEmployeeFields,
    checkExisting,
    generateEmployeeID,
    addEmployeeToDatabase,
])
module.exports=router;
