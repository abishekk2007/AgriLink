import { MarketPriceStats, MarketInsight, Language } from '../types/index.js';

export class InsightService {
  generateInsights(
    stats: MarketPriceStats,
    lang: Language = 'en',
    commodityName = 'Commodity',
    marketName = 'Market'
  ): MarketInsight {
    const insights: string[] = [];

    // 1. Average comparison rule
    if (stats.latestPrice > stats.avgPrice) {
      const diffPercent = ((stats.latestPrice - stats.avgPrice) / stats.avgPrice) * 100;
      if (lang === 'ta') {
        insights.push(
          `தற்போதைய விலை (₹${stats.latestPrice}) தேர்ந்தெடுக்கப்பட்ட கால சராசரியை (₹${stats.avgPrice}) விட ${diffPercent.toFixed(1)}% அதிகமாக வலுவாக உள்ளது.`
        );
      } else {
        insights.push(
          `The latest price (₹${stats.latestPrice}) is ${diffPercent.toFixed(1)}% above the historical period average (₹${stats.avgPrice}), indicating relatively strong market standing.`
        );
      }
    } else if (stats.latestPrice < stats.avgPrice) {
      const diffPercent = ((stats.avgPrice - stats.latestPrice) / stats.avgPrice) * 100;
      if (lang === 'ta') {
        insights.push(
          `தற்போதைய விலை (₹${stats.latestPrice}) தேர்ந்தெடுக்கப்பட்ட கால சராசரியை விட ${diffPercent.toFixed(1)}% குறைவாக உள்ளது.`
        );
      } else {
        insights.push(
          `The latest price (₹${stats.latestPrice}) is ${diffPercent.toFixed(1)}% below the historical period average (₹${stats.avgPrice}), indicating a relatively soft market.`
        );
      }
    } else {
      if (lang === 'ta') {
        insights.push(`தற்போதைய விலை வரலாற்று சராசரி விலைக்கு மிக நெருக்கமாக உள்ளது.`);
      } else {
        insights.push(`The latest price is strictly equal to the historical period average.`);
      }
    }

    // 2. Trend direction rule
    if (stats.trend === 'UP') {
      if (lang === 'ta') {
        insights.push(
          `விலை தேர்ந்தெடுக்கப்பட்ட காலத்தில் ${stats.percentageChange.toFixed(1)}% உயர்ந்துள்ளது. சமீபத்திய போக்கு மேல்நோக்கி உள்ளது.`
        );
      } else {
        insights.push(
          `Price increased by ${stats.percentageChange.toFixed(1)}% over the selected timeframe. The recent trend is upward.`
        );
      }
    } else if (stats.trend === 'DOWN') {
      if (lang === 'ta') {
        insights.push(
          `விலை தேர்ந்தெடுக்கப்பட்ட காலத்தில் ${Math.abs(stats.percentageChange).toFixed(1)}% குறைந்துள்ளது. சமீபத்திய போக்கு கீழ்நோக்கி உள்ளது.`
        );
      } else {
        insights.push(
          `Price decreased by ${Math.abs(stats.percentageChange).toFixed(1)}% over the selected timeframe. The recent trend is downward.`
        );
      }
    } else {
      if (lang === 'ta') {
        insights.push(`தேர்ந்தெடுக்கப்பட்ட காலத்தில் விலை கணிசமான மாற்றமின்றி நிலையாக உள்ளது.`);
      } else {
        insights.push(
          `Price has remained relatively stable (change: ${stats.percentageChange.toFixed(1)}%) across the period.`
        );
      }
    }

    // 3. Historical Price Position rule
    if (stats.pricePosition === 'UPPER_RANGE') {
      if (lang === 'ta') {
        insights.push(
          `தற்போதைய விலை வரலாற்று வரம்பில் மேல் பிரிவில் (மேல் 33%) உள்ளது.`
        );
      } else {
        insights.push(
          `Current price is in the Upper Price Range (${stats.percentile.toFixed(0)}th percentile) of recorded historical prices.`
        );
      }
    } else if (stats.pricePosition === 'LOWER_RANGE') {
      if (lang === 'ta') {
        insights.push(
          `தற்போதைய விலை வரலாற்று வரம்பில் கீழ் பிரிவில் உள்ளது. பிற அருகிலுள்ள சந்தைகளின் விலைகளை ஒப்பிடவும்.`
        );
      } else {
        insights.push(
          `Current price is in the Lower Price Range (${stats.percentile.toFixed(0)}th percentile). Consider evaluating alternate nearby APMCs.`
        );
      }
    } else {
      if (lang === 'ta') {
        insights.push(`தற்போதைய விலை நடுத்தர வரலாற்று விலைப் பிரிவில் உள்ளது.`);
      } else {
        insights.push(
          `Current price falls within the Middle Price Range (${stats.percentile.toFixed(0)}th percentile).`
        );
      }
    }

    // 4. Volatility rule
    if (stats.volatility === 'HIGH') {
      if (lang === 'ta') {
        insights.push(
          `இந்த சந்தையில் அதிக விலை ஏற்ற இறக்கம் காணப்படுகிறது (விலை மாறுபாடு: ${stats.volatilityScore}%). சரக்கு அனுப்புவதற்கு முன் தினசரி வரத்து அளவுகளை சரிபார்க்கவும்.`
        );
      } else {
        insights.push(
          `Significant price fluctuation observed (volatility: ${stats.volatilityScore}%). Consider comparing additional markets before dispatching high volume.`
        );
      }
    }

    const disclaimer =
      lang === 'ta'
        ? 'இந்த அவதானிப்புகள் வரலாற்று அரசு மண்டி பதிவுகளின் எளிய விதிகளின் அடிப்படையிலானவை. இது AI முன்கணிப்பு அல்லது உத்தரவாத லாபம் அல்ல.'
        : 'Rule-based analytical observations derived deterministically from historical government APMC records. Not an AI forecast or income guarantee.';

    return {
      trend: stats.trend,
      percentageChange: stats.percentageChange,
      pricePosition: stats.pricePosition,
      volatility: stats.volatility,
      insights,
      disclaimer,
    };
  }
}

export const insightService = new InsightService();
