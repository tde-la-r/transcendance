const fastify = require('fastify')({ logger: true });

const authRoutes = require('./auth');
const cors = require('@fastify/cors');

fastify.register(cors, {
    origin: true, // accepte toutes les origines (à restreindre en prod)
    credentials: true
});

fastify.register(authRoutes, {prefix: '/api/auth'});

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