const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('data/app.sqlite', (err) => {
  if (err) {
    console.error('Could not open database', err);
  } else {
    console.log('Connected to SQLite database.');
  }
});

db.serialize(() => {
  db.run(`PRAGMA foreign_keys = ON`)});

db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    alias TEXT UNIQUE,
    avatar_url TEXT,
    wins INTEGER NOT NULL DEFAULT 0,
    losses INTEGER NOT NULL DEFAULT 0
  )
`, (err) => {
  if (err) {
    console.error('Error creating table', err);
  }
});

db.run(`
  CREATE TABLE IF NOT EXISTS friendships (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id   INTEGER NOT NULL,
    friend_id INTEGER NOT NULL,
    UNIQUE(user_id, friend_id),
    CHECK (user_id != friend_id),
    FOREIGN KEY(user_id)   REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(friend_id) REFERENCES users(id) ON DELETE CASCADE
  )
`, (err) => {
  if (err) {
    console.error('Error creating table', err);
  }
});

db.run(`
  CREATE TABLE IF NOT EXISTS matches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player1_id INTEGER NOT NULL,
    player2_id INTEGER NOT NULL,
    score_p1 INTEGER NOT NULL,
    score_p2 INTEGER NOT NULL,
    winner_id INTEGER NOT NULL,
    FOREIGN KEY(player1_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(player2_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(winner_id)  REFERENCES users(id) ON DELETE CASCADE
  )
`, (err) => {
  if (err) {
    console.error('Error creating table', err);
  }
});

function addColumnIfMissing(table, column, definition) {
  return new Promise((resolve, reject) => {
    db.all(`PRAGMA table_info(${table});`, [], (err, rows) => {
      if (err) return reject(err);
      const exists = rows.some(r => r.name === column);
      if (exists) return resolve(false);
      db.run(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition};`, [], (e) => {
        if (e) return reject(e);
        resolve(true);
      });
    });
  });
}

async function migrate2FA() {
  try {
    await addColumnIfMissing('users', 'twofa_enabled', 'INTEGER NOT NULL DEFAULT 0');
    await addColumnIfMissing('users', 'twofa_type',    'TEXT');
    await addColumnIfMissing('users', 'twofa_secret',  'TEXT');
    console.log('[DB] 2FA columns ensured on users table.');
  } catch (e) {
    console.error('[DB] 2FA migration failed:', e.message);
  }
}

// Appelle la migration après avoir ouvert la DB et créé les tables
migrate2FA();

module.exports = db;