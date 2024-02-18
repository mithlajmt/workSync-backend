const bcrypt = require('bcrypt');

const hashPassword = async (password) => {
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  };

  const generatePassword = function (name, email) {
    const lastThreeLetters = name.slice(-3).toLowerCase();
    const firstTwoLetters = email.slice(0, 2).toLowerCase();
    const randomString = Math.random().toString(36).substring(2, 4);
  
    return `${lastThreeLetters}${firstTwoLetters}${randomString}`;
  };
  

  module.exports={
    hashPassword,
    generatePassword
  }