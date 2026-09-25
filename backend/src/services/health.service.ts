import { config } from '../config/env.config';

export interface HealthCheckResult {
  message: string;
  environment: string;
}

export class HealthService {
  /**
   * Evaluates application health and environment state
   */
  public static checkHealth(): HealthCheckResult {
    return {
      message: 'AgriLink Backend is running',
      environment: config.env,
    };
  }

  /**
   * System diagnostics for detailed runtime monitoring
   */
  public static getDiagnostics() {
    const memory = process.memoryUsage();
    return {
      status: 'healthy',
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      environment: config.env,
      memory: {
        heapUsedMB: Number((memory.heapUsed / 1024 / 1024).toFixed(2)),
        heapTotalMB: Number((memory.heapTotal / 1024 / 1024).toFixed(2)),
        rssMB: Number((memory.rss / 1024 / 1024).toFixed(2)),
      },
      system: {
        nodeVersion: process.version,
        platform: process.platform,
        pid: process.pid,
      },
    };
  }
}
