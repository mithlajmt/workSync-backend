// backend/app.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const register = require('./routes/companies/register');
const employee = require('./routes/companies/empoyee');
const department = require('./routes/companies/department');
const attendance = require('./routes/employees/attendence');
const requests = require('./routes/employees/request');
const commonReq = require('./routes/common/commonRequest');
const notifications = require('./routes/companies/notification');
const compCommon = require('./routes/companies/common');
// const departmentHead = require('./routes/departmentHead/commonRequests');
const depHead = require('./routes/departmentHead/commonRequests');
const emp = require('./routes/employees/request');
// eslint-disable-next-line no-unused-vars
const cron = require('./utilities/autoCheckOut-nodechron');


dotenv.config(); // Invoke dotenv to load environment variables for test

const app = express(); // Create an instance of the Express application
const port = process.env.PORT || 3000; // Set the port for the server to listen

// Enable CORS (cross-origin resource sharing) for the application
app.use(cors());

// Connect to MongoDB using the provided URI
mongoose.connect(process.env.MONGODB_URI);
const db = mongoose.connection; // Get the MongoDB connection instance

// MongoDB connection event handlers
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
  // Log a message once the connection is successfully established
});

// Use middleware to parse JSON in the request body
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// app.use(cors({
//   origin: 'https://worksync.illuminatespark.com', // Replace with your frontend URL
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//   credentials: true, // Allow cookies to be sent
//   optionsSuccessStatus: 204,
// }));


app.use('/', register);
app.use('/attendance', attendance);
app.use('/employee', requests);
app.use('/', requests, commonReq, department);
app.use('/companyAdmin', employee, department, notifications, compCommon);
app.use('/departmentHead', depHead);


// Start the server and listen for incoming requests
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
  // Log the server start message with the specified port
});
