import { prisma } from '../config/db.js';

export interface CreateAlertData {
  userId?: string;
  commodityId: string;
  marketId: string;
  targetPrice: number;
  condition: 'ABOVE' | 'BELOW';
  notes?: string;
}

export interface UpdateAlertData {
  targetPrice?: number;
  condition?: 'ABOVE' | 'BELOW';
  status?: 'ACTIVE' | 'TRIGGERED' | 'DISABLED';
  triggeredAt?: Date | null;
  notes?: string;
}

export class AlertRepository {
  async create(data: CreateAlertData) {
    return prisma.priceAlert.create({
      data: {
        userId: data.userId || null,
        commodityId: data.commodityId,
        marketId: data.marketId,
        targetPrice: data.targetPrice,
        condition: data.condition,
        status: 'ACTIVE',
        notes: data.notes,
      },
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
      },
    });
  }

  async findAll(status?: string, userId?: string) {
    const where: any = {};
    if (status) where.status = status;
    if (userId) where.userId = userId;

    return prisma.priceAlert.findMany({
      where,
      orderBy: { createdAt: 'desc' },
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
      },
    });
  }

  async findById(id: string) {
    return prisma.priceAlert.findUnique({
      where: { id },
      include: {
        commodity: true,
        market: true,
      },
    });
  }

  async update(id: string, data: UpdateAlertData) {
    return prisma.priceAlert.update({
      where: { id },
      data,
      include: {
        commodity: true,
        market: true,
      },
    });
  }

  async delete(id: string) {
    return prisma.priceAlert.delete({
      where: { id },
    });
  }

  async findActiveAlerts() {
    return prisma.priceAlert.findMany({
      where: { status: 'ACTIVE' },
      include: {
        commodity: true,
        market: true,
      },
    });
  }
}

export const alertRepository = new AlertRepository();
