import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { ENV } from './config/env.js';
import { corsOptions } from './config/cors.js';
import { requestLogger } from './middleware/requestLogger.js';
import { apiRateLimiter } from './middleware/rateLimiter.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import apiRoutes from './routes/index.js';
import { prisma } from './config/db.js';
import { runAlertCheckJob } from './jobs/alertChecker.js';

const app = express();

// 1. Security & Core Middleware
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// 2. Base Health Check
app.get('/', (req, res) => {
  res.json({
    project: 'AgriLink — Market Intelligence for a Stronger Tomorrow',
    team: 'Alpha Nexus (Panimalar Engineering College)',
    status: 'online',
    documentation: '/api/health',
  });
});

// 3. API Routes with Rate Limiting
app.use('/api', apiRateLimiter, apiRoutes);

// 4. Fallback 404 & Centralized Error Handler
app.use(notFoundHandler);
app.use(errorHandler);

// 5. Start Server
const server = app.listen(ENV.PORT, () => {
  console.log(`====================================================`);
  console.log(`🌾 AGRILINK BACKEND REST API IS RUNNING`);
  console.log(`🚀 Port: ${ENV.PORT}`);
  console.log(`🌐 Environment: ${ENV.NODE_ENV}`);
  console.log(`🔗 Health URL: http://localhost:${ENV.PORT}/api/health`);
  console.log(`====================================================`);

  // Optional: Run alert checker once upon startup
  runAlertCheckJob().catch((err) =>
    console.error('Initial alert checker run error:', err)
  );

  // Periodically check alerts every 10 minutes in background
  setInterval(() => {
    runAlertCheckJob().catch((err) =>
      console.error('Periodic alert checker error:', err)
    );
  }, 10 * 60 * 1000);
});

// 6. Graceful Shutdown
const handleShutdown = async (signal: string) => {
  console.log(`\n🛑 Received ${signal}. Shutting down gracefully...`);
  server.close(async () => {
    console.log('HTTP server closed.');
    await prisma.$disconnect();
    console.log('Prisma disconnected. Exiting process.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));

export default app;
