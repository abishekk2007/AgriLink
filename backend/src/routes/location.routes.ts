import { Router } from 'express';
import { locationController } from '../controllers/location.controller.js';

const router = Router();

// States
router.get('/states', (req, res, next) => locationController.getStates(req, res, next));
router.get('/states/:stateId/districts', (req, res, next) =>
  locationController.getDistrictsByState(req, res, next)
);

// Districts & Markets
router.get('/districts/:districtId/markets', (req, res, next) =>
  locationController.getMarketsByDistrict(req, res, next)
);
router.get('/markets', (req, res, next) => locationController.getAllMarkets(req, res, next));

export default router;
