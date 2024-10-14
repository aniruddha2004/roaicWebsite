const bcrypt = require('bcrypt');

const hashPassword = async (password) => {
  const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds
  console.log(`Hashed password: ${hashedPassword}`);
};

// Replace 'your_admin_password' with the password you want to hash for the initial admin
hashPassword('s1l1guri');
