const db = require('../firebase');
const { ref, get, child, push, set, update, remove } = require('firebase/database');

// Function to handle /projects route
const getProjects = async (req, res) => {
  try {
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, `Projects`));

    if (snapshot.exists()) {
      const projects = snapshot.val();
      const isAdmin = req.session.user && req.session.user.admin; // Check if the user is admin

      if (req.session.user) {
        // Logged-in users can view all projects
        res.render('projects', { currentPage: 'projects', user: req.session.user, projects, isAdmin });
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
      const isAdmin = req.session.user && req.session.user.admin; // Check if the user is admin

      res.render('members', { currentPage: 'members', user: req.session.user, members, isAdmin });
    } else {
      res.render('members', { currentPage: 'members', user: req.session.user, members: null });
    }
  } catch (error) {
    res.render('members', { currentPage: 'members', user: req.session.user, members: null });
  }
};

// Function to display the "Add Project" form
const addProjectForm = (req, res) => {
  if (req.session.user && req.session.user.admin) {
    res.render('addProject', { currentPage: 'addProject', user: req.session.user });
  } else {
    res.redirect('/projects'); // Redirect if user is not an admin
  }
};

// Function to display the "Add Member" form
const addMemberForm = (req, res) => {
  if (req.session.user && req.session.user.admin) {
    res.render('addMember', { currentPage: 'addMember', user: req.session.user });
  } else {
    res.redirect('/members'); // Redirect if user is not an admin
  }
};

// Function to handle adding a project
const saveProject = async (req, res) => {
  const { projectName, projectSummary, isCompleted, image } = req.body;

  if (req.session.user && req.session.user.admin) {
    const dbRef = ref(db, 'Projects');
    const newProjectRef = push(dbRef); // Automatically generate a unique key for the new project

    await set(newProjectRef, {
      projectName,
      projectSummary,
      image,
      isCompleted: isCompleted === 'true', // Convert to boolean
    });

    res.redirect('/projects');
  } else {
    res.redirect('/projects');
  }
};

// Function to handle adding a member
const saveMember = async (req, res) => {
  const { email, name, role } = req.body;

  if (req.session.user && req.session.user.admin) {
    const dbRef = ref(db, 'Members');
    const newMemberRef = push(dbRef); // Automatically generate a unique key for the new member

    await set(newMemberRef, {
      email,
      name,
      role,
    });

    res.redirect('/members');
  } else {
    res.redirect('/members');
  }
};

// Function to display the "Edit Project" form
const editProjectForm = async (req, res) => {
  const { projectId } = req.params;
  const dbRef = ref(db);

  try {
    const snapshot = await get(child(dbRef, `Projects/${projectId}`));

    if (snapshot.exists()) {
      const project = snapshot.val();
      res.render('editProject', { currentPage: 'editProject', user: req.session.user, project, projectId });
    } else {
      res.redirect('/projects');
    }
  } catch (error) {
    res.redirect('/projects');
  }
};

// Function to handle updating a project
const updateProject = async (req, res) => {
  const { projectId } = req.params;
  const { projectName, projectSummary, isCompleted, image } = req.body;

  if (req.session.user && req.session.user.admin) {
    const projectRef = ref(db, `Projects/${projectId}`);

    try {
      await update(projectRef, {
        projectName,
        projectSummary,
        isCompleted: isCompleted === 'true',
        image
      });

      res.redirect('/projects');
    } catch (error) {
      res.redirect(`/projects/edit/${projectId}`);
    }
  } else {
    res.redirect('/projects');
  }
};

// Function to display the "Edit Member" form
const editMemberForm = async (req, res) => {
  const { memberId } = req.params;
  const dbRef = ref(db);

  try {
    const snapshot = await get(child(dbRef, `Members/${memberId}`));

    if (snapshot.exists()) {
      const member = snapshot.val();
      res.render('editMember', { currentPage: 'editMember', user: req.session.user, member, memberId });
    } else {
      res.redirect('/members');
    }
  } catch (error) {
    res.redirect('/members');
  }
};

// Function to handle updating a member
const updateMember = async (req, res) => {
  const { memberId } = req.params;
  const { name, email, role } = req.body;

  if (req.session.user && req.session.user.admin) {
    const memberRef = ref(db, `Members/${memberId}`);

    try {
      await update(memberRef, {
        name,
        email,
        role
      });

      res.redirect('/members');
    } catch (error) {
      res.redirect(`/members/edit/${memberId}`);
    }
  } else {
    res.redirect('/members');
  }
};

// Function to delete a project
const deleteProject = async (req, res) => {
  const { projectId } = req.params;

  if (req.session.user && req.session.user.admin) {
    const projectRef = ref(db, `Projects/${projectId}`);

    try {
      await remove(projectRef);
      res.redirect('/projects'); // Redirect after successful deletion
    } catch (error) {
      res.redirect('/projects'); // Handle error case
    }
  } else {
    res.redirect('/projects');
  }
};

// Function to delete a member
const deleteMember = async (req, res) => {
  const { memberId } = req.params;

  if (req.session.user && req.session.user.admin) {
    const memberRef = ref(db, `Members/${memberId}`);

    try {
      await remove(memberRef);
      res.redirect('/members'); // Redirect after successful deletion
    } catch (error) {
      res.redirect('/members'); // Handle error case
    }
  } else {
    res.redirect('/members');
  }
};

module.exports = { 
  getProjects, getMembers, 
  addProjectForm, addMemberForm, 
  saveProject, saveMember, 
  editProjectForm, updateProject, 
  editMemberForm, updateMember,
  deleteProject, deleteMember 
};
