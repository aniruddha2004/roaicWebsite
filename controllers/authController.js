const { ref, get, child } = require('firebase/database');
const db = require('../firebase'); // Your Firebase setup

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    // Store the original URL so we can redirect after login
    req.session.redirectTo = req.originalUrl;
    res.redirect('/auth/login');
  }
};

// Render login page
const loginPage = (req, res) => res.render('login', { currentPage: 'login', user: req.session.user, error: null });

// Handle login
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Fetch all users from the database
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, 'Users')); // Get the Users node

    if (snapshot.exists()) {
      const users = snapshot.val();
      let validUser = null;

      // Loop through all users to find the one with the matching email
      for (const key in users) {
        if (users[key].email === email && users[key].password === password) {
          validUser = users[key];
          break;
        }
      }

      if (validUser) {
        // If the user is found, start a session
        req.session.user = { email: validUser.email };

        // Redirect to the page the user originally wanted to access
        const redirectTo = req.session.redirectTo || '/projects'; // Default to /projects if no route is stored
        delete req.session.redirectTo; // Clear it from the session
        res.redirect(redirectTo);
      } else {
        // Invalid login attempt
        res.render('login', { currentPage: 'login', user: null, error: 'Invalid email or password' });
      }
    } else {
      // No users exist
      res.render('login', { currentPage: 'login', user: null, error: 'No users found' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.render('login', { currentPage: 'login', user: null, error: 'An error occurred, please try again later' });
  }
};

// Handle logout
const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

module.exports = { isAuthenticated, loginPage, login, logout };
