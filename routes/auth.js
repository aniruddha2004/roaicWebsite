const express = require('express');
const router = express.Router();
const { loginPage, login, logout } = require('../controllers/authController');

// Login page route
router.get('/login', loginPage);

// Handle login post request
router.post('/login', login);

// Logout route
router.get('/logout', logout);

module.exports = router;
