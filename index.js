

const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const threadRoutes = require('./routes/threads');
const commentRoutes = require('./routes/comments');
const adminRoutes = require('./routes/admin');
const { connectDB } = require('./config/db');


const app = express();
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/threads', threadRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/admin', adminRoutes);
// also expose without /api prefix
app.use('/auth', authRoutes);
app.use('/threads', threadRoutes);
app.use('/comments', commentRoutes);
app.use('/admin', adminRoutes);

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
