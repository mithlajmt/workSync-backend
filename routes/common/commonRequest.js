const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const {checkToken}=require('./../../utilities/jwtUtilis');
const {userData}= require('./../../controllers/commonController/commonControl');

router.get('/userData', [
  checkToken,
  userData,
]);

module.exports = router;
