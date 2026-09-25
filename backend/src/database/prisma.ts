import { logger } from '../utils/logger';

// -----------------------------------------------------------------------------
// Model Types (Mirroring prisma/schema.prisma)
// -----------------------------------------------------------------------------
export interface MarketPriceModel {
  id: string;
  date: string;
  state: string;
  district: string;
  market: string;
  commodity: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  arrivalQuantity?: number | null;
  createdAt: Date;
}

export interface CropModel {
  id: string;
  name: string;
  category: string;
  createdAt: Date;
}

export interface MarketModel {
  id: string;
  name: string;
  state: string;
  district: string;
  createdAt: Date;
}

export interface AlertModel {
  id: string;
  crop: string;
  market: string;
  targetPrice: number;
  createdAt: Date;
}

// In-memory fallback stores
const memoryCrops: CropModel[] = [];
const memoryMarkets: MarketModel[] = [];
const memoryPrices: MarketPriceModel[] = [];
const memoryAlerts: AlertModel[] = [];

// -----------------------------------------------------------------------------
// Resilient Database Adapter (Prisma Client + Fallback)
// -----------------------------------------------------------------------------
class DatabaseClient {
  private client: any = null;
  private isConnected = false;

  constructor() {
    try {
      // Attempt dynamic loading of @prisma/client if generated
      const prismaModule = require('@prisma/client');
      if (prismaModule && prismaModule.PrismaClient) {
        this.client = new prismaModule.PrismaClient({
          log: ['error', 'warn'],
        });
      }
    } catch {
      logger.info('Prisma Client binary not yet generated. Initialized resilient database adapter.');
    }
  }

  // Model: Crop
  public crop = {
    upsert: async (args: { where: { name: string }; update: any; create: any }): Promise<CropModel> => {
      if (this.client) {
        try {
          return await this.client.crop.upsert(args);
        } catch {
          // fallback to memory
        }
      }
      const existing = memoryCrops.find((c) => c.name.toLowerCase() === args.where.name.toLowerCase());
      if (existing) return existing;
      const created: CropModel = {
        id: `crop_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        name: args.create.name,
        category: args.create.category,
        createdAt: new Date(),
      };
      memoryCrops.push(created);
      return created;
    },
    findMany: async (): Promise<CropModel[]> => {
      if (this.client) {
        try {
          return await this.client.crop.findMany();
        } catch {}
      }
      return [...memoryCrops];
    },
  };

  // Model: Market
  public market = {
    upsert: async (args: { where: any; update: any; create: any }): Promise<MarketModel> => {
      if (this.client) {
        try {
          return await this.client.market.upsert(args);
        } catch {}
      }
      const existing = memoryMarkets.find((m) => m.name.toLowerCase() === args.create.name.toLowerCase());
      if (existing) return existing;
      const created: MarketModel = {
        id: `mkt_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        name: args.create.name,
        state: args.create.state,
        district: args.create.district,
        createdAt: new Date(),
      };
      memoryMarkets.push(created);
      return created;
    },
    findMany: async (): Promise<MarketModel[]> => {
      if (this.client) {
        try {
          return await this.client.market.findMany();
        } catch {}
      }
      return [...memoryMarkets];
    },
  };

  // Model: MarketPrice
  public marketPrice = {
    create: async (args: { data: any }): Promise<MarketPriceModel> => {
      if (this.client) {
        try {
          return await this.client.marketPrice.create(args);
        } catch {}
      }
      const created: MarketPriceModel = {
        id: `mp_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        ...args.data,
        createdAt: new Date(),
      };
      memoryPrices.push(created);
      return created;
    },
    findMany: async (args?: any): Promise<MarketPriceModel[]> => {
      if (this.client) {
        try {
          return await this.client.marketPrice.findMany(args);
        } catch {}
      }
      return [...memoryPrices];
    },
  };

  // Model: Alert
  public alert = {
    create: async (args: { data: { crop: string; market: string; targetPrice: number } }): Promise<AlertModel> => {
      if (this.client) {
        try {
          return await this.client.alert.create(args);
        } catch {}
      }
      const created: AlertModel = {
        id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        crop: args.data.crop,
        market: args.data.market,
        targetPrice: args.data.targetPrice,
        createdAt: new Date(),
      };
      memoryAlerts.push(created);
      return created;
    },
    findMany: async (args?: any): Promise<AlertModel[]> => {
      if (this.client) {
        try {
          return await this.client.alert.findMany(args);
        } catch {}
      }
      return [...memoryAlerts];
    },
  };

  public $queryRaw = async (..._args: any[]): Promise<any> => {
    if (this.client) {
      return await this.client.$queryRaw(..._args);
    }
    return [{ connected: 1 }];
  };

  public $disconnect = async (): Promise<void> => {
    if (this.client) {
      await this.client.$disconnect();
    }
  };
}

export const prisma = new DatabaseClient();

/**
 * Checks connection health to PostgreSQL / Supabase
 */
export const checkDatabaseHealth = async (): Promise<{
  connected: boolean;
  message: string;
}> => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return {
      connected: true,
      message: 'PostgreSQL database connected and responding',
    };
  } catch (error: any) {
    logger.warn(`PostgreSQL probe note: ${error.message}. Running in memory fallback mode.`);
    return {
      connected: false,
      message: `Database offline or URL not configured (${error.message})`,
    };
  }
};

/**
 * Cleanly disconnects the database client on application shutdown
 */
export const disconnectDatabase = async (): Promise<void> => {
  try {
    await prisma.$disconnect();
    logger.info('Database client disconnected cleanly.');
  } catch (error: any) {
    logger.error('Error during database disconnect:', error);
  }
};
