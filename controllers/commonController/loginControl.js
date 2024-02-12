const Company = require('../../models/company');

const checkData = async (req, res) => {
  const {userID, password, rememberMe} = req.body;

  console.log('Received data:', userID, password, rememberMe);
  const userType = userID.substring(0, 3);
  // const [first,second,third] = userID  //es6 destructing just for knowledge

  if (userType=='COM') {
    try {
      const user = await Company.findOne({companyID: userID});

      if (user) {
        console.log(user);
        res.status(200).json({message: 'Login data received successfully'});
      } else {
        res.status(200).json({message: 'Login monu received successfully'});
      }
    } catch (error) {
      console.error('Error finding user:', error);
      res.status(500).json({message: 'Internal Server Error'});
    }
  } else if (userType=='EMP') {
    try {
      const user = await Company.findOne({companyID: userID});

      if (user) {
        console.log(user);
        res.status(200).json({message: 'uccessfully'});
      } else {
        res.status(200).json({message: 'received successfully'});
      }
    } catch (error) {
      console.error('Error finding user:', error);
      res.status(500).json({message: 'Internal Server Error'});
    }
  }
};

module.exports = checkData;
