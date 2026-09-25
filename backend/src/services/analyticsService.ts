import {
  calculateAverage,
  findHighestPrice,
  findLowestPrice,
  calculateTrend,
  calculatePercentageChange,
} from '../utils/priceCalculator';
import {
  HistoricalPriceRecord,
  PriceAnalyticsData,
  ComprehensivePriceAnalytics,
} from '../modules/prices/price.types';
import { sortRecordsByDate } from '../modules/prices/price.utils';
import { ApiError } from '../utils/ApiError';

export class AnalyticsService {
  /**
   * Generates comprehensive, transparent statistical insights from historical price records
   * No machine learning or black-box algorithms.
   */
  public static generatePriceAnalytics(
    records: HistoricalPriceRecord[]
  ): ComprehensivePriceAnalytics {
    if (!records || records.length === 0) {
      throw ApiError.badRequest('Cannot calculate analytics on empty price records');
    }

    // 1. Sort records chronologically ascending (oldest first, newest last)
    const sorted = sortRecordsByDate(records, 'asc');

    // 2. Identify chronological endpoints
    const firstRecord = sorted[0];
    const latestRecord = sorted[sorted.length - 1];

    const firstPrice = firstRecord.modalPrice;
    const latestPrice = latestRecord.modalPrice;

    // 3. Extract modal prices array
    const modalPrices = sorted.map((r) => r.modalPrice);

    // 4. Calculate statistics
    const averagePrice = calculateAverage(modalPrices);
    const { highestPrice, highestDate } = findHighestPrice(sorted);
    const { lowestPrice, lowestDate } = findLowestPrice(sorted);
    const trend = calculateTrend(firstPrice, latestPrice);
    const percentageChange = calculatePercentageChange(firstPrice, latestPrice);

    return {
      crop: firstRecord.crop,
      market: firstRecord.market,
      latestPrice,
      highestPrice,
      highestDate,
      lowestPrice,
      lowestDate,
      averagePrice,
      trend,
      percentageChange,
      totalRecords: sorted.length,
      firstDate: firstRecord.date,
      latestDate: latestRecord.date,
      firstPrice,
    };
  }

  /**
   * Returns simplified standard analytics payload:
   * {
   *   "latestPrice": 40,
   *   "highestPrice": 50,
   *   "lowestPrice": 25,
   *   "averagePrice": 35,
   *   "trend": "UP",
   *   "percentageChange": 12
   * }
   */
  public static getStandardAnalytics(records: HistoricalPriceRecord[]): PriceAnalyticsData {
    const full = this.generatePriceAnalytics(records);

    return {
      latestPrice: full.latestPrice,
      highestPrice: full.highestPrice,
      highestDate: full.highestDate,
      lowestPrice: full.lowestPrice,
      lowestDate: full.lowestDate,
      averagePrice: full.averagePrice,
      trend: full.trend,
      percentageChange: full.percentageChange,
    };
  }
}
