const mongoose = require('mongoose');

const contact = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  message: String,
  subject: String,
});

module.exports = mongoose.model('contact', contact);
