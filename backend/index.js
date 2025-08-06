const fastify = require('fastify')({ logger: true });

const authRoutes = require('./auth');
const cors = require('@fastify/cors');

fastify.register(cors, {
    origin: true, // accepte toutes les origines (à restreindre en prod)
    credentials: true
});

fastify.register(authRoutes);

// demarrage du serveur sur le port 3000
const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    fastify.log.info(`Server is listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();