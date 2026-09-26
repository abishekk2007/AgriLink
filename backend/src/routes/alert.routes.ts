import { Router } from 'express';
import { alertController } from '../controllers/alert.controller.js';
import { validate } from '../middleware/validate.js';
import {
  CreateAlertSchema,
  UpdateAlertSchema,
} from '../validators/alert.validator.js';

const router = Router();

router.post(
  '/',
  validate(CreateAlertSchema, 'body'),
  (req, res, next) => alertController.createAlert(req, res, next)
);

router.get('/', (req, res, next) => alertController.getAlerts(req, res, next));

router.patch(
  '/:id',
  validate(UpdateAlertSchema, 'body'),
  (req, res, next) => alertController.updateAlert(req, res, next)
);

router.delete('/:id', (req, res, next) =>
  alertController.deleteAlert(req, res, next)
);

router.post('/check', (req, res, next) =>
  alertController.checkAlerts(req, res, next)
);

export default router;
