import { Request, Response } from 'express';
import { successResponse } from '../utils/responseFormatter.js';
import { prisma } from '../config/db.js';

export class HealthController {
  async getHealth(req: Request, res: Response) {
    let dbStatus = 'ok';
    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch {
      dbStatus = 'disconnected';
    }

    res.json(
      successResponse({
        status: 'ok',
        service: 'agrilink-api',
        project: 'AgriLink — Market Intelligence for a Stronger Tomorrow',
        team: 'Alpha Nexus (Panimalar Engineering College)',
        database: dbStatus,
        version: '1.0.0',
        timestamp: new Date().toISOString(),
      })
    );
  }
}

export const healthController = new HealthController();
