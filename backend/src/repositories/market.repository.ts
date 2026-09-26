import { prisma } from '../config/db.js';

export interface PriceFilterParams {
  commodityId: string;
  marketId?: string;
  marketIds?: string[];
  startDate?: Date;
  endDate?: Date;
  limit?: number;
}

export class MarketRepository {
  async findPrices(params: PriceFilterParams) {
    const { commodityId, marketId, marketIds, startDate, endDate, limit } = params;

    const where: any = { commodityId };

    if (marketId) {
      where.marketId = marketId;
    } else if (marketIds && marketIds.length > 0) {
      where.marketId = { in: marketIds };
    }

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = startDate;
      if (endDate) where.date.lte = endDate;
    }

    return prisma.marketPrice.findMany({
      where,
      orderBy: { date: 'asc' },
      take: limit,
      include: {
        commodity: true,
        market: {
          include: {
            district: {
              include: {
                state: true,
              },
            },
          },
        },
        source: true,
      },
    });
  }

  async findLatestPrice(commodityId: string, marketId: string) {
    return prisma.marketPrice.findFirst({
      where: {
        commodityId,
        marketId,
      },
      orderBy: { date: 'desc' },
      include: {
        commodity: true,
        market: {
          include: {
            district: {
              include: {
                state: true,
              },
            },
          },
        },
        source: true,
      },
    });
  }

  async findLatestPricesForMarkets(commodityId: string, marketIds: string[]) {
    // Return latest record for each market
    const results = await Promise.all(
      marketIds.map((marketId) =>
        prisma.marketPrice.findFirst({
          where: { commodityId, marketId },
          orderBy: { date: 'desc' },
          include: {
            market: {
              include: {
                district: {
                  include: {
                    state: true,
                  },
                },
              },
            },
          },
        })
      )
    );

    return results.filter((r): r is NonNullable<typeof r> => r !== null);
  }

  async getHistoricalPriceSeries(commodityId: string, marketId: string, days = 90) {
    return prisma.marketPrice.findMany({
      where: {
        commodityId,
        marketId,
      },
      orderBy: { date: 'desc' },
      take: days,
      select: {
        date: true,
        modalPrice: true,
        minPrice: true,
        maxPrice: true,
      },
    });
  }

  async getDataSourceInfo() {
    return prisma.dataSource.findMany({
      include: {
        importLogs: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        _count: {
          select: { marketPrices: true },
        },
      },
    });
  }
}

export const marketRepository = new MarketRepository();
