const db = require('../firebase');
const { ref, get, child } = require('firebase/database');

// Function to handle /projects route
const getProjects = async (req, res) => {
  try {
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, `Projects`));

    if (snapshot.exists()) {
      const projects = snapshot.val();
      
      if (req.session.user) {
        // Logged-in users can view all projects
        res.render('projects', { currentPage: 'projects', user: req.session.user, projects });
      } else {
        // Guests can only view completed projects
        const completedProjects = Object.fromEntries(
          Object.entries(projects).filter(([key, project]) => project.isCompleted)
        );
        res.render('projects', { currentPage: 'projects', user: null, projects: completedProjects });
      }
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
