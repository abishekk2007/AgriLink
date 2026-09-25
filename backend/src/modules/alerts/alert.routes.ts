import { Router } from 'express';
import { AlertController } from './alert.controller';

const router = Router();

/**
 * @route   POST /api/alerts
 * @desc    Create a new farmer commodity price threshold alert
 * @access  Public
 */
router.post('/', AlertController.createAlert);

/**
 * @route   GET /api/alerts
 * @desc    Retrieve all created alerts with real-time trigger evaluation
 * @access  Public
 */
router.get('/', AlertController.getAlerts);

export default router;
