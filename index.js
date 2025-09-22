

const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const threadRoutes = require('./routes/threads');
const { connectDB } = require('./config/db');


const app = express();
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/threads', threadRoutes);

const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    if (require.main === module) {
      app.listen(PORT, () => console.log('Server running on port', PORT));
    }
  })
  .catch(err => {
    console.error('DB connection error', err);
    process.exit(1);
  });

module.exports = app;
