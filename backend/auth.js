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

function validatePassword(password, { username, email }) {
  const errors = [];
  if (typeof password !== 'string') errors.push('Password must be a string.');
  if (password.length < 8) errors.push('Password must be at least 10 characters.');
  if (password.length > 72) errors.push('Password must be at most 72 characters.'); // bcrypt limit
  if (!/[a-z]/.test(password)) errors.push('Password must include a lowercase letter.');
  if (!/[A-Z]/.test(password)) errors.push('Password must include an uppercase letter.');
  if (!/[0-9]/.test(password)) errors.push('Password must include a digit.');
  if (!/[^A-Za-z0-9]/.test(password)) errors.push('Password must include a symbol.');
  if (/\s/.test(password)) errors.push('Password must not contain spaces.');

  const lowered = password.toLowerCase();
  const u = String(username || '').toLowerCase();
  const local = String(email || '').split('@')[0]?.toLowerCase();

  if (u && lowered.includes(u)) errors.push('Password must not contain the username.');
  if (local && lowered.includes(local)) errors.push('Password must not contain parts of the email.');

  return { ok: errors.length === 0, errors };
}

function validateUsername(username) {
  const errors = [];
  const u = String(username || '').trim();

  if (!u) errors.push('Username is required.');
  // 3–20 caractères, alphanum + . _ - (mêmes règles que profil)
  if (!/^[a-zA-Z0-9._-]{3,20}$/.test(u)) {
    errors.push('Username must be 3–20 chars, letters/numbers/._- only.');
  }
  return { ok: errors.length === 0, value: u, errors };
}

async function authRoute(fastify, options) {
  fastify.post('/register', async (request, reply) => {
    let { username, email, password } = request.body || {};
    username = String(username || '').trim();
    email    = String(email || '').trim().toLowerCase();

    if (!email || !username || !password) {
      return reply.code(400).send({ error: 'Email, username and password are required.' });
    }

    const un = validateUsername(username);
    if (!un.ok) {
      return reply.code(400).send({ error: 'Invalid username', details: un.errors });
    }
    username = un.value;

    const policy = validatePassword(password, { username, email });
    if (!policy.ok)
      return reply.code(400).send({ error: 'Weak password', details: policy.errors });
    try {
      const existingUser = await dbGet('SELECT 1 FROM users WHERE username = ?', [username]);
      if (existingUser) {
        return reply.code(400).send({ error: 'User already exists.' });
      }

      const existingEmail = await dbGet('SELECT 1 FROM users WHERE email = ?', [email]);
      if (existingEmail) {
        return reply.code(400).send({ error: 'Email already used.' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      await dbRun('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword]);

      return reply.code(201).send({ ok: true,  message: 'User registered successfully!' });
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: 'Internal server error.' });
    }
  });


  fastify.post('/login', async (request, reply) => {
    let { username, password } = request.body || {};
    if (!username || !password) {
      return reply.code(400).send({ error: 'Username and password are required.' });
    }

    const raw = String(username).trim();
    const u = raw.includes('@') ? raw.toLowerCase() : raw;
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
