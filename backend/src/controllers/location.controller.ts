import { Request, Response, NextFunction } from 'express';
import { locationService } from '../services/location.service.js';
import { successResponse } from '../utils/responseFormatter.js';

export class LocationController {
  async getStates(req: Request, res: Response, next: NextFunction) {
    try {
      const states = await locationService.getAllStates();
      res.json(successResponse(states, { count: states.length }));
    } catch (error) {
      next(error);
    }
  }

  async getDistrictsByState(req: Request, res: Response, next: NextFunction) {
    try {
      const stateId = String(req.params.stateId);
      const districts = await locationService.getDistrictsByState(stateId);
      res.json(successResponse(districts, { count: districts.length }));
    } catch (error) {
      next(error);
    }
  }

  async getMarketsByDistrict(req: Request, res: Response, next: NextFunction) {
    try {
      const districtId = String(req.params.districtId);
      const markets = await locationService.getMarketsByDistrict(districtId);
      res.json(successResponse(markets, { count: markets.length }));
    } catch (error) {
      next(error);
    }
  }

  async getAllMarkets(req: Request, res: Response, next: NextFunction) {
    try {
      const markets = await locationService.getAllMarkets();
      res.json(successResponse(markets, { count: markets.length }));
    } catch (error) {
      next(error);
    }
  }
}

export const locationController = new LocationController();
