import { commodityRepository } from '../repositories/commodity.repository.js';

export class CommodityService {
  async getAllCommodities() {
    return commodityRepository.findAll();
  }

  async getCommodityByIdOrCode(identifier: string) {
    return commodityRepository.findByIdOrCode(identifier);
  }

  async getMSP(commodityId: string, year?: number) {
    return commodityRepository.findMSP(commodityId, year);
  }
}

export const commodityService = new CommodityService();
