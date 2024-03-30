const mongoose = require('mongoose');


// Define the schema for the "messages" model
const messageSchema = new mongoose.Schema({
  // Define the schema fields here
  // For example:
  sender: {type: String, required: true},
  receiver: {type: String},
  content: {type: String, required: true},
  timestamp: {type: Date, default: Date.now},
});


const Message = mongoose.model('Message', messageSchema);


module.exports = Message;
