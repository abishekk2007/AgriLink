import { Router } from 'express';
import { HealthController } from '../controllers/health.controller';

const router = Router();

/**
 * @route   GET /api/health
 * @desc    Health check endpoint
 * @access  Public
 */
router.get('/', HealthController.getHealth);

/**
 * @route   GET /api/health/status
 * @desc    Detailed runtime diagnostics
 * @access  Public
 */
router.get('/status', HealthController.getDiagnostics);

export default router;
