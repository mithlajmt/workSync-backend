const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  employeeID: {
    type: String,
    required: true,
  },
  companyID: {
    required: true,
    type: String,
  },
  name: {
    required: true,
    type: String,
  },
  image: {
    type: String,
    default: 'https://i.pinimg.com/originals/6e/4c/9d/6e4c9d2edd4e96ebf5aa313f15827b15.jpg',
  },
  address: {
    type: String,
    required: true,
  },
  secondPhoneNumber: {
    type: String,
    default: '',
  },

  bio: {
    type: String,
    default: '',
  },
  skills: {
    type: [String], // Indicates an array of strings
  },
});

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;
