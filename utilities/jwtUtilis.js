
const jwt = require('jsonwebtoken');


const checkToken = async function(req, res, next) {
  // eslint-disable-next-line max-len
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  const secretKey = process.env.JWT_SECRET;

  if (!token) {
    console.log('notoken');
    return res.status(401).json({
      success: false,
      message: 'Authorization header missing, unauthorized access',
    });
  }

  try {
    const decodedToken = jwt.verify(token, secretKey);
    req.user = decodedToken;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired. Please re-authenticate.',
      });
    } else {
      console.error(error);
      return res.status(401).json({
        success: false,
        message: 'Invalid token.',
      });
    }
  }
};


const isCompanyAdmin = async (req, res, next) => {
  const {role} = req.user;

  if (role === 'companyAdmin') {
    next();
  } else {
    console.log('no-admin');
    res.status(403).json({
      success: false,
      message: 'Authorization denied. Insufficient role privileges',
    });
  }
};

const isAnEmployee = async (req, res, next) => {
  const {role} = req.user;

  if (role === 'employee' || role ==='departmentHead') {
    next();
  } else {
    console.log('not an employee');
    res.status(403).json({
      success: false,
      // eslint-disable-next-line max-len
      message: 'Authorization denied. it seems you are not an employee of any firm contact your admin',
    });
  }
};

const isCompanyAdminOrDepartmentHead= async (req, res, next)=>{
  const {role} = req.user;
  if (role === 'companyAdmin' || role ==='departmentHead') {
    next();
  } else {
    console.log('didnt have the authority');
    res.status(403).json({
      success: false,
      // eslint-disable-next-line max-len
      message: 'Authorization denied. it seems you are dont has the authority for the requested data.',
    });
  }
};


module.exports = {
  checkToken,
  isCompanyAdmin,
  isAnEmployee,
  isCompanyAdminOrDepartmentHead,
};


