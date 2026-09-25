import {
  MarketFilterParams,
  MarketRecord,
  PriceStatistics,
  MarketComparisonItem,
  MarketInsight,
  MarketDataResult,
  Language,
} from '../types/market';
import {
  MOCK_MARKET_RECORDS,
  GEOGRAPHY,
  COMMODITIES,
} from '../data/mockMarketData';
import {
  translateCommodity,
  translateMarket,
  translateDistrict,
  formatLocalizedDisplayDate,
  formatLocalizedShortDate,
} from '../utils/translations';

export { formatLocalizedDisplayDate as formatDisplayDate };
export { formatLocalizedShortDate as formatShortDate };

/**
 * Computes price statistics dynamically from filtered records
 */
function calculateStatistics(records: MarketRecord[]): PriceStatistics | null {
  if (!records || records.length === 0) return null;

  // Records are assumed sorted by date ascending
  const firstRecord = records[0];
  const latestRecord = records[records.length - 1];

  const firstPrice = firstRecord.modalPrice;
  const latestPrice = latestRecord.modalPrice;

  let minPrice = records[0].modalPrice;
  let maxPrice = records[0].modalPrice;
  let lowestDate = records[0].date;
  let peakDate = records[0].date;
  let sum = 0;

  for (const r of records) {
    sum += r.modalPrice;
    if (r.modalPrice < minPrice) {
      minPrice = r.modalPrice;
      lowestDate = r.date;
    }
    if (r.modalPrice > maxPrice) {
      maxPrice = r.modalPrice;
      peakDate = r.date;
    }
  }

  const avgPrice = Math.round((sum / records.length) * 10) / 10;
  const priceChangeAmount = latestPrice - firstPrice;
  const priceChangePercent =
    firstPrice !== 0
      ? Math.round(((latestPrice - firstPrice) / firstPrice) * 1000) / 10
      : 0;

  let trendDirection: 'up' | 'down' | 'stable' = 'stable';
  if (priceChangePercent > 1.5) {
    trendDirection = 'up';
  } else if (priceChangePercent < -1.5) {
    trendDirection = 'down';
  }

  // Position between min and max (0 to 100)
  let pricePositionPercent = 50;
  if (maxPrice > minPrice) {
    pricePositionPercent = Math.min(
      100,
      Math.max(0, Math.round(((latestPrice - minPrice) / (maxPrice - minPrice)) * 100))
    );
  }

  return {
    latestPrice,
    minPrice,
    maxPrice,
    avgPrice,
    recordCount: records.length,
    firstPrice,
    priceChangeAmount,
    priceChangePercent,
    trendDirection,
    peakDate,
    lowestDate,
    pricePositionPercent,
  };
}

/**
 * Computes market comparison across APMCs in the same district/region
 */
function calculateComparison(
  filters: MarketFilterParams,
  selectedLatestPrice: number
): MarketComparisonItem[] {
  const districtMarkets =
    GEOGRAPHY[filters.state]?.[filters.district] || [filters.market];

  const comparisonItems: MarketComparisonItem[] = [];

  for (const mkt of districtMarkets) {
    const mktRecords = MOCK_MARKET_RECORDS.filter(
      (r) =>
        r.state === filters.state &&
        r.district === filters.district &&
        r.market === mkt &&
        r.commodity === filters.commodity &&
        r.date >= filters.startDate &&
        r.date <= filters.endDate
    ).sort((a, b) => a.date.localeCompare(b.date));

    if (mktRecords.length > 0) {
      const latest = mktRecords[mktRecords.length - 1].modalPrice;
      const sum = mktRecords.reduce((acc, curr) => acc + curr.modalPrice, 0);
      const avg = Math.round((sum / mktRecords.length) * 10) / 10;
      const min = Math.min(...mktRecords.map((r) => r.modalPrice));
      const max = Math.max(...mktRecords.map((r) => r.modalPrice));

      comparisonItems.push({
        marketName: mkt,
        latestPrice: latest,
        avgPrice: avg,
        minPrice: min,
        maxPrice: max,
        diffFromSelected: latest - selectedLatestPrice,
        isSelected: mkt === filters.market,
        recordCount: mktRecords.length,
      });
    }
  }

  return comparisonItems;
}

/**
 * Rule-based dynamic text generation purely based on mathematical properties of the data,
 * with bilingual support for English and Tamil.
 */
function generateRuleBasedInsights(
  stats: PriceStatistics,
  comparison: MarketComparisonItem[],
  filters: MarketFilterParams,
  lang: Language = 'en'
): MarketInsight {
  const {
    latestPrice,
    firstPrice,
    priceChangePercent,
    trendDirection,
    peakDate,
    maxPrice,
    minPrice,
    pricePositionPercent,
  } = stats;

  const cropName = translateCommodity(filters.commodity, lang);
  const marketName = translateMarket(filters.market, lang);
  const districtName = translateDistrict(filters.district, lang);
  const unit = lang === 'ta' ? 'கிலோ' : 'kg';
  const peakDateFormatted = formatLocalizedDisplayDate(peakDate, lang);
  const spread = maxPrice - minPrice;

  if (lang === 'ta') {
    // Tamil Rule-Based Insights
    let headline = '';
    if (trendDirection === 'up') {
      headline = `${cropName} பயிருக்கான விலை அதிகரிப்பு போக்கு காணப்படுகிறது`;
    } else if (trendDirection === 'down') {
      headline = `${cropName} பயிருக்கான விலை சரிவு போக்கு காணப்படுகிறது`;
    } else {
      headline = `${cropName} பயிருக்கான நிலையான விலை போக்கு காணப்படுகிறது`;
    }

    let trendInsight = '';
    if (trendDirection === 'up') {
      trendInsight = `அண்மைய வழக்கமான விலை ₹${latestPrice}/${unit} என்பது, இந்த ${stats.recordCount} நாள் காலகட்டத்தின் முதல் பதிவு விலையை (₹${firstPrice}/${unit}) விட ${Math.abs(priceChangePercent)}% அதிகமாக உள்ளது.`;
    } else if (trendDirection === 'down') {
      trendInsight = `அண்மைய வழக்கமான விலை ₹${latestPrice}/${unit} என்பது, இந்த ${stats.recordCount} நாள் காலகட்டத்தின் ஆரம்ப பதிவு விலையை (₹${firstPrice}/${unit}) விட ${Math.abs(priceChangePercent)}% குறைவாக உள்ளது.`;
    } else {
      trendInsight = `தேர்ந்தெடுக்கப்பட்ட காலகட்டத்தில் வழக்கமான விலைகள் ஆரம்ப விலையான ₹${firstPrice}/${unit} இலிருந்து ±1.5% வரம்பிற்குள் ஒப்பீட்டளவில் நிலையாக இருந்துள்ளன.`;
    }

    const peakInsight = `${marketName} சந்தையில் ${peakDateFormatted} அன்று அதிகபட்ச மாதிரி விலையான ₹${maxPrice}/${unit} பதிவானது. குறைந்தபட்ச பதிவு விலை ₹${minPrice}/${unit} ஆகும்.`;

    let comparisonInsight = '';
    const otherMarkets = comparison.filter((c) => !c.isSelected);
    if (otherMarkets.length > 0) {
      const higherCount = otherMarkets.filter((c) => c.diffFromSelected < 0).length;
      const lowerCount = otherMarkets.filter((c) => c.diffFromSelected > 0).length;

      if (higherCount === otherMarkets.length) {
        comparisonInsight = `${marketName} சந்தை தற்போது ${districtName} மாவட்டத்தில் உள்ள மற்ற மண்டிகளை விட அதிக மாதிரி விலையை (₹${latestPrice}/${unit}) பதிவு செய்துள்ளது.`;
      } else if (lowerCount === otherMarkets.length) {
        comparisonInsight = `${marketName} சந்தை தற்போது ${districtName} மாவட்டத்தில் உள்ள பிற அருகிலுள்ள மண்டிகளை விட குறைந்த மாதிரி விலையை (₹${latestPrice}/${unit}) பதிவு செய்துள்ளது.`;
      } else {
        const nearest = otherMarkets[0];
        const nearestName = translateMarket(nearest.marketName, lang);
        const diffWord = nearest.diffFromSelected > 0 ? 'குறைவாக' : 'அதிகமாக';
        const absDiff = Math.abs(nearest.diffFromSelected);
        comparisonInsight = `${marketName} (₹${latestPrice}/${unit}) சந்தை ${nearestName} (₹${nearest.latestPrice}/${unit}) உடன் ஒப்பிடுகையில் ₹${absDiff}/${unit} ${diffWord} உள்ளது.`;
      }
    } else {
      comparisonInsight = `இந்த பயிருக்கு ${districtName} மாவட்டத்தில் வேறு பிராந்திய ஒப்பீட்டு மண்டிகள் பதிவு செய்யப்படவில்லை.`;
    }

    const spreadInsight = `குறைந்தபட்ச (₹${minPrice}/${unit}) மற்றும் அதிகபட்ச (₹${maxPrice}/${unit}) விலைகளுக்கு இடையிலான வரலாற்று விலை இடைவெளி ${stats.recordCount} பதிவு நாட்களில் ₹${spread}/${unit} ஆகும்.`;

    let positionInsight = '';
    if (pricePositionPercent >= 70) {
      positionInsight = `தற்போதைய விலை தேர்ந்தெடுக்கப்பட்ட வரலாற்று காலகட்டத்தில் ஒப்பீட்டளவில் அதிக விலை வரம்பில் உள்ளது (${pricePositionPercent}% வரம்பு).`;
    } else if (pricePositionPercent <= 30) {
      positionInsight = `தற்போதைய விலை தேர்ந்தெடுக்கப்பட்ட வரலாற்று காலகட்டத்தில் ஒப்பீட்டளவில் குறைந்த விலை வரம்பில் உள்ளது (${pricePositionPercent}% வரம்பு).`;
    } else {
      positionInsight = `தற்போதைய விலை நடுத்தர வரலாற்று விலை வரம்பில் அமைந்துள்ளது (${pricePositionPercent}% வரம்பு).`;
    }

    return {
      headline,
      trendInsight,
      peakInsight,
      comparisonInsight,
      spreadInsight,
      positionInsight,
    };
  }

  // English Rule-Based Insights
  let trendInsight = '';
  if (trendDirection === 'up') {
    trendInsight = `The latest typical price of ₹${latestPrice}/kg is ${Math.abs(
      priceChangePercent
    )}% higher than the first recorded price (₹${firstPrice}/kg) in this ${stats.recordCount}-day period.`;
  } else if (trendDirection === 'down') {
    trendInsight = `The latest typical price of ₹${latestPrice}/kg is ${Math.abs(
      priceChangePercent
    )}% lower than the initial recorded price (₹${firstPrice}/kg) in this ${stats.recordCount}-day period.`;
  } else {
    trendInsight = `Typical prices have remained relatively stable across the selected period, fluctuating within ±1.5% from the starting level of ₹${firstPrice}/kg.`;
  }

  const peakInsight = `${filters.market} recorded its peak modal price of ₹${maxPrice}/kg on ${peakDateFormatted}. Lowest recorded price was ₹${minPrice}/kg.`;

  let comparisonInsight = '';
  const otherMarkets = comparison.filter((c) => !c.isSelected);
  if (otherMarkets.length > 0) {
    const higherCount = otherMarkets.filter((c) => c.diffFromSelected < 0).length;
    const lowerCount = otherMarkets.filter((c) => c.diffFromSelected > 0).length;

    if (higherCount === otherMarkets.length) {
      comparisonInsight = `${filters.market} currently records a higher typical price (₹${latestPrice}/kg) than all other displayed markets in ${filters.district}.`;
    } else if (lowerCount === otherMarkets.length) {
      comparisonInsight = `${filters.market} currently records a lower typical price (₹${latestPrice}/kg) compared to neighbouring markets in ${filters.district}.`;
    } else {
      const nearest = otherMarkets[0];
      const diffWord = nearest.diffFromSelected > 0 ? 'lower' : 'higher';
      const absDiff = Math.abs(nearest.diffFromSelected);
      comparisonInsight = `${filters.market} (₹${latestPrice}/kg) is ₹${absDiff}/kg ${diffWord} than ${nearest.marketName} (₹${nearest.latestPrice}/kg).`;
    }
  } else {
    comparisonInsight = `No other regional comparison markets are registered under ${filters.district} for this commodity.`;
  }

  const spreadInsight = `Historical price spread between the minimum (₹${minPrice}/kg) and maximum (₹${maxPrice}/kg) spans ₹${spread}/kg across ${stats.recordCount} recorded dates.`;

  let positionInsight = '';
  if (pricePositionPercent >= 70) {
    positionInsight = `Current price is relatively high within the selected historical period (${pricePositionPercent}% of range).`;
  } else if (pricePositionPercent <= 30) {
    positionInsight = `Current price is relatively low within the selected historical period (${pricePositionPercent}% of range).`;
  } else {
    positionInsight = `Current price is situated within the moderate historical price band (${pricePositionPercent}% of range).`;
  }

  const headline =
    trendDirection === 'up'
      ? `Upward price movement observed for ${filters.commodity}`
      : trendDirection === 'down'
      ? `Downward price movement observed for ${filters.commodity}`
      : `Stable price pattern observed for ${filters.commodity}`;

  return {
    headline,
    trendInsight,
    peakInsight,
    comparisonInsight,
    spreadInsight,
    positionInsight,
  };
}

/**
 * Service Abstraction for Market Data.
 * Currently reads from verified local mock dataset.
 * In a future phase, this function will call the AgriLink Backend API.
 */
export async function getMarketData(
  filters: MarketFilterParams,
  lang: Language = 'en'
): Promise<MarketDataResult> {
  // Simulate realistic network delay (e.g. 300ms) for realistic UX and loading demonstration
  await new Promise((resolve) => setTimeout(resolve, 320));

  // Filter records matching the query parameters
  const filteredRecords = MOCK_MARKET_RECORDS.filter((item) => {
    const matchCommodity =
      !filters.commodity || item.commodity.toLowerCase() === filters.commodity.toLowerCase();
    const matchState = !filters.state || item.state === filters.state;
    const matchDistrict = !filters.district || item.district === filters.district;
    const matchMarket = !filters.market || item.market === filters.market;
    const matchStart = !filters.startDate || item.date >= filters.startDate;
    const matchEnd = !filters.endDate || item.date <= filters.endDate;

    return (
      matchCommodity &&
      matchState &&
      matchDistrict &&
      matchMarket &&
      matchStart &&
      matchEnd
    );
  }).sort((a, b) => a.date.localeCompare(b.date));

  // Build metadata lookups
  const availableCommodities = COMMODITIES.map((c) => c.name);
  const availableStates = Object.keys(GEOGRAPHY);
  const availableDistricts: Record<string, string[]> = {};
  const availableMarkets: Record<string, string[]> = {};

  for (const [st, distObj] of Object.entries(GEOGRAPHY)) {
    availableDistricts[st] = Object.keys(distObj);
    for (const [dst, mkts] of Object.entries(distObj)) {
      availableMarkets[dst] = mkts;
    }
  }

  // If no matching records found, return empty results
  if (filteredRecords.length === 0) {
    return {
      records: [],
      stats: null,
      comparison: [],
      insight: null,
      availableCommodities,
      availableStates,
      availableDistricts,
      availableMarkets,
    };
  }

  const stats = calculateStatistics(filteredRecords);
  const comparison = stats
    ? calculateComparison(filters, stats.latestPrice)
    : [];
  const insight =
    stats && comparison
      ? generateRuleBasedInsights(stats, comparison, filters, lang)
      : null;

  return {
    records: filteredRecords,
    stats,
    comparison,
    insight,
    availableCommodities,
    availableStates,
    availableDistricts,
    availableMarkets,
  };
}
