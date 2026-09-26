import { locationRepository } from '../repositories/location.repository.js';

export class LocationService {
  async getAllStates() {
    return locationRepository.findAllStates();
  }

  async getStateById(stateId: string) {
    return locationRepository.findStateByIdOrCode(stateId);
  }

  async getDistrictsByState(stateId: string) {
    return locationRepository.findDistrictsByState(stateId);
  }

  async getMarketsByDistrict(districtId: string) {
    return locationRepository.findMarketsByDistrict(districtId);
  }

  async getMarketByIdOrName(identifier: string) {
    return locationRepository.findMarketByIdOrName(identifier);
  }

  async getAllMarkets() {
    return locationRepository.findAllMarkets();
  }
}

export const locationService = new LocationService();
