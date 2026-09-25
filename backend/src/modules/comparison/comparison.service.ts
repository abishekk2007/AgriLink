import { MarketDataService } from '../../services/marketDataService';
import {
  MarketComparisonItem,
  MarketComparisonQuery,
  MarketComparisonResult,
  MarketComparisonSummary,
} from './comparison.types';
import { calculateAverage } from '../../utils/priceCalculator';
import { ApiError } from '../../utils/ApiError';
import { logger } from '../../utils/logger';

/**
 * Built-in multi-market cross-regional benchmark dataset
 */
const MULTI_MARKET_BENCHMARKS: Record<string, MarketComparisonItem[]> = {
  tomato: [
    { market: 'Koyambedu', modalPrice: 40, minPrice: 32, maxPrice: 46, state: 'Tamil Nadu', district: 'Chennai' },
    { market: 'Madurai', modalPrice: 36, minPrice: 30, maxPrice: 42, state: 'Tamil Nadu', district: 'Madurai' },
    { market: 'Coimbatore', modalPrice: 38, minPrice: 32, maxPrice: 44, state: 'Tamil Nadu', district: 'Coimbatore' },
    { market: 'Yeshwanthpur', modalPrice: 34, minPrice: 28, maxPrice: 39, state: 'Karnataka', district: 'Bengaluru' },
    { market: 'Kolar', modalPrice: 32, minPrice: 26, maxPrice: 36, state: 'Karnataka', district: 'Kolar' },
    { market: 'Vashi', modalPrice: 42, minPrice: 35, maxPrice: 48, state: 'Maharashtra', district: 'Mumbai' },
  ],
  onion: [
    { market: 'Lasalgaon', modalPrice: 31, minPrice: 28, maxPrice: 34, state: 'Maharashtra', district: 'Nashik' },
    { market: 'Koyambedu', modalPrice: 35, minPrice: 32, maxPrice: 38, state: 'Tamil Nadu', district: 'Chennai' },
    { market: 'Yeshwanthpur', modalPrice: 33, minPrice: 30, maxPrice: 36, state: 'Karnataka', district: 'Bengaluru' },
    { market: 'Azadpur', modalPrice: 36, minPrice: 32, maxPrice: 40, state: 'Delhi', district: 'Delhi' },
    { market: 'Pune', modalPrice: 30, minPrice: 27, maxPrice: 33, state: 'Maharashtra', district: 'Pune' },
  ],
  potato: [
    { market: 'Koyambedu', modalPrice: 21, minPrice: 18, maxPrice: 24, state: 'Tamil Nadu', district: 'Chennai' },
    { market: 'Agra', modalPrice: 16, minPrice: 14, maxPrice: 19, state: 'Uttar Pradesh', district: 'Agra' },
    { market: 'Azadpur', modalPrice: 20, minPrice: 17, maxPrice: 23, state: 'Delhi', district: 'Delhi' },
    { market: 'Hassan', modalPrice: 22, minPrice: 19, maxPrice: 25, state: 'Karnataka', district: 'Hassan' },
  ],
  wheat: [
    { market: 'Khanna', modalPrice: 23.6, minPrice: 22.75, maxPrice: 24.5, state: 'Punjab', district: 'Ludhiana' },
    { market: 'Karnal', modalPrice: 23.2, minPrice: 22.5, maxPrice: 24.0, state: 'Haryana', district: 'Karnal' },
    { market: 'Kota', modalPrice: 24.1, minPrice: 23.0, maxPrice: 25.0, state: 'Rajasthan', district: 'Kota' },
    { market: 'Indore', modalPrice: 24.5, minPrice: 23.5, maxPrice: 25.5, state: 'Madhya Pradesh', district: 'Indore' },
  ],
  rice: [
    { market: 'Sahibabad', modalPrice: 38, minPrice: 34, maxPrice: 42, state: 'Uttar Pradesh', district: 'Ghaziabad' },
    { market: 'Karnal', modalPrice: 41, minPrice: 36, maxPrice: 45, state: 'Haryana', district: 'Karnal' },
    { market: 'Burdwan', modalPrice: 34, minPrice: 30, maxPrice: 37, state: 'West Bengal', district: 'Purba Bardhaman' },
  ],
};

export class ComparisonService {
  /**
   * Compares market prices for a given crop across selected or all available markets
   */
  public static async compareMarkets(
    query: MarketComparisonQuery
  ): Promise<MarketComparisonResult> {
    const cropKey = query.crop.trim().toLowerCase();
    const targetDate = query.date || new Date().toISOString().split('T')[0];

    logger.info(`Comparing markets for ${query.crop} on date ${targetDate}`, {
      markets: query.markets,
      state: query.state,
    });

    let items: MarketComparisonItem[] = [];

    // 1. Fetch benchmark items for this crop
    if (MULTI_MARKET_BENCHMARKS[cropKey]) {
      items = [...MULTI_MARKET_BENCHMARKS[cropKey]];
    } else {
      // Fetch live market data via MarketDataService
      try {
        const liveData = await MarketDataService.fetchMarketData({
          commodity: query.crop,
          state: query.state,
        });

        items = liveData.map((d) => ({
          market: d.market,
          modalPrice: d.modalPrice > 100 ? Math.round(d.modalPrice / 100) : d.modalPrice,
          minPrice: d.minPrice > 100 ? Math.round(d.minPrice / 100) : d.minPrice,
          maxPrice: d.maxPrice > 100 ? Math.round(d.maxPrice / 100) : d.maxPrice,
          state: d.state,
          district: d.district,
        }));
      } catch (err: any) {
        logger.warn(`Live market fetch for comparison failed: ${err.message}`);
      }
    }

    // 2. Filter by specified markets if provided
    if (query.markets && query.markets.length > 0) {
      const selectedMarketsLower = query.markets.map((m) => m.trim().toLowerCase());
      items = items.filter((item) =>
        selectedMarketsLower.some((target) => item.market.toLowerCase().includes(target))
      );
    }

    // 3. Filter by state if specified
    if (query.state) {
      const stateLower = query.state.trim().toLowerCase();
      items = items.filter((item) => item.state && item.state.toLowerCase() === stateLower);
    }

    if (items.length === 0) {
      throw ApiError.notFound(
        `No market price records found for crop '${query.crop}' matching the comparison criteria`
      );
    }

    // 4. Sort markets by modalPrice descending (highest paying market first)
    items.sort((a, b) => b.modalPrice - a.modalPrice);

    // 5. Calculate summary statistics
    const prices = items.map((i) => i.modalPrice);
    const highestItem = items[0];
    const lowestItem = items[items.length - 1];
    const averagePrice = calculateAverage(prices);
    const priceSpread = Math.round((highestItem.modalPrice - lowestItem.modalPrice) * 100) / 100;

    const summary: MarketComparisonSummary = {
      crop: query.crop,
      date: targetDate,
      totalMarkets: items.length,
      highestMarket: highestItem.market,
      highestPrice: highestItem.modalPrice,
      lowestMarket: lowestItem.market,
      lowestPrice: lowestItem.modalPrice,
      priceSpread,
      averagePrice,
    };

    return {
      data: items,
      summary,
    };
  }
}
