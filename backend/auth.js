const bcrypt = require('bcrypt');
const db = require('./db');

function dbGet(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

function dbRun(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this); // `this` contient `lastID`, etc.
    });
  });
}

async function authRoute(fastify, options) {
  fastify.post('/register', async (request, reply) => {
    const { username, email, password } = request.body;

    if (!email || !username || !password) {
      return reply.code(400).send({ error: 'Email, username and password are required.' });
    }

    try {
      const existingUser = await dbGet('SELECT * FROM users WHERE username = ?', [username]);
      if (existingUser) {
        return reply.code(400).send({ error: 'User already exists.' });
      }

      const existingEmail = await dbGet('SELECT * FROM users WHERE email = ?', [email]);
      if (existingEmail) {
        return reply.code(400).send({ error: 'Email already used.' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      await dbRun('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword]);

      return reply.send({ message: 'User registered successfully!' });
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: 'Internal server error.' });
    }
  });


  fastify.post('/login', async (request, reply) => {
    const { username, password } = request.body || {};
    if (!username || !password) {
      return reply.code(400).send({ error: 'Username and password are required.' });
    }

    const u = username.trim();
    const user = await dbGet(
      'SELECT * FROM users WHERE username = ? OR email = ?',
      [u, u]
    );
    if (!user) return reply.code(400).send({ error: 'Wrong username or email.' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return reply.code(400).send({ error: 'Wrong password.' });

    return reply.send({ ok: true, message: 'Login successful', user: { id: user.id, username: user.username, email: user.email ?? user.Email } });
  });
}

module.exports = authRoute;
