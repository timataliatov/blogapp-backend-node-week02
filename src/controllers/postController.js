const sql = require('../config/db');
const errorHandler = require('../middleware/errorHandler');

exports.getAllPosts = async (req, res, next) => {
  try {
    const result = await sql`SELECT * FROM posts ORDER BY created_at DESC`;
    res.json(result);
  } catch (err) {
    next(err);
  }
};

exports.getPostById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await sql`SELECT * FROM posts WHERE id = ${id}`;
    if (result.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(result[0]);
  } catch (err) {
    next(err);
  }
};

exports.createPost = async (req, res, next) => {
  try {
    const { title, content, user_id } = req.body;
    const result = await sql`
      INSERT INTO posts (title, content, user_id)
      VALUES (${title}, ${content}, ${user_id})
      RETURNING *
    `;
    res.status(201).json(result[0]);
  } catch (err) {
    next(err);
  }
};

exports.updatePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const result = await sql`
      UPDATE posts
      SET title = ${title}, content = ${content}
      WHERE id = ${id}
      RETURNING *
    `;
    if (result.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(result[0]);
  } catch (err) {
    next(err);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await sql`DELETE FROM posts WHERE id = ${id} RETURNING *`;
    if (result.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    next(err);
  }
};
