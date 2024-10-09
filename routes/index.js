const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../controllers/authController');
const { getProjects, getMembers } = require('../controllers/clubController');

// Home route
router.get('/', (req, res) => {
  res.render('home', { currentPage: 'home', user: req.session.user });
});

// About route
router.get('/about', (req, res) => {
  res.render('about', { currentPage: 'about', user: req.session.user });
});

// Contact route
router.get('/contact', (req, res) => {
  res.render('contact', { currentPage: 'contact', user: req.session.user });
});

// Projects route (protected)
router.get('/projects', isAuthenticated, getProjects);

// Members route (protected)
router.get('/members', isAuthenticated, getMembers);

module.exports = router;
