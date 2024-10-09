const db = require('../firebase');
const { ref, get, child } = require('firebase/database');

// Function to handle /projects route
const getProjects = async (req, res) => {
  try {
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, `Projects`));
    if (snapshot.exists()) {
      const projects = snapshot.val();
      res.render('projects', { currentPage: 'projects', user: req.session.user, projects });
    } else {
      res.render('projects', { currentPage: 'projects', user: req.session.user, projects: null });
    }
  } catch (error) {
    res.render('projects', { currentPage: 'projects', user: req.session.user, projects: null });
  }
};

// Function to handle /members route
const getMembers = async (req, res) => {
  try {
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, `Members`));
    if (snapshot.exists()) {
      const members = snapshot.val();
      res.render('members', { currentPage: 'members', user: req.session.user, members });
    } else {
      res.render('members', { currentPage: 'members', user: req.session.user, members: null });
    }
  } catch (error) {
    res.render('members', { currentPage: 'members', user: req.session.user, members: null });
  }
};

module.exports = { getProjects, getMembers };
