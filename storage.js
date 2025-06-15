const fs = require('fs');
const path = require('path');

const STORAGE_FILE = path.join(__dirname, 'users.json');

// Initialize storage file if it doesn't exist
async function initializeStorage() {
  try {
    if (!fs.existsSync(STORAGE_FILE)) {
      await fs.promises.writeFile(STORAGE_FILE, JSON.stringify({}), 'utf8');
      console.log('Storage file initialized');
    }
  } catch (error) {
    console.error('Error initializing storage:', error);
    throw error;
  }
}

// Get all users
async function getUsers() {
  try {
    const data = await fs.promises.readFile(STORAGE_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading users:', error);
    return {};
  }
}

// Save all users
async function saveUsers(users) {
  try {
    await fs.promises.writeFile(STORAGE_FILE, JSON.stringify(users, null, 2), 'utf8');
  } catch (error) {
    console.error('Error saving users:', error);
    throw error;
  }
}

// Get a single user by email
async function getUser(email) {
  const users = await getUsers();
  return users[email];
}

// Save a single user
async function saveUser(email, userData) {
  const users = await getUsers();
  users[email] = userData;
  await saveUsers(users);
}

module.exports = {
  initializeStorage,
  getUsers,
  saveUsers,
  getUser,
  saveUser
}; 