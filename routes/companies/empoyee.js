// Require necessary modules
const express = require('express');
const bodyParser = require('body-parser');

const {checkDuplicate} = require('../../controllers/employeeControl/addingControl');


// Create an Express router
// eslint-disable-next-line new-cap
const router = express.Router();

// Apply body-parser middleware for parsing incoming request bodies
router.use(bodyParser.json());

router.post('/employee',[
    checkDuplicate
])
module.exports=router;
