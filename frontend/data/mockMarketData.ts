import { MarketRecord } from '../types/market';

export const COMMODITIES = [
  { name: 'Tomato', variety: 'Local', unit: '₹/kg', basePrice: 32 },
  { name: 'Onion', variety: 'Bellary', unit: '₹/kg', basePrice: 42 },
  { name: 'Potato', variety: 'Jyoti', unit: '₹/kg', basePrice: 28 },
  { name: 'Green Chilli', variety: 'Local', unit: '₹/kg', basePrice: 55 },
  { name: 'Carrot', variety: 'Ooty', unit: '₹/kg', basePrice: 48 },
];

export const GEOGRAPHY: Record<string, Record<string, string[]>> = {
  'Tamil Nadu': {
    'Chennai': ['Koyambedu', 'Red Hills', 'Madhavaram'],
    'Dindigul': ['Dindigul APMC', 'Oddanchatram'],
    'Coimbatore': ['Coimbatore Central', 'Pollachi'],
  },
  'Karnataka': {
    'Bengaluru Urban': ['Yeshwanthpur', 'KR Market', 'Binny Mill'],
    'Kolar': ['Kolar APMC', 'Malur'],
  },
  'Maharashtra': {
    'Nashik': ['Lasalgaon', 'Pimpalgaon', 'Nashik APMC'],
    'Pune': ['Pune APMC', 'Baramati'],
  },
};

// Daily realistic price patterns for September 2026 (Day 1 to Day 25)
// Designed to reflect real agricultural price behavior: gradual shifts, weather impacts, supply influxes
const TOMATO_CHENNAI_SERIES: Record<string, { min: number; max: number; modal: number }[]> = {
  'Koyambedu': [
    { min: 24, max: 32, modal: 28 }, // Sep 01
    { min: 25, max: 34, modal: 29 }, // Sep 02
    { min: 26, max: 35, modal: 30 }, // Sep 03
    { min: 24, max: 32, modal: 27 }, // Sep 04
    { min: 23, max: 30, modal: 26 }, // Sep 05
    { min: 22, max: 29, modal: 25 }, // Sep 06 - lowest
    { min: 24, max: 32, modal: 28 }, // Sep 07
    { min: 26, max: 35, modal: 31 }, // Sep 08
    { min: 27, max: 36, modal: 32 }, // Sep 09
    { min: 28, max: 38, modal: 34 }, // Sep 10
    { min: 29, max: 39, modal: 35 }, // Sep 11
    { min: 30, max: 40, modal: 36 }, // Sep 12
    { min: 31, max: 41, modal: 37 }, // Sep 13
    { min: 32, max: 42, modal: 38 }, // Sep 14
    { min: 33, max: 43, modal: 39 }, // Sep 15
    { min: 34, max: 44, modal: 40 }, // Sep 16
    { min: 35, max: 46, modal: 41 }, // Sep 17
    { min: 36, max: 48, modal: 44 }, // Sep 18 - highest peak
    { min: 35, max: 46, modal: 42 }, // Sep 19
    { min: 34, max: 45, modal: 41 }, // Sep 20
    { min: 33, max: 43, modal: 40 }, // Sep 21
    { min: 32, max: 42, modal: 39 }, // Sep 22
    { min: 31, max: 41, modal: 38 }, // Sep 23
    { min: 31, max: 42, modal: 38 }, // Sep 24
    { min: 30, max: 41, modal: 37 }, // Sep 25
  ],
  'Red Hills': [
    { min: 22, max: 30, modal: 26 }, // Sep 01
    { min: 23, max: 31, modal: 27 }, // Sep 02
    { min: 24, max: 32, modal: 28 }, // Sep 03
    { min: 22, max: 30, modal: 25 }, // Sep 04
    { min: 21, max: 28, modal: 24 }, // Sep 05
    { min: 20, max: 27, modal: 23 }, // Sep 06
    { min: 22, max: 30, modal: 26 }, // Sep 07
    { min: 24, max: 32, modal: 28 }, // Sep 08
    { min: 25, max: 33, modal: 29 }, // Sep 09
    { min: 26, max: 35, modal: 31 }, // Sep 10
    { min: 27, max: 36, modal: 32 }, // Sep 11
    { min: 28, max: 37, modal: 33 }, // Sep 12
    { min: 29, max: 38, modal: 34 }, // Sep 13
    { min: 30, max: 39, modal: 35 }, // Sep 14
    { min: 30, max: 40, modal: 36 }, // Sep 15
    { min: 31, max: 41, modal: 37 }, // Sep 16
    { min: 32, max: 43, modal: 38 }, // Sep 17
    { min: 33, max: 44, modal: 40 }, // Sep 18
    { min: 32, max: 43, modal: 38 }, // Sep 19
    { min: 31, max: 42, modal: 37 }, // Sep 20
    { min: 30, max: 40, modal: 36 }, // Sep 21
    { min: 29, max: 39, modal: 35 }, // Sep 22
    { min: 29, max: 39, modal: 35 }, // Sep 23
    { min: 29, max: 40, modal: 35 }, // Sep 24
    { min: 28, max: 39, modal: 34 }, // Sep 25
  ],
  'Madhavaram': [
    { min: 23, max: 31, modal: 27 }, // Sep 01
    { min: 24, max: 32, modal: 28 }, // Sep 02
    { min: 25, max: 33, modal: 29 }, // Sep 03
    { min: 23, max: 31, modal: 26 }, // Sep 04
    { min: 22, max: 29, modal: 25 }, // Sep 05
    { min: 21, max: 28, modal: 24 }, // Sep 06
    { min: 23, max: 31, modal: 27 }, // Sep 07
    { min: 25, max: 33, modal: 29 }, // Sep 08
    { min: 26, max: 34, modal: 30 }, // Sep 09
    { min: 27, max: 36, modal: 32 }, // Sep 10
    { min: 28, max: 37, modal: 33 }, // Sep 11
    { min: 29, max: 38, modal: 34 }, // Sep 12
    { min: 30, max: 39, modal: 35 }, // Sep 13
    { min: 31, max: 40, modal: 36 }, // Sep 14
    { min: 31, max: 41, modal: 37 }, // Sep 15
    { min: 32, max: 42, modal: 38 }, // Sep 16
    { min: 33, max: 44, modal: 39 }, // Sep 17
    { min: 34, max: 45, modal: 41 }, // Sep 18
    { min: 33, max: 44, modal: 39 }, // Sep 19
    { min: 32, max: 43, modal: 38 }, // Sep 20
    { min: 31, max: 41, modal: 37 }, // Sep 21
    { min: 30, max: 40, modal: 36 }, // Sep 22
    { min: 30, max: 40, modal: 36 }, // Sep 23
    { min: 30, max: 41, modal: 36 }, // Sep 24
    { min: 29, max: 40, modal: 35 }, // Sep 25
  ],
};

// Helper to generate full realistic records for all combinations
function generateMockRecords(): MarketRecord[] {
  const records: MarketRecord[] = [];

  // Generate for Chennai Tomato explicitly with high accuracy
  for (const [marketName, series] of Object.entries(TOMATO_CHENNAI_SERIES)) {
    series.forEach((priceObj, index) => {
      const dayNum = index + 1;
      const dayStr = dayNum < 10 ? `0${dayNum}` : `${dayNum}`;
      const dateStr = `2026-09-${dayStr}`;

      records.push({
        id: `TN-CHN-${marketName}-Tomato-${dateStr}`,
        date: dateStr,
        state: 'Tamil Nadu',
        district: 'Chennai',
        market: marketName,
        commodity: 'Tomato',
        variety: 'Local',
        minPrice: priceObj.min,
        maxPrice: priceObj.max,
        modalPrice: priceObj.modal,
      });
    });
  }

  // Generate complementary records for all commodities across Sep 01 - Sep 25
  const allCommodities = COMMODITIES;

  for (const [state, districts] of Object.entries(GEOGRAPHY)) {
    for (const [district, markets] of Object.entries(districts)) {
      for (const market of markets) {
        for (const commodity of allCommodities) {
          // If already added for Chennai Tomato, skip to preserve the curated curve
          if (state === 'Tamil Nadu' && district === 'Chennai' && commodity.name === 'Tomato') {
            continue;
          }

          // Generate a smooth continuous time-series for 25 days
          let currentPrice = commodity.basePrice;
          // Apply geographic baseline shift
          if (market.includes('APMC')) currentPrice -= 2;
          if (state === 'Karnataka') currentPrice += 3;
          if (state === 'Maharashtra' && commodity.name === 'Onion') currentPrice -= 5; // Onion hub

          for (let day = 1; day <= 25; day++) {
            const dayStr = day < 10 ? `0${day}` : `${day}`;
            const dateStr = `2026-09-${dayStr}`;

            // Cyclic/trend wave simulation
            const wave = Math.sin((day / 25) * Math.PI * 1.5) * 6;
            const variance = ((day * 7 + market.length * 3) % 5) - 2;
            const modal = Math.max(12, Math.round(currentPrice + wave + variance));
            const min = Math.max(10, Math.round(modal * 0.85));
            const max = Math.round(modal * 1.18);

            records.push({
              id: `${state.substring(0, 2)}-${district.substring(0, 3)}-${market}-${commodity.name}-${dateStr}`,
              date: dateStr,
              state,
              district,
              market,
              commodity: commodity.name,
              variety: commodity.variety,
              minPrice: min,
              maxPrice: max,
              modalPrice: modal,
            });
          }
        }
      }
    }
  }

  return records;
}

export const MOCK_MARKET_RECORDS: MarketRecord[] = generateMockRecords();
