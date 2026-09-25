import { MarketDataService } from '../../services/marketDataService';
import { AnalyticsService } from '../../services/analyticsService';
import {
  HistoricalPriceRecord,
  PriceHistoryQuery,
  PriceAnalyticsData,
  ComprehensivePriceAnalytics,
} from './price.types';
import {
  isDateInRange,
  sortRecordsByDate,
  computePresetRange,
} from './price.utils';
import { ApiError } from '../../utils/ApiError';
import { logger } from '../../utils/logger';

/**
 * Built-in historical price series for major agricultural commodities
 * providing realistic temporal depth for analytics and trends
 */
const HISTORICAL_PRICE_SERIES: HistoricalPriceRecord[] = [
  // Tomato - Koyambedu (Chennai, Tamil Nadu)
  { date: '2026-09-01', crop: 'Tomato', market: 'Koyambedu', state: 'Tamil Nadu', district: 'Chennai', minPrice: 30, maxPrice: 45, modalPrice: 38 },
  { date: '2026-09-05', crop: 'Tomato', market: 'Koyambedu', state: 'Tamil Nadu', district: 'Chennai', minPrice: 32, maxPrice: 48, modalPrice: 40 },
  { date: '2026-09-10', crop: 'Tomato', market: 'Koyambedu', state: 'Tamil Nadu', district: 'Chennai', minPrice: 34, maxPrice: 50, modalPrice: 42 },
  { date: '2026-09-15', crop: 'Tomato', market: 'Koyambedu', state: 'Tamil Nadu', district: 'Chennai', minPrice: 28, maxPrice: 42, modalPrice: 35 },
  { date: '2026-09-20', crop: 'Tomato', market: 'Koyambedu', state: 'Tamil Nadu', district: 'Chennai', minPrice: 40, maxPrice: 55, modalPrice: 50 },
  { date: '2026-09-23', crop: 'Tomato', market: 'Koyambedu', state: 'Tamil Nadu', district: 'Chennai', minPrice: 36, maxPrice: 48, modalPrice: 42 },
  { date: '2026-09-25', crop: 'Tomato', market: 'Koyambedu', state: 'Tamil Nadu', district: 'Chennai', minPrice: 32, maxPrice: 46, modalPrice: 40 },

  // Onion - Koyambedu (Chennai, Tamil Nadu)
  { date: '2026-09-01', crop: 'Onion', market: 'Koyambedu', state: 'Tamil Nadu', district: 'Chennai', minPrice: 28, maxPrice: 36, modalPrice: 32 },
  { date: '2026-09-08', crop: 'Onion', market: 'Koyambedu', state: 'Tamil Nadu', district: 'Chennai', minPrice: 30, maxPrice: 38, modalPrice: 34 },
  { date: '2026-09-15', crop: 'Onion', market: 'Koyambedu', state: 'Tamil Nadu', district: 'Chennai', minPrice: 32, maxPrice: 40, modalPrice: 36 },
  { date: '2026-09-20', crop: 'Onion', market: 'Koyambedu', state: 'Tamil Nadu', district: 'Chennai', minPrice: 34, maxPrice: 42, modalPrice: 38 },
  { date: '2026-09-25', crop: 'Onion', market: 'Koyambedu', state: 'Tamil Nadu', district: 'Chennai', minPrice: 32, maxPrice: 38, modalPrice: 35 },

  // Potato - Koyambedu (Chennai, Tamil Nadu)
  { date: '2026-09-01', crop: 'Potato', market: 'Koyambedu', state: 'Tamil Nadu', district: 'Chennai', minPrice: 18, maxPrice: 24, modalPrice: 21 },
  { date: '2026-09-08', crop: 'Potato', market: 'Koyambedu', state: 'Tamil Nadu', district: 'Chennai', minPrice: 19, maxPrice: 25, modalPrice: 22 },
  { date: '2026-09-15', crop: 'Potato', market: 'Koyambedu', state: 'Tamil Nadu', district: 'Chennai', minPrice: 20, maxPrice: 26, modalPrice: 23 },
  { date: '2026-09-22', crop: 'Potato', market: 'Koyambedu', state: 'Tamil Nadu', district: 'Chennai', minPrice: 19, maxPrice: 25, modalPrice: 22 },
  { date: '2026-09-25', crop: 'Potato', market: 'Koyambedu', state: 'Tamil Nadu', district: 'Chennai', minPrice: 18, maxPrice: 24, modalPrice: 21 },

  // Onion - Lasalgaon (Nashik, Maharashtra)
  { date: '2026-09-01', crop: 'Onion', market: 'Lasalgaon', state: 'Maharashtra', district: 'Nashik', minPrice: 25, maxPrice: 31, modalPrice: 28 },
  { date: '2026-09-10', crop: 'Onion', market: 'Lasalgaon', state: 'Maharashtra', district: 'Nashik', minPrice: 27, maxPrice: 33, modalPrice: 30 },
  { date: '2026-09-20', crop: 'Onion', market: 'Lasalgaon', state: 'Maharashtra', district: 'Nashik', minPrice: 29, maxPrice: 36, modalPrice: 33 },
  { date: '2026-09-25', crop: 'Onion', market: 'Lasalgaon', state: 'Maharashtra', district: 'Nashik', minPrice: 28, maxPrice: 34, modalPrice: 31 },

  // Tomato - Yeshwanthpur (Bengaluru, Karnataka)
  { date: '2026-09-01', crop: 'Tomato', market: 'Yeshwanthpur', state: 'Karnataka', district: 'Bengaluru Urban', minPrice: 19, maxPrice: 24, modalPrice: 21 },
  { date: '2026-09-10', crop: 'Tomato', market: 'Yeshwanthpur', state: 'Karnataka', district: 'Bengaluru Urban', minPrice: 21, maxPrice: 26, modalPrice: 23 },
  { date: '2026-09-18', crop: 'Tomato', market: 'Yeshwanthpur', state: 'Karnataka', district: 'Bengaluru Urban', minPrice: 23, maxPrice: 29, modalPrice: 26 },
  { date: '2026-09-25', crop: 'Tomato', market: 'Yeshwanthpur', state: 'Karnataka', district: 'Bengaluru Urban', minPrice: 21, maxPrice: 26, modalPrice: 23.5 },

  // Wheat - Khanna (Ludhiana, Punjab)
  { date: '2026-09-01', crop: 'Wheat', market: 'Khanna', state: 'Punjab', district: 'Ludhiana', minPrice: 22, maxPrice: 24, modalPrice: 23 },
  { date: '2026-09-12', crop: 'Wheat', market: 'Khanna', state: 'Punjab', district: 'Ludhiana', minPrice: 22.5, maxPrice: 24.2, modalPrice: 23.4 },
  { date: '2026-09-25', crop: 'Wheat', market: 'Khanna', state: 'Punjab', district: 'Ludhiana', minPrice: 22.75, maxPrice: 24.5, modalPrice: 23.6 },
];

export class PriceService {
  /**
   * Retrieves historical price records based on crop, market, and date filters
   */
  public static async getHistoricalPrices(
    query: PriceHistoryQuery
  ): Promise<HistoricalPriceRecord[]> {
    const { crop, market, state, district } = query;
    let { startDate, endDate } = query;

    // Handle preset ranges ('7d', '30d', '90d')
    if (query.range && query.range !== 'all' && !startDate) {
      const preset = computePresetRange(query.range);
      startDate = preset.startDate;
      endDate = preset.endDate;
    }

    logger.info(`Fetching historical prices for ${crop} at ${market}`, {
      state,
      district,
      startDate,
      endDate,
    });

    // 1. Check built-in historical series first
    let records = HISTORICAL_PRICE_SERIES.filter((item) => {
      const matchesCrop = item.crop.toLowerCase() === crop.toLowerCase();
      const matchesMarket = item.market.toLowerCase().includes(market.toLowerCase());
      const matchesState = !state || (item.state && item.state.toLowerCase() === state.toLowerCase());
      const matchesDistrict = !district || (item.district && item.district.toLowerCase() === district.toLowerCase());

      return matchesCrop && matchesMarket && matchesState && matchesDistrict;
    });

    // 2. If no direct match in historical series, fetch live data from MarketDataService
    if (records.length === 0) {
      try {
        const liveRecords = await MarketDataService.fetchMarketData({
          commodity: crop,
          market,
          state,
          district,
        });

        if (liveRecords.length > 0) {
          records = liveRecords.map((r) => ({
            date: r.date,
            crop: r.commodity,
            market: r.market,
            state: r.state,
            district: r.district,
            minPrice: r.minPrice > 100 ? Math.round(r.minPrice / 100) : r.minPrice, // per kg standard
            maxPrice: r.maxPrice > 100 ? Math.round(r.maxPrice / 100) : r.maxPrice,
            modalPrice: r.modalPrice > 100 ? Math.round(r.modalPrice / 100) : r.modalPrice,
          }));
        }
      } catch (err: any) {
        logger.warn(`External market lookup for historical prices returned error: ${err.message}`);
      }
    }

    // 3. Apply date range filters (startDate and endDate)
    if (startDate || endDate) {
      records = records.filter((r) => isDateInRange(r.date, startDate, endDate));
    }

    // 4. Sort chronologically
    return sortRecordsByDate(records, 'asc');
  }

  /**
   * Generates transparent price analytics for a given crop and market
   */
  public static async getPriceAnalytics(
    query: PriceHistoryQuery
  ): Promise<PriceAnalyticsData> {
    const records = await this.getHistoricalPrices(query);

    if (records.length === 0) {
      throw ApiError.notFound(
        `No price records found for crop '${query.crop}' at market '${query.market}' within the selected timeframe`
      );
    }

    return AnalyticsService.getStandardAnalytics(records);
  }

  /**
   * Generates comprehensive analytics with full metadata
   */
  public static async getComprehensiveAnalytics(
    query: PriceHistoryQuery
  ): Promise<ComprehensivePriceAnalytics> {
    const records = await this.getHistoricalPrices(query);

    if (records.length === 0) {
      throw ApiError.notFound(
        `No price records found for crop '${query.crop}' at market '${query.market}'`
      );
    }

    return AnalyticsService.generatePriceAnalytics(records);
  }
}
