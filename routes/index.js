const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../controllers/authController');
const { 
  getProjects, getMembers, 
  addProjectForm, addMemberForm, 
  saveProject, saveMember, 
  editProjectForm, updateProject, 
  editMemberForm, updateMember, 
  deleteProject, deleteMember 
} = require('../controllers/clubController');

// Home route
router.get('/', (req, res) => {
  res.render('home', { currentPage: 'home', user: req.session.user });
});

// Projects and Members Routes
router.get('/projects', isAuthenticated, getProjects);
router.get('/members', isAuthenticated, getMembers);

// Adding Projects/Members Routes
router.get('/projects/add', isAuthenticated, addProjectForm);
router.get('/members/add', isAuthenticated, addMemberForm);
router.post('/projects/add', isAuthenticated, saveProject);
router.post('/members/add', isAuthenticated, saveMember);

// Editing Projects/Members Routes
router.get('/projects/edit/:projectId', isAuthenticated, editProjectForm);
router.post('/projects/edit/:projectId', isAuthenticated, updateProject);
router.get('/members/edit/:memberId', isAuthenticated, editMemberForm);
router.post('/members/edit/:memberId', isAuthenticated, updateMember);

// Deleting Projects/Members Routes
router.get('/projects/delete/:projectId', isAuthenticated, deleteProject);
router.get('/members/delete/:memberId', isAuthenticated, deleteMember);

module.exports = router;
