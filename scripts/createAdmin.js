const bcrypt = require('bcrypt');

async function createHashedPassword() {
  const password = 'admin2024';
  const saltRounds = 12;
  
  try {
    const hash = await bcrypt.hash(password, saltRounds);
    console.log('Password hash:', hash);
    return hash;
  } catch (error) {
    console.error('Error creating hash:', error);
  }
}

createHashedPassword();