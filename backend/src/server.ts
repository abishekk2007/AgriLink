import http from 'http';
import { app } from './app';
import { config } from './config/env.config';
import { logger } from './utils/logger';
import { disconnectDatabase } from './database/prisma';

/**
 * AgriLink HTTP Server Bootstrap
 */
const startServer = (): http.Server => {
  const server = http.createServer(app);

  const { port, host, apiPrefix } = config.server;

  server.listen(port, () => {
    logger.info(`=======================================================`);
    logger.info(`🌾 AgriLink Agricultural Intelligence Backend Started!`);
    logger.info(`🚀 Environment: ${config.env}`);
    logger.info(`🌐 Server URL:  http://${host}:${port}`);
    logger.info(`📡 API Root:    http://${host}:${port}${apiPrefix}`);
    logger.info(`🩺 Health:      http://${host}:${port}${apiPrefix}/health`);
    logger.info(`📊 Diagnostics: http://${host}:${port}${apiPrefix}/health/status`);
    logger.info(`=======================================================`);
  });

  // Graceful shutdown handling
  const gracefulShutdown = (signal: string) => {
    logger.warn(`Received ${signal}. Starting graceful shutdown...`);

    server.close(async () => {
      logger.info('HTTP server closed successfully. Disconnecting database...');
      await disconnectDatabase();
      process.exit(0);
    });

    // Force close if connections fail to terminate within 10s
    setTimeout(() => {
      logger.error('Could not close connections in time, forcefully shutting down.');
      process.exit(1);
    }, 10000).unref();
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  // Catch unexpected unhandled exceptions & rejections
  process.on('uncaughtException', (err: Error) => {
    logger.error('CRITICAL: Uncaught Exception detected!', {
      message: err.message,
      stack: err.stack,
    });
    process.exit(1);
  });

  process.on('unhandledRejection', (reason: unknown) => {
    logger.error('CRITICAL: Unhandled Promise Rejection detected!', {
      reason,
    });
  });

  return server;
};

// Start the server
startServer();
