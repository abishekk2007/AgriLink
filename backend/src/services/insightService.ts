import { PriceService } from '../modules/prices/price.service';
import { ComparisonService } from '../modules/comparison/comparison.service';
import { logger } from '../utils/logger';

export interface FarmerInsightsResult {
  crop: string;
  market: string;
  insights: string[];
  metrics: {
    latestPrice: number;
    averagePrice: number;
    highestPrice: number;
    trend: string;
    percentageChange: number;
    bestAlternativeMarket?: string;
    bestAlternativePrice?: number;
  };
}

export class InsightService {
  /**
   * Generates transparent, deterministic rule-based insights for farmers
   * Pure deterministic rule evaluation - NO ML / AI models.
   */
  public static async generateInsights(
    crop: string,
    market: string,
    state?: string
  ): Promise<FarmerInsightsResult> {
    logger.info(`Generating rule-based farmer insights for ${crop} at ${market}`);

    // 1. Fetch comprehensive price analytics
    const analytics = await PriceService.getComprehensiveAnalytics({
      crop,
      market,
      range: '30d',
      state,
    });

    // 2. Fetch multi-market comparison for contextual insight
    let comparisonSummary = null;
    try {
      const comparison = await ComparisonService.compareMarkets({ crop, state });
      comparisonSummary = comparison.summary;
    } catch {
      // Comparison is non-blocking for basic insights
    }

    const insights: string[] = [];
    const { latestPrice, averagePrice, highestPrice, lowestPrice, trend, percentageChange } = analytics;

    // Rule 1: Current Price vs Average
    if (latestPrice > averagePrice) {
      insights.push(
        `Current price (₹${latestPrice}/kg) is above the period average (₹${averagePrice}/kg). Favorable selling conditions.`
      );
    } else if (latestPrice < averagePrice) {
      insights.push(
        `Current price (₹${latestPrice}/kg) is below the period average (₹${averagePrice}/kg). Consider short-term storage if feasible.`
      );
    } else {
      insights.push('Current price is exactly aligned with the period average.');
    }

    // Rule 2: Price Trend Direction
    if (trend === 'UP') {
      insights.push(`Price is showing an increasing trend (+${percentageChange}%).`);
    } else if (trend === 'DOWN') {
      insights.push(`Price is showing a declining trend (${percentageChange}%). Market supply may be rising.`);
    } else {
      insights.push('Price has remained stable with minimal volatility.');
    }

    // Rule 3: Proximity to Historical Peak
    if (latestPrice >= highestPrice) {
      insights.push(
        `Current price is at the period peak of ₹${highestPrice}/kg. Recommended time to offload stock.`
      );
    } else if (latestPrice <= lowestPrice) {
      insights.push(
        `Current price is near the lowest recorded level (₹${lowestPrice}/kg). Caution advised against distress selling.`
      );
    }

    // Rule 4: Regional Market Arbitrage / Comparison
    let bestAlternativeMarket: string | undefined;
    let bestAlternativePrice: number | undefined;

    if (comparisonSummary) {
      const { highestMarket, highestPrice: topPrice } = comparisonSummary;

      if (highestMarket.toLowerCase() === market.toLowerCase()) {
        insights.push(`${market} currently has the highest modal price in the region (₹${topPrice}/kg).`);
      } else if (topPrice > latestPrice) {
        const spread = Math.round((topPrice - latestPrice) * 100) / 100;
        bestAlternativeMarket = highestMarket;
        bestAlternativePrice = topPrice;
        insights.push(
          `${highestMarket} has a higher modal price (₹${topPrice}/kg), offering ₹${spread}/kg more than ${market}.`
        );
      }
    }

    return {
      crop,
      market,
      insights,
      metrics: {
        latestPrice,
        averagePrice,
        highestPrice,
        trend,
        percentageChange,
        bestAlternativeMarket,
        bestAlternativePrice,
      },
    };
  }
}
