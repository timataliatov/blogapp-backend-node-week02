require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const errorHandler = require('./middleware/errorHandler');
const http = require('http');
const { neon } = require('@neondatabase/serverless');

const userRoutes = require('./routes/users');
const commentRoutes = require('./routes/comments');
const postRoutes = require('./routes/posts');

const app = express();
const sql = neon(process.env.DATABASE_URL);

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(errorHandler);

app.use('/api/users', userRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/posts', postRoutes);

// add a new route to check database version
app.get('/db-version', async (req, res) => {
  try {
    const result = await sql`SELECT version()`;
    const { version } = result[0];
    res.status(200).send(version);
  } catch (error) {
    console.error('Error fetching database version:', error);
    res.status(500).send('Error fetching database version');
  }
});

const PORT = process.env.PORT || 10000;
const server = http.createServer(app);

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
