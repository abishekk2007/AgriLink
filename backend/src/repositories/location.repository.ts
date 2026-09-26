import { prisma } from '../config/db.js';

export class LocationRepository {
  async findAllStates() {
    return prisma.state.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { districts: true },
        },
      },
    });
  }

  async findStateByIdOrCode(identifier: string) {
    return prisma.state.findFirst({
      where: {
        OR: [
          { id: identifier },
          { code: { equals: identifier, mode: 'insensitive' } },
          { name: { equals: identifier, mode: 'insensitive' } },
        ],
      },
      include: {
        districts: {
          orderBy: { name: 'asc' },
        },
      },
    });
  }

  async findDistrictsByState(stateId: string) {
    return prisma.district.findMany({
      where: {
        OR: [
          { stateId },
          { state: { name: { equals: stateId, mode: 'insensitive' } } },
          { state: { code: { equals: stateId, mode: 'insensitive' } } },
        ],
      },
      orderBy: { name: 'asc' },
      include: {
        markets: {
          orderBy: { name: 'asc' },
        },
      },
    });
  }

  async findDistrictById(districtId: string) {
    return prisma.district.findFirst({
      where: {
        OR: [
          { id: districtId },
          { name: { equals: districtId, mode: 'insensitive' } },
        ],
      },
      include: {
        state: true,
        markets: true,
      },
    });
  }

  async findMarketsByDistrict(districtId: string) {
    return prisma.market.findMany({
      where: {
        OR: [
          { districtId },
          { district: { name: { equals: districtId, mode: 'insensitive' } } },
        ],
      },
      orderBy: { name: 'asc' },
      include: {
        district: {
          include: {
            state: true,
          },
        },
      },
    });
  }

  async findMarketByIdOrName(identifier: string) {
    return prisma.market.findFirst({
      where: {
        OR: [
          { id: identifier },
          { code: { equals: identifier, mode: 'insensitive' } },
          { name: { equals: identifier, mode: 'insensitive' } },
        ],
      },
      include: {
        district: {
          include: {
            state: true,
          },
        },
      },
    });
  }

  async findAllMarkets() {
    return prisma.market.findMany({
      orderBy: { name: 'asc' },
      include: {
        district: {
          include: {
            state: true,
          },
        },
      },
    });
  }
}

export const locationRepository = new LocationRepository();
