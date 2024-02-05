const otpGen = require('../../models/onetimepassword/phoneotp')

const getOtp = (req, res) => {
//   console.log(req.body);

  const {
    companyName,
    industry,
    contactEmail,
    contactNumber,
    password,
    confirmPassword,
    terms,
  } = req.body;

  const formattedContactNumber = String(contactNumber);
    console.log(formattedContactNumber, '===========================');


  otpGen.otpGenerate(formattedContactNumber) // Use otpGenerate from the imported object
      .then((result) => {
        // console.log(result + 'ashannaaaaaaaaaaaaaaaaaaaaaaaa');
      })
      .catch((err) => {
        // console.log(err.message);
      });
  res.json('radhamani appa');
};

module.exports = {
  getOtp,
};
