// backend/app.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config(); // Invoke dotenv to load environment variables

const app = express(); // Create an instance of the Express application
const port = process.env.PORT || 3000; // Set the port for the server to listen

// Enable CORS (cross-origin resource sharing) for the application
app.use(cors());

// Connect to MongoDB using the provided URI
mongoose.connect(process.env.MONGODB_URI);
const db = mongoose.connection; // Get the MongoDB connection instance

// MongoDB connection event handlers
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
// Handle connection errors
db.once('open', () => {
  console.log('Connected to MongoDB');
  // Log a message once the connection is successfully established
});

const otpGenerate = require('./models/onetimepassword/phoneotp');

// Use middleware to parse JSON in the request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/register', otpGenerate);

// Start the server and listen for incoming requests
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
  // Log the server start message with the specified port
});
