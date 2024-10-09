const express = require('express');
const session = require('express-session');
const path = require('path');
const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/auth');
require('dotenv').config();

const app = express();

// Set up templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files (CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Session middleware for user login
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}));

// Parse incoming request bodies
app.use(express.urlencoded({ extended: true }));

// Use routes
app.use('/', indexRoutes);
app.use('/auth', authRoutes);

// Server start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
