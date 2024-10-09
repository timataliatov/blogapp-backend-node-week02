const sql = require('../config/db');
const errorHandler = require('../middleware/errorHandler');

exports.getAllUsers = async (req, res, next) => {
  try {
    const result = await sql`SELECT id, username, email, created_at FROM users ORDER BY created_at DESC`;
    res.json(result);
  } catch (err) {
    next(err);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await sql`SELECT id, username, email, created_at FROM users WHERE id = ${id}`;
    if (result.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(result[0]);
  } catch (err) {
    next(err);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }
    const result = await sql`INSERT INTO users (username, email, password_hash) VALUES (${username}, ${email}, ${password}) RETURNING id, username, email, created_at`;
    res.status(201).json(result[0]);
  } catch (err) {
    next(err);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { username, email } = req.body;
    if (!username && !email) {
      return res.status(400).json({ error: 'At least one field (username or email) must be provided for update' });
    }
    let updateFields = [];
    if (username) updateFields.push(sql`username = ${username}`);
    if (email) updateFields.push(sql`email = ${email}`);

    const result = await sql`UPDATE users SET ${sql.join(updateFields, ',')} WHERE id = ${id} RETURNING id, username, email, created_at`;
    if (result.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(result[0]);
  } catch (err) {
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await sql`DELETE FROM users WHERE id = ${id} RETURNING id`;
    if (result.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    next(err);
  }
};
