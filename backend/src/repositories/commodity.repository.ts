import { prisma } from '../config/db.js';

export class CommodityRepository {
  async findAll() {
    return prisma.commodity.findMany({
      orderBy: { name: 'asc' },
      include: {
        msps: {
          orderBy: { year: 'desc' },
          take: 1,
        },
      },
    });
  }

  async findByIdOrCode(identifier: string) {
    return prisma.commodity.findFirst({
      where: {
        OR: [
          { id: identifier },
          { code: { equals: identifier, mode: 'insensitive' } },
          { name: { equals: identifier, mode: 'insensitive' } },
        ],
      },
      include: {
        msps: {
          orderBy: { year: 'desc' },
        },
      },
    });
  }

  async findMSP(commodityId: string, year?: number) {
    return prisma.mSP.findFirst({
      where: {
        commodityId,
        ...(year ? { year } : {}),
      },
      orderBy: { year: 'desc' },
    });
  }
}

export const commodityRepository = new CommodityRepository();
