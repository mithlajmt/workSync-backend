const Company = require('../../models/company');
const jwt = require('jsonwebtoken');

const checkData = async (req, res) => {
  const {userID} = req.body;
  const userType = userID.substring(0, 3);
  // const [first,second,third] = userID  //es6 destructing just for knowledge

  if (userType == 'COM') {
    try {
      const user = await Company.findOne({companyID: userID});

      if (user) {
        const {companyID, contactEmail, role, _id} = user;
        console.log(user);
        console.log(_id);
        const secretKey = process.env.JWT_SECRET;
        const payload = {
          companyID,
          contactEmail,
          _id,
          role,
        };
        const expirationTIme = parseInt(process.env.JWT_EXPIRE, 10);

        const token = jwt.sign(payload, secretKey, {
          expiresIn: expirationTIme,
        });
        // eslint-disable-next-line max-len
        res.status(200)
            .json({
              success: true,
              message: 'Login data received successfully',
              token,
            });
      } else {
        res.status(200).json({message: 'Login monu received successfully'});
      }
    } catch (error) {
      console.error('Error finding user:', error);
      res.status(500).json({message: 'Internal Server Error'});
    }
  } else if (userType == 'EMP') {
    try {
      const user = await Company.findOne({companyID: userID});

      if (user) {
        console.log(user);
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
