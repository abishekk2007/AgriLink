import { marketRepository } from '../repositories/market.repository.js';
import { commodityRepository } from '../repositories/commodity.repository.js';
import { locationRepository } from '../repositories/location.repository.js';
import { analyticsService } from './analytics.service.js';
import { insightService } from './insight.service.js';
import { MarketComparisonItem, Language } from '../types/index.js';
import { roundToDecimal } from '../utils/mathUtils.js';

export interface MarketQueryFilter {
  commodity: string;
  state?: string;
  district?: string;
  market?: string;
  startDate?: string;
  endDate?: string;
  days?: number;
  lang?: Language;
}

export interface MarketComparisonFilter {
  commodity: string;
  state?: string;
  district?: string;
  markets?: string; // comma-separated market names or IDs
  startDate?: string;
  endDate?: string;
  distanceKm?: number;
  transportRatePerKm?: number;
  quantityKg?: number;
}

export class MarketService {
  async getMarketPrices(filters: MarketQueryFilter) {
    // 1. Resolve Commodity
    const commodity = await commodityRepository.findByIdOrCode(filters.commodity);
    if (!commodity) {
      throw {
        status: 404,
        code: 'COMMODITY_NOT_FOUND',
        message: `Commodity '${filters.commodity}' was not found.`,
      };
    }

    // 2. Resolve Market if provided
    let market = null;
    if (filters.market) {
      market = await locationRepository.findMarketByIdOrName(filters.market);
    }

    // 3. Resolve Date Range
    let startDate: Date | undefined;
    let endDate: Date | undefined;

    if (filters.startDate) {
      startDate = new Date(filters.startDate);
    }
    if (filters.endDate) {
      endDate = new Date(filters.endDate);
    }

    if (!startDate && filters.days) {
      const d = new Date();
      d.setDate(d.getDate() - filters.days);
      startDate = d;
    }

    // Fetch records
    const rawRecords = await marketRepository.findPrices({
      commodityId: commodity.id,
      marketId: market?.id,
      startDate,
      endDate,
    });

    const records = rawRecords.map((r) => ({
      id: r.id,
      date: r.date.toISOString().split('T')[0],
      commodity: r.commodity.name,
      market: r.market.name,
      district: r.market.district.name,
      state: r.market.district.state.name,
      minPrice: r.minPrice,
      maxPrice: r.maxPrice,
      modalPrice: r.modalPrice,
      unit: r.unit,
      source: r.source.name,
    }));

    // Calculate analytics & stats
    const stats = analyticsService.calculateStats(records);
    const lang = filters.lang || 'en';

    let insight = null;
    if (stats) {
      insight = insightService.generateInsights(
        stats,
        lang,
        commodity.name,
        market?.name || 'Regional APMC'
      );
    }

    // Check MSP if applicable
    let msp = null;
    if (commodity.isMspCovered) {
      msp = await commodityRepository.findMSP(commodity.id);
    }

    return {
      commodity: {
        id: commodity.id,
        name: commodity.name,
        code: commodity.code,
        category: commodity.category,
        defaultUnit: commodity.defaultUnit,
        icon: commodity.icon,
        isMspCovered: commodity.isMspCovered,
      },
      market: market
        ? {
            id: market.id,
            name: market.name,
            code: market.code,
            district: market.district.name,
            state: market.district.state.name,
          }
        : null,
      stats,
      records,
      insight,
      msp: msp
        ? {
            price: msp.price,
            unit: msp.unit,
            season: msp.season,
            year: msp.year,
            source: msp.source,
          }
        : null,
      meta: {
        count: records.length,
        source: 'AGMARKNET / Open Government Data Platform India',
      },
    };
  }

  async getLatestPrice(commodityNameOrId: string, marketNameOrId?: string) {
    const commodity = await commodityRepository.findByIdOrCode(commodityNameOrId);
    if (!commodity) {
      throw {
        status: 404,
        code: 'COMMODITY_NOT_FOUND',
        message: `Commodity '${commodityNameOrId}' not found.`,
      };
    }

    let market = null;
    if (marketNameOrId) {
      market = await locationRepository.findMarketByIdOrName(marketNameOrId);
    }

    if (!market) {
      // Default to Koyambedu if not specified
      market = await locationRepository.findMarketByIdOrName('Koyambedu');
    }

    if (!market) {
      throw {
        status: 404,
        code: 'MARKET_NOT_FOUND',
        message: 'Market not found.',
      };
    }

    const latest = await marketRepository.findLatestPrice(commodity.id, market.id);

    return {
      commodity: commodity.name,
      market: market.name,
      date: latest ? latest.date.toISOString().split('T')[0] : null,
      modalPrice: latest?.modalPrice ?? null,
      minPrice: latest?.minPrice ?? null,
      maxPrice: latest?.maxPrice ?? null,
      unit: latest?.unit ?? commodity.defaultUnit,
      source: latest?.source.name ?? 'AGMARKNET',
    };
  }

  async compareMarkets(filters: MarketComparisonFilter) {
    const commodity = await commodityRepository.findByIdOrCode(filters.commodity);
    if (!commodity) {
      throw {
        status: 404,
        code: 'COMMODITY_NOT_FOUND',
        message: `Commodity '${filters.commodity}' not found.`,
      };
    }

    let marketsToCompare: any[] = [];

    if (filters.markets) {
      const namesOrIds = filters.markets.split(',').map((s) => s.trim());
      for (const item of namesOrIds) {
        const found = await locationRepository.findMarketByIdOrName(item);
        if (found) marketsToCompare.push(found);
      }
    } else if (filters.district) {
      marketsToCompare = await locationRepository.findMarketsByDistrict(filters.district);
    }

    // If still empty or fewer than 2, get regional markets
    if (marketsToCompare.length < 2) {
      const allMarkets = await locationRepository.findAllMarkets();
      marketsToCompare = allMarkets.slice(0, 5);
    }

    const marketIds = marketsToCompare.map((m) => m.id);
    const latestPrices = await marketRepository.findLatestPricesForMarkets(
      commodity.id,
      marketIds
    );

    const comparisonItems: MarketComparisonItem[] = [];

    for (const record of latestPrices) {
      // Get brief 14-day history to calculate price change
      const history = await marketRepository.findPrices({
        commodityId: commodity.id,
        marketId: record.marketId,
        limit: 14,
      });

      const firstModal = history.length > 0 ? history[0].modalPrice : record.modalPrice;
      const priceChange = roundToDecimal(
        firstModal > 0 ? ((record.modalPrice - firstModal) / firstModal) * 100 : 0
      );

      const allModals = history.map((h) => h.modalPrice);
      const avgPrice =
        allModals.length > 0
          ? roundToDecimal(allModals.reduce((a, b) => a + b, 0) / allModals.length)
          : record.modalPrice;

      // Transport estimation if provided
      let distanceKm: number | undefined;
      let estimatedTransportCost: number | undefined;
      let netRealization: number | undefined;

      if (filters.distanceKm !== undefined && filters.transportRatePerKm !== undefined) {
        distanceKm = filters.distanceKm;
        const transportCalc = analyticsService.calculateNetRealization({
          marketPrice: record.modalPrice,
          distanceKm: filters.distanceKm,
          transportRatePerKm: filters.transportRatePerKm,
          quantityKg: filters.quantityKg || 1000,
        });
        estimatedTransportCost = transportCalc.totalTransportCost;
        netRealization = transportCalc.netRealizationPerKg;
      }

      comparisonItems.push({
        marketId: record.marketId,
        marketName: record.market.name,
        districtName: record.market.district.name,
        stateName: record.market.district.state.name,
        latestPrice: record.modalPrice,
        minPrice: record.minPrice,
        maxPrice: record.maxPrice,
        avgPrice,
        priceChange,
        lastUpdated: record.date.toISOString().split('T')[0],
        distanceKm,
        estimatedTransportCost,
        netRealization,
      });
    }

    // Sort by latest price descending
    comparisonItems.sort((a, b) => b.latestPrice - a.latestPrice);

    const highestPrice = comparisonItems.length > 0 ? comparisonItems[0].latestPrice : 0;
    const lowestPrice =
      comparisonItems.length > 0
        ? comparisonItems[comparisonItems.length - 1].latestPrice
        : 0;
    const priceDifference = roundToDecimal(highestPrice - lowestPrice);

    return {
      commodity: {
        id: commodity.id,
        name: commodity.name,
        defaultUnit: commodity.defaultUnit,
      },
      comparison: comparisonItems,
      metrics: {
        highestPrice,
        lowestPrice,
        priceDifference,
        highestMarket: comparisonItems[0]?.marketName || null,
        lowestMarket: comparisonItems[comparisonItems.length - 1]?.marketName || null,
      },
      note: 'Neutral market comparison. Net realization incorporates estimated haulage cost.',
    };
  }

  async getDataSourceInfo() {
    return marketRepository.getDataSourceInfo();
  }
}

export const marketService = new MarketService();
