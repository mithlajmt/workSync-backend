// backend/app.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors()); // Enable CORS

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/worksync');
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.get('/', (req, res) => {
  res.send('Hello WorkSync!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
