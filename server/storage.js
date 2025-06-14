const fs = require('fs').promises;
const path = require('path');

const STORAGE_FILE = path.join(__dirname, 'users.json');

// Initialize storage file if it doesn't exist
async function initializeStorage() {
  try {
    await fs.access(STORAGE_FILE);
  } catch {
    await fs.writeFile(STORAGE_FILE, JSON.stringify({}));
  }
}

// Read all users
async function getUsers() {
  try {
    const data = await fs.readFile(STORAGE_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading users:', error);
    return {};
  }
}

// Save all users
async function saveUsers(users) {
  try {
    await fs.writeFile(STORAGE_FILE, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Error saving users:', error);
    throw error;
  }
}

// Get a single user
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