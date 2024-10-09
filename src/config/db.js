const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL);

module.exports = sql;

// Remove the pool.connect() call as it's not needed with neon
