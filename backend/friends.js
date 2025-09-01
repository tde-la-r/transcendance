const db = require('./db');
const { requireUser } = require('./auth-mw');

function dbGet(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => (err ? reject(err) : resolve(row)));
  });
}
function dbAll(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => (err ? reject(err) : resolve(rows)));
  });
}
function dbRun(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve(this);
    });
  });
}

async function userByHandle(handle) {
  if (handle == null) return null;
  const h = String(handle).trim();
  if (!h) return null;

  let u = await dbGet(
    'SELECT id, username, email, alias, avatar_url, wins, losses FROM users WHERE username = ?',
    [h]
  );
  if (u) return u;

  u = await dbGet(
    'SELECT id, username, email, alias, avatar_url, wins, losses FROM users WHERE alias = ?',
    [h]
  );
  return u;
}

async function alreadyFriends(a, b) {
  const r = await dbGet('SELECT 1 FROM friendships WHERE user_id = ? AND friend_id = ?', [a, b]);
  return !!r;
}

async function friendsRoutes(fastify) {
  // Liste des amis du user courant
  fastify.get('/me/friends', { preHandler: requireUser }, async (req, reply) => {
    const me = req.user;
    const limit  = Math.max(1, Math.min(100, Number(req.query.limit) || 50));
    const offset = Math.max(0, Number(req.query.offset) || 0);

    const rows = await dbAll(
      `SELECT u.id, u.username, u.alias, u.avatar_url, u.wins, u.losses
       FROM friendships f
       JOIN users u ON u.id = f.friend_id
       WHERE f.user_id = ?
       ORDER BY u.username COLLATE NOCASE
       LIMIT ? OFFSET ?`,
      [me.id, limit, offset]
    );
    return { ok: true, friends: rows, pagination: { limit, offset, count: rows.length } };
  });

  // Ajouter un ami (par id/username/email)
    fastify.post('/me/friends', { preHandler: requireUser }, async (req, reply) => {
        const me = req.user;
        const { friend } = req.body || {}; // ex: { "friend": "bob" } (username ou alias)
        const target = await userByHandle(friend);

        if (!target) return reply.code(404).send({ error: 'User not found' });
        if (target.id === me.id) return reply.code(400).send({ error: 'Cannot friend yourself' });

        try {
            await dbRun('INSERT INTO friendships (user_id, friend_id) VALUES (?, ?)', [me.id, target.id]);
            return reply.code(201).send({ ok: true, friend: target, already: false });
        } catch (e) {
            const m = String(e.message || '');
            if (m.includes('UNIQUE constraint failed'))
                return reply.send({ ok: true, friend: target, already: true });
            fastify.log.error({ msg: 'ADD FRIEND failed', err: { message: e.message, stack: e.stack } });
            return reply.code(500).send({ error: 'Internal server error' });
        }
    });
  // Supprimer un ami
    fastify.delete('/me/friends/:id', { preHandler: requireUser }, async (req, reply) => {
        const me = req.user;
        const friendId = Number(req.params.id);
        if (!friendId) return reply.code(400).send({ error: 'Invalid friend id' });

        try {
            const r = await dbRun('DELETE FROM friendships WHERE user_id = ? AND friend_id = ?', [me.id, friendId]);
            return reply.send({ ok: true, removed: r.changes || 0 });
        } catch (e) {
            fastify.log.error({ msg: 'REMOVE FRIEND failed', err: { message: e.message, stack: e.stack } });
            return reply.code(500).send({ error: 'Internal server error' });
        }
    });

  // Vérifier si ami (bool)
    fastify.get('/me/friends/:id', { preHandler: requireUser }, async (req, reply) => {
        const me = req.user;
        const friendId = Number(req.params.id);
        if (!friendId) return reply.code(400).send({ error: 'Invalid friend id' });

        const r = await dbGet('SELECT 1 AS ok FROM friendships WHERE user_id = ? AND friend_id = ?', [me.id, friendId]);
        return { ok: true, following: !!r };
    });
}

module.exports = friendsRoutes;