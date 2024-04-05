/* eslint-disable new-cap */
const express = require('express');
const router = express.Router();

const {checkToken, isCompanyAdmin}=require('../../utilities/jwtUtilis');
// eslint-disable-next-line max-len
const {getLeaveRequest, upDateLeaveRequest} = require('./../../controllers/organisationController/leaveRequest');

router.get('/leaveRequests', [
  checkToken,
  isCompanyAdmin,
  getLeaveRequest,
]);

router.patch('/leaveRequests/:id', [
  checkToken,
  isCompanyAdmin,
  upDateLeaveRequest,
]);

module.exports = router;
