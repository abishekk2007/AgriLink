import {
  calculateAverage,
  calculateMin,
  calculateMax,
  calculatePercentageChange,
  calculateStdDev,
  calculatePercentileRank,
  calculateLinearSlope,
  roundToDecimal,
} from '../utils/mathUtils.js';
import {
  MarketPriceStats,
  TrendDirection,
  PricePositionTier,
  VolatilityLevel,
  TransportCalculationRequest,
  TransportCalculationResult,
} from '../types/index.js';

export class AnalyticsService {
  /**
   * Deterministic trend classification:
   * UP: percentage change >= +1.5%
   * DOWN: percentage change <= -1.5%
   * STABLE: between -1.5% and +1.5%
   */
  calculateTrend(percentageChange: number): TrendDirection {
    if (percentageChange >= 1.5) return 'UP';
    if (percentageChange <= -1.5) return 'DOWN';
    return 'STABLE';
  }

  /**
   * Price position based on percentile rank across observed series:
   * UPPER_RANGE: > 66.6%
   * MIDDLE_RANGE: 33.3% to 66.6%
   * LOWER_RANGE: < 33.3%
   */
  calculatePricePosition(percentile: number): PricePositionTier {
    if (percentile >= 66.6) return 'UPPER_RANGE';
    if (percentile <= 33.3) return 'LOWER_RANGE';
    return 'MIDDLE_RANGE';
  }

  /**
   * Deterministic volatility calculation using Coefficient of Variation (CV = (stdDev / avg) * 100)
   * LOW: CV < 8%
   * MEDIUM: CV 8% - 18%
   * HIGH: CV > 18%
   */
  calculateVolatility(modalPrices: number[]): { level: VolatilityLevel; score: number } {
    if (modalPrices.length < 2) {
      return { level: 'LOW', score: 0 };
    }
    const avg = calculateAverage(modalPrices);
    if (avg === 0) return { level: 'LOW', score: 0 };

    const stdDev = calculateStdDev(modalPrices);
    const cv = roundToDecimal((stdDev / avg) * 100);

    let level: VolatilityLevel = 'LOW';
    if (cv > 18) level = 'HIGH';
    else if (cv >= 8) level = 'MEDIUM';

    return { level, score: cv };
  }

  /**
   * Compute comprehensive deterministic summary statistics for a price series
   */
  calculateStats(records: Array<{ modalPrice: number; minPrice: number; maxPrice: number; date: Date | string }>): MarketPriceStats | null {
    if (records.length === 0) return null;

    const modalPrices = records.map((r) => r.modalPrice);
    const minPrices = records.map((r) => r.minPrice);
    const maxPrices = records.map((r) => r.maxPrice);

    const firstPrice = modalPrices[0];
    const latestPrice = modalPrices[modalPrices.length - 1];

    const overallMin = calculateMin(minPrices);
    const overallMax = calculateMax(maxPrices);
    const avgPrice = calculateAverage(modalPrices);
    const percentageChange = calculatePercentageChange(firstPrice, latestPrice);
    const trend = this.calculateTrend(percentageChange);

    const percentile = calculatePercentileRank(latestPrice, modalPrices);
    const pricePosition = this.calculatePricePosition(percentile);
    const volatilityInfo = this.calculateVolatility(modalPrices);

    const firstRecDate = records[0].date;
    const firstDate = firstRecDate instanceof Date
      ? firstRecDate.toISOString().split('T')[0]
      : String(firstRecDate).split('T')[0];

    const lastRecDate = records[records.length - 1].date;
    const latestDate = lastRecDate instanceof Date
      ? lastRecDate.toISOString().split('T')[0]
      : String(lastRecDate).split('T')[0];

    return {
      latestPrice,
      minPrice: overallMin,
      maxPrice: overallMax,
      avgPrice,
      modalPrice: latestPrice,
      unit: '₹/kg',
      percentageChange,
      trend,
      recordCount: records.length,
      firstDate,
      latestDate,
      pricePosition,
      percentile,
      volatility: volatilityInfo.level,
      volatilityScore: volatilityInfo.score,
    };
  }

  /**
   * Net Realization after estimated transport costs
   * Net Realization = Gross Market Value - Estimated Transport Cost
   */
  calculateNetRealization(input: TransportCalculationRequest): TransportCalculationResult {
    const { marketPrice, distanceKm, transportRatePerKm, quantityKg = 1000 } = input;

    const totalTransportCost = roundToDecimal(distanceKm * transportRatePerKm);
    const transportCostPerKg = quantityKg > 0 ? roundToDecimal(totalTransportCost / quantityKg, 3) : 0;

    const grossMarketValue = roundToDecimal(marketPrice * quantityKg);
    const netRealization = roundToDecimal(Math.max(0, grossMarketValue - totalTransportCost));
    const netRealizationPerKg = quantityKg > 0 ? roundToDecimal(netRealization / quantityKg, 2) : 0;

    return {
      marketPrice,
      distanceKm,
      transportRatePerKm,
      quantityKg,
      totalTransportCost,
      transportCostPerKg,
      grossMarketValue,
      netRealization,
      netRealizationPerKg,
      isEstimate: true,
      disclaimer:
        'This calculation is an estimate based on provided distance and rate. Actual transport tolls, loading fees, and shrinkage vary.',
    };
  }
}

export const analyticsService = new AnalyticsService();
