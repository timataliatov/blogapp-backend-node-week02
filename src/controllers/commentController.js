const sql = require('../config/db');
const errorHandler = require('../middleware/errorHandler');

exports.getAllComments = async (req, res, next) => {
  try {
    const result = await sql`SELECT * FROM comments ORDER BY created_at DESC`;
    res.json(result);
  } catch (err) {
    next(err);
  }
};

exports.getCommentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await sql`SELECT * FROM comments WHERE id = ${id}`;
    if (result.length === 0) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    res.json(result[0]);
  } catch (err) {
    next(err);
  }
};

exports.createComment = async (req, res, next) => {
  try {
    const { content, user_id, post_id } = req.body;
    if (!content || !user_id || !post_id) {
      return res.status(400).json({ error: 'Content, user_id, and post_id are required' });
    }
    const result = await sql`
      INSERT INTO comments (content, user_id, post_id)
      VALUES (${content}, ${user_id}, ${post_id})
      RETURNING *
    `;
    res.status(201).json(result[0]);
  } catch (err) {
    next(err);
  }
};

exports.updateComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ error: 'Content is required for update' });
    }
    const result = await sql`
      UPDATE comments
      SET content = ${content}
      WHERE id = ${id}
      RETURNING *
    `;
    if (result.length === 0) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    res.json(result[0]);
  } catch (err) {
    next(err);
  }
};

exports.deleteComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await sql`DELETE FROM comments WHERE id = ${id} RETURNING id`;
    if (result.length === 0) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    res.json({ message: 'Comment deleted successfully' });
  } catch (err) {
    next(err);
  }
};
