// Shared user-storage helpers used by both the login and register pages.
const USERS_KEY = "medicare_users";
const DEFAULT_USER = { username: "admin", password: "admin" };

function getRegisteredUsers() {
  const stored = localStorage.getItem(USERS_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveRegisteredUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function findUser(username) {
  if (username === DEFAULT_USER.username) return DEFAULT_USER;
  return getRegisteredUsers().find(function (u) { return u.username === username; });
}

function isValidCredential(username, password) {
  const user = findUser(username);
  return !!user && user.password === password;
}

function registerUser(username, password) {
  if (password.length < 4 || password.length > 100) {
    return { ok: false, error: "Password must be between 4 and 100 characters." };
  }
  if (findUser(username)) {
    return { ok: false, error: "Username already exists." };
  }
  const users = getRegisteredUsers();
  users.push({ username: username, password: password });
  saveRegisteredUsers(users);
  return { ok: true };
}
