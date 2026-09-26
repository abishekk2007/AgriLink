import { MarketPriceResponse, ComparisonResponse } from '../api/marketApi';
import { PriceAlert } from '../api/alertApi';

export const IS_DEMO_DATA = true;

export const MOCK_COMMODITIES = [
  { id: 'c-tomato', name: 'Tomato', code: 'tomato', category: 'VEGETABLES', defaultUnit: '₹/kg', icon: '🍅', isMspCovered: false },
  { id: 'c-onion', name: 'Onion', code: 'onion', category: 'VEGETABLES', defaultUnit: '₹/kg', icon: '🧅', isMspCovered: false },
  { id: 'c-potato', name: 'Potato', code: 'potato', category: 'VEGETABLES', defaultUnit: '₹/kg', icon: '🥔', isMspCovered: false },
  { id: 'c-rice', name: 'Rice (Paddy)', code: 'rice', category: 'GRAINS', defaultUnit: '₹/quintal', icon: '🌾', isMspCovered: true },
  { id: 'c-wheat', name: 'Wheat', code: 'wheat', category: 'GRAINS', defaultUnit: '₹/quintal', icon: '🌾', isMspCovered: true },
  { id: 'c-chilli', name: 'Green Chilli', code: 'green_chilli', category: 'VEGETABLES', defaultUnit: '₹/kg', icon: '🌶️', isMspCovered: false },
  { id: 'c-maize', name: 'Maize', code: 'maize', category: 'GRAINS', defaultUnit: '₹/quintal', icon: '🌽', isMspCovered: true },
];

export const MOCK_STATES = [
  { id: 's-tn', name: 'Tamil Nadu', code: 'TN' },
  { id: 's-ka', name: 'Karnataka', code: 'KA' },
  { id: 's-mh', name: 'Maharashtra', code: 'MH' },
];

export const MOCK_DISTRICTS: Record<string, Array<{ id: string; name: string; stateId: string }>> = {
  'Tamil Nadu': [
    { id: 'd-chennai', name: 'Chennai', stateId: 's-tn' },
    { id: 'd-madurai', name: 'Madurai', stateId: 's-tn' },
    { id: 'd-coimbatore', name: 'Coimbatore', stateId: 's-tn' },
    { id: 'd-salem', name: 'Salem', stateId: 's-tn' },
    { id: 'd-dindigul', name: 'Dindigul', stateId: 's-tn' },
    { id: 'd-trichy', name: 'Tiruchirappalli', stateId: 's-tn' },
    { id: 'd-thanjavur', name: 'Thanjavur', stateId: 's-tn' },
  ],
  'Karnataka': [
    { id: 'd-bangalore', name: 'Bengaluru Urban', stateId: 's-ka' },
    { id: 'd-kolar', name: 'Kolar', stateId: 's-ka' },
  ],
  'Maharashtra': [
    { id: 'd-pune', name: 'Pune', stateId: 's-mh' },
    { id: 'd-nashik', name: 'Nashik', stateId: 's-mh' },
  ],
};

export const MOCK_MARKETS: Record<string, Array<{ id: string; name: string; code: string; districtId: string }>> = {
  'Chennai': [
    { id: 'm-koyambedu', name: 'Koyambedu', code: 'TN_KOY', districtId: 'd-chennai' },
    { id: 'm-redhills', name: 'Red Hills', code: 'TN_RED', districtId: 'd-chennai' },
  ],
  'Madurai': [
    { id: 'm-madurai', name: 'Madurai', code: 'TN_MAD', districtId: 'd-madurai' },
  ],
  'Coimbatore': [
    { id: 'm-coimbatore', name: 'Coimbatore', code: 'TN_CBE', districtId: 'd-coimbatore' },
  ],
  'Salem': [
    { id: 'm-salem', name: 'Salem', code: 'TN_SLM', districtId: 'd-salem' },
  ],
  'Dindigul': [
    { id: 'm-ottanchatram', name: 'Ottanchatram (Dindigul)', code: 'TN_OTT', districtId: 'd-dindigul' },
  ],
  'Tiruchirappalli': [
    { id: 'm-trichy', name: 'Tiruchirappalli', code: 'TN_TRY', districtId: 'd-trichy' },
  ],
  'Thanjavur': [
    { id: 'm-thanjavur', name: 'Thanjavur', code: 'TN_TNJ', districtId: 'd-thanjavur' },
  ],
  'Bengaluru Urban': [
    { id: 'm-yeshwanthpur', name: 'Yeshwanthpur', code: 'KA_YES', districtId: 'd-bangalore' },
  ],
  'Kolar': [
    { id: 'm-kolar', name: 'Kolar', code: 'KA_KOL', districtId: 'd-kolar' },
  ],
  'Pune': [
    { id: 'm-pune', name: 'Pune (Gultekdi)', code: 'MH_PUN', districtId: 'd-pune' },
  ],
  'Nashik': [
    { id: 'm-lasalgaon', name: 'Lasalgaon', code: 'MH_LAS', districtId: 'd-nashik' },
  ],
};

export function getMockMarketPrices(
  commodity = 'Tomato',
  market = 'Koyambedu',
  days = 25
): MarketPriceResponse {
  const records = [];
  const basePrice = commodity === 'Onion' ? 38 : commodity === 'Potato' ? 26 : commodity === 'Rice (Paddy)' ? 2350 : 32;
  const unit = commodity === 'Rice (Paddy)' || commodity === 'Wheat' || commodity === 'Maize' ? '₹/quintal' : '₹/kg';

  const end = new Date('2026-09-26T00:00:00Z');
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(end);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];

    const fluctuation = Math.sin(i * 0.4) * (basePrice * 0.08) + (i * 0.15);
    const modalPrice = Math.round((basePrice + fluctuation) * 10) / 10;
    const minPrice = Math.round((modalPrice - basePrice * 0.07) * 10) / 10;
    const maxPrice = Math.round((modalPrice + basePrice * 0.08) * 10) / 10;

    records.push({
      id: `mock-${i}`,
      date: dateStr,
      commodity,
      market,
      district: 'Chennai',
      state: 'Tamil Nadu',
      minPrice,
      maxPrice,
      modalPrice,
      unit,
      source: 'Demo Dataset (Offline Fallback)',
    });
  }

  const latestPrice = records[records.length - 1].modalPrice;
  const firstPrice = records[0].modalPrice;
  const percentageChange = Math.round(((latestPrice - firstPrice) / firstPrice) * 1000) / 10;
  const allModals = records.map((r) => r.modalPrice);
  const avgPrice = Math.round((allModals.reduce((a, b) => a + b, 0) / allModals.length) * 10) / 10;
  const minPrice = Math.min(...records.map((r) => r.minPrice));
  const maxPrice = Math.max(...records.map((r) => r.maxPrice));

  return {
    records,
    stats: {
      latestPrice,
      minPrice,
      maxPrice,
      avgPrice,
      modalPrice: latestPrice,
      unit,
      percentageChange,
      trend: percentageChange >= 1.5 ? 'UP' : percentageChange <= -1.5 ? 'DOWN' : 'STABLE',
      recordCount: records.length,
      firstDate: records[0].date,
      latestDate: records[records.length - 1].date,
      pricePosition: latestPrice > avgPrice ? 'UPPER_RANGE' : 'LOWER_RANGE',
      percentile: 65,
      volatility: 'LOW',
      volatilityScore: 4.2,
    },
    commodity: {
      id: 'mock-comm',
      name: commodity,
      code: commodity.toLowerCase().replace(/\s+/g, '_'),
      category: 'VEGETABLES',
      defaultUnit: unit,
      icon: '🍅',
      isMspCovered: false,
    },
    market: {
      id: 'mock-market',
      name: market,
      code: 'TN_KOY',
      district: 'Chennai',
      state: 'Tamil Nadu',
    },
    insight: {
      trend: percentageChange >= 1.5 ? 'UP' : 'DOWN',
      percentageChange,
      pricePosition: 'UPPER_RANGE',
      volatility: 'LOW',
      insights: [
        `The latest price (₹${latestPrice}) is above the historical average (₹${avgPrice}).`,
        `Recent 25-day trend shows steady trading volume.`,
      ],
      disclaimer: 'This is offline demo data for development fallback.',
    },
    msp: null,
    source: 'AgriLink Offline Mock Data',
  };
}

export function getMockComparison(commodity = 'Tomato'): ComparisonResponse {
  return {
    commodity: {
      id: 'mock-comm',
      name: commodity,
      defaultUnit: '₹/kg',
    },
    comparison: [
      {
        marketId: 'm-koyambedu',
        marketName: 'Koyambedu',
        districtName: 'Chennai',
        stateName: 'Tamil Nadu',
        latestPrice: 34.5,
        minPrice: 31.0,
        maxPrice: 38.0,
        avgPrice: 32.1,
        priceChange: 8.5,
        lastUpdated: '2026-09-26',
        distanceKm: 40,
        estimatedTransportCost: 480,
        netRealization: 34.02,
      },
      {
        marketId: 'm-coimbatore',
        marketName: 'Coimbatore',
        districtName: 'Coimbatore',
        stateName: 'Tamil Nadu',
        latestPrice: 32.8,
        minPrice: 29.5,
        maxPrice: 35.5,
        avgPrice: 30.5,
        priceChange: 5.2,
        lastUpdated: '2026-09-26',
        distanceKm: 85,
        estimatedTransportCost: 1020,
        netRealization: 31.78,
      },
      {
        marketId: 'm-madurai',
        marketName: 'Madurai',
        districtName: 'Madurai',
        stateName: 'Tamil Nadu',
        latestPrice: 29.6,
        minPrice: 26.5,
        maxPrice: 32.0,
        avgPrice: 28.0,
        priceChange: 3.1,
        lastUpdated: '2026-09-26',
        distanceKm: 120,
        estimatedTransportCost: 1440,
        netRealization: 28.16,
      },
      {
        marketId: 'm-kolar',
        marketName: 'Kolar',
        districtName: 'Kolar',
        stateName: 'Karnataka',
        latestPrice: 27.2,
        minPrice: 24.0,
        maxPrice: 30.0,
        avgPrice: 26.1,
        priceChange: 4.0,
        lastUpdated: '2026-09-26',
        distanceKm: 180,
        estimatedTransportCost: 2160,
        netRealization: 25.04,
      },
    ],
    metrics: {
      highestPrice: 34.5,
      lowestPrice: 27.2,
      priceDifference: 7.3,
      highestMarket: 'Koyambedu',
      lowestMarket: 'Kolar',
    },
    note: 'Demo comparison data with transport cost net realization.',
  };
}

export const MOCK_ALERTS: PriceAlert[] = [
  {
    id: 'mock-alert-1',
    commodityId: 'c-tomato',
    marketId: 'm-koyambedu',
    targetPrice: 32.0,
    condition: 'ABOVE',
    status: 'ACTIVE',
    notes: 'Koyambedu tomato selling threshold',
    commodity: { id: 'c-tomato', name: 'Tomato', code: 'tomato', defaultUnit: '₹/kg' },
    market: {
      id: 'm-koyambedu',
      name: 'Koyambedu',
      code: 'TN_KOY',
      district: { name: 'Chennai', state: { name: 'Tamil Nadu' } },
    },
    createdAt: '2026-09-20T10:00:00Z',
    updatedAt: '2026-09-20T10:00:00Z',
  },
  {
    id: 'mock-alert-2',
    commodityId: 'c-onion',
    marketId: 'm-ottanchatram',
    targetPrice: 30.0,
    condition: 'BELOW',
    status: 'ACTIVE',
    notes: 'Ottanchatram onion buy dip',
    commodity: { id: 'c-onion', name: 'Onion', code: 'onion', defaultUnit: '₹/kg' },
    market: {
      id: 'm-ottanchatram',
      name: 'Ottanchatram (Dindigul)',
      code: 'TN_OTT',
      district: { name: 'Dindigul', state: { name: 'Tamil Nadu' } },
    },
    createdAt: '2026-09-21T11:00:00Z',
    updatedAt: '2026-09-21T11:00:00Z',
  },
  {
    id: 'mock-alert-3',
    commodityId: 'c-potato',
    marketId: 'm-madurai',
    targetPrice: 24.0,
    condition: 'BELOW',
    status: 'TRIGGERED',
    triggeredAt: '2026-09-22T08:30:00Z',
    notes: 'Historical low price threshold',
    commodity: { id: 'c-potato', name: 'Potato', code: 'potato', defaultUnit: '₹/kg' },
    market: {
      id: 'm-madurai',
      name: 'Madurai',
      code: 'TN_MAD',
      district: { name: 'Madurai', state: { name: 'Tamil Nadu' } },
    },
    createdAt: '2026-09-18T09:00:00Z',
    updatedAt: '2026-09-22T08:30:00Z',
  },
];
