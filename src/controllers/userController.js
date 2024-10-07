const db = require('../config/db');
const errorHandler = require('../middleware/errorHandler');

exports.getAllUsers = async (req, res, next ) => {
  try {
    const result = await db.query('SELECT id, username, email, created_at FROM users ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

exports.getUserById = async (req, res, next ) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT id, username, email, created_at FROM users WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.createUser = async (req, res, next ) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }
    const result = await db.query(
      'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email, created_at',
      [username, email, password]
    );
    res.status(201).json(result.rows[0]);
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
    let query = 'UPDATE users SET ';
    const values = [];
    let valueIndex = 1;

    if (username) {
      query += `username = $${valueIndex}, `;
      values.push(username);
      valueIndex++;
    }
    if (email) {
      query += `email = $${valueIndex}, `;
      values.push(email);
      valueIndex++;
    }
    query = query.slice(0, -2); // remove the last comma and space
    query += ` WHERE id = $${valueIndex} RETURNING id, username, email, created_at`;
    values.push(id);

    const result = await db.query(query, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.deleteUser = async (req, res, next ) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    next(err);
  }
};
