const fastify = require('fastify')({ logger: true });

const cookie = require('@fastify/cookie');
const authRoutes = require('./auth');
const cors = require('@fastify/cors');
const usersRoutes = require('./users');
// --- STATS API ULTRA SIMPLE ---
const db = require('./db');

function dbGet(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => (err ? reject(err) : resolve(row)));
  });
}

fastify.get('/api/users/:id/stats', async (req, reply) => {
  const id = Number(req.params.id);
  if (!id) return reply.code(400).send({ error: 'Invalid user id' });

  const row = await dbGet('SELECT wins, losses FROM users WHERE id = ?', [id]);
  if (!row) return reply.code(404).send({ error: 'User not found' });

  const wins   = Number(row.wins || 0);
  const losses = Number(row.losses || 0);
  const played = wins + losses;
  const winRate = played ? Math.round((wins / played) * 1000) / 10 : 0; // 1 décimale

  return { wins, losses, played, winRate }; // <- simple et suffisant
});

fastify.register(cors, {
    origin: true, // accepte toutes les origines (à restreindre en prod)
    credentials: true
});

fastify.register(cookie, {
  // secret optionnel si tu veux des cookies signés
  // secret: process.env.COOKIE_SECRET
});

fastify.register(authRoutes, {prefix: '/api/auth'});

fastify.register(usersRoutes, { prefix: '/api/users' });

// demarrage du serveur sur le port 3000
const start = async () => {
  try {
    const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
    await fastify.listen({ port: PORT, host: '0.0.0.0' });
    fastify.log.info(`Server is listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();