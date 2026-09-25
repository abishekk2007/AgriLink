import { Language } from '../types/market';

export interface TranslationDictionary {
  appName: string;
  tagline: string;
  dashboard: string;
  navTitle: string;
  apmcPortalBadge: string;
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  demoDataBadge: string;
  demoDataNotice: string;
  demoDataSchemaNote: string;
  marketSearch: string;
  marketSearchDesc: string;
  marketSearchFooter: string;
  crop: string;
  state: string;
  district: string;
  market: string;
  startDate: string;
  endDate: string;
  fetchData: string;
  fetchingData: string;
  loadingQueryPrefix: string;
  dateError: string;
  latestPrice: string;
  minimumPrice: string;
  maximumPrice: string;
  averagePrice: string;
  priceHistory: string;
  priceHistorySubtitle: (crop: string, market: string) => string;
  priceTrend: string;
  historicalTrend: string;
  typicalMarketPrice: string;
  marketComparison: string;
  marketComparisonSubtitle: (crop: string, market: string) => string;
  marketsTracked: (count: number) => string;
  marketComparisonFooter: string;
  marketComparisonSource: string;
  marketInsight: string;
  marketInsightDesc: string;
  dataBasedInsight: string;
  insightTrajectoryLabel: string;
  insightHighLowLabel: string;
  insightPositioningLabel: string;
  insightSpreadLabel: string;
  insightFooterRule: string;
  insightFooterNoAi: string;
  currentPricePosition: string;
  priceContextLabel: string;
  priceContextRange: (min: number, max: number) => string;
  percentOfRange: (percent: number) => string;
  low: string;
  high: string;
  moderate: string;
  noDataTitle: string;
  noDataDesc: string;
  resetFilters: string;
  selectedMarket: string;
  baseMarket: string;
  diffFromSelected: string;
  apmcBadge: string;
  samePrice: string;
  footerRights: string;
  footerDisclaimer: string;
  footerTech: string;
  kgUnit: string;
  marketOverview: (crop: string, market: string) => string;
  daysObserved: (days: number) => string;
  badgeCurrentModal: string;
  badgeLowest: string;
  badgePeak: string;
  badgeAverage: string;
  statsRecordedDays: (count: number) => string;
  statsRecordedOn: (date: string) => string;
  statsPeakOn: (date: string) => string;
  statsMeanAcross: string;
  chartCalculationNote: (first: number, latest: number) => string;
  chartModalDefinition: string;
  recordedRange: string;
  upwardTrendText: (percent: number) => string;
  downwardTrendText: (percent: number) => string;
  stableTrendText: (percent: number) => string;
}

export const COMMODITY_TRANSLATIONS: Record<string, Record<Language, string>> = {
  'Tomato': { en: 'Tomato', ta: 'தக்காளி' },
  'Onion': { en: 'Onion', ta: 'வெங்காயம்' },
  'Potato': { en: 'Potato', ta: 'உருளைக்கிழங்கு' },
  'Green Chilli': { en: 'Green Chilli', ta: 'பச்சை மிளகாய்' },
  'Carrot': { en: 'Carrot', ta: 'கேரட்' },
};

export const STATE_TRANSLATIONS: Record<string, Record<Language, string>> = {
  'Tamil Nadu': { en: 'Tamil Nadu', ta: 'தமிழ்நாடு' },
  'Karnataka': { en: 'Karnataka', ta: 'கர்நாடகா' },
  'Maharashtra': { en: 'Maharashtra', ta: 'மகாராஷ்டிரா' },
};

export const DISTRICT_TRANSLATIONS: Record<string, Record<Language, string>> = {
  'Chennai': { en: 'Chennai', ta: 'சென்னை' },
  'Dindigul': { en: 'Dindigul', ta: 'திண்டுக்கல்' },
  'Coimbatore': { en: 'Coimbatore', ta: 'கோயம்புத்தூர்' },
  'Bengaluru Urban': { en: 'Bengaluru Urban', ta: 'பெங்களூரு நகரம்' },
  'Kolar': { en: 'Kolar', ta: 'கோலார்' },
  'Nashik': { en: 'Nashik', ta: 'நாசிக்' },
  'Pune': { en: 'Pune', ta: 'புனே' },
};

export const MARKET_TRANSLATIONS: Record<string, Record<Language, string>> = {
  'Koyambedu': { en: 'Koyambedu', ta: 'கோயம்பேடு' },
  'Red Hills': { en: 'Red Hills', ta: 'செங்குன்றம் (ரெட் ஹில்ஸ்)' },
  'Madhavaram': { en: 'Madhavaram', ta: 'மாதவரம்' },
  'Dindigul APMC': { en: 'Dindigul APMC', ta: 'திண்டுக்கல் மண்டி' },
  'Oddanchatram': { en: 'Oddanchatram', ta: 'ஒட்டன்சத்திரம்' },
  'Coimbatore Central': { en: 'Coimbatore Central', ta: 'கோயம்புத்தூர் மத்திய சந்தை' },
  'Pollachi': { en: 'Pollachi', ta: 'பொள்ளாச்சி' },
  'Yeshwanthpur': { en: 'Yeshwanthpur', ta: 'யஷ்வந்த்பூர்' },
  'KR Market': { en: 'KR Market', ta: 'கே.ஆர். சந்தை' },
  'Binny Mill': { en: 'Binny Mill', ta: 'பின்னி மில்' },
  'Kolar APMC': { en: 'Kolar APMC', ta: 'கோலார் மண்டி' },
  'Malur': { en: 'Malur', ta: 'மாலூர்' },
  'Lasalgaon': { en: 'Lasalgaon', ta: 'லசல்கான்' },
  'Pimpalgaon': { en: 'Pimpalgaon', ta: 'பிம்பல்கான்' },
  'Nashik APMC': { en: 'Nashik APMC', ta: 'நாசிக் மண்டி' },
  'Pune APMC': { en: 'Pune APMC', ta: 'புனே மண்டி' },
  'Baramati': { en: 'Baramati', ta: 'பாராமதி' },
};

export function translateCommodity(name: string, lang: Language): string {
  return COMMODITY_TRANSLATIONS[name]?.[lang] || name;
}

export function translateState(name: string, lang: Language): string {
  return STATE_TRANSLATIONS[name]?.[lang] || name;
}

export function translateDistrict(name: string, lang: Language): string {
  return DISTRICT_TRANSLATIONS[name]?.[lang] || name;
}

export function translateMarket(name: string, lang: Language): string {
  return MARKET_TRANSLATIONS[name]?.[lang] || name;
}

const MONTHS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_TA = ['ஜன', 'பிப்', 'மார்ச்', 'ஏப்', 'மே', 'ஜூன்', 'ஜூலை', 'ஆக', 'செப்', 'அக்', 'நவ', 'டிச'];

export function formatLocalizedDisplayDate(dateStr: string, lang: Language = 'en'): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  const mIndex = parseInt(month, 10) - 1;
  const monthName = lang === 'ta' ? (MONTHS_TA[mIndex] || month) : (MONTHS_EN[mIndex] || month);
  return `${parseInt(day, 10)} ${monthName} ${year}`;
}

export function formatLocalizedShortDate(dateStr: string, lang: Language = 'en'): string {
  if (!dateStr) return '';
  const [, month, day] = dateStr.split('-');
  const mIndex = parseInt(month, 10) - 1;
  const monthName = lang === 'ta' ? (MONTHS_TA[mIndex] || month) : (MONTHS_EN[mIndex] || month);
  return `${parseInt(day, 10)} ${monthName}`;
}

export const TRANSLATIONS: Record<Language, TranslationDictionary> = {
  en: {
    appName: 'AgriLink',
    tagline: 'Market Intelligence for a Stronger Tomorrow',
    dashboard: 'Dashboard',
    navTitle: 'Market Dashboard',
    apmcPortalBadge: 'APMC Portal',
    heroBadge: 'Market Data Dashboard',
    heroTitle: 'Market Intelligence for Farmers',
    heroSubtitle:
      'Understand market prices, compare markets, and make informed selling decisions using real market data.',
    demoDataBadge: 'DEMO DATA',
    demoDataNotice:
      'Government API integration will be connected in the next development phase.',
    demoDataSchemaNote: 'Simulating Agmarknet/APMC standard pricing schema',
    marketSearch: 'Market Search',
    marketSearchDesc: 'Filter official APMC market records by location, commodity, and timeframe',
    marketSearchFooter: 'Displays daily government APMC modal price records in INR (₹/kg).',
    crop: 'Crop',
    state: 'State',
    district: 'District',
    market: 'Market / APMC',
    startDate: 'Start Date',
    endDate: 'End Date',
    fetchData: 'Fetch Market Data',
    fetchingData: 'Loading market data...',
    loadingQueryPrefix: 'Querying regional records for',
    dateError: 'Please select a valid date range (Start Date cannot be after End Date).',
    latestPrice: 'Latest Price',
    minimumPrice: 'Minimum Price',
    maximumPrice: 'Maximum Price',
    averagePrice: 'Average Price',
    priceHistory: 'Price History',
    priceHistorySubtitle: (crop, market) =>
      `Daily typical APMC modal rates for ${crop} at ${market}`,
    priceTrend: 'Historical Price Trend',
    historicalTrend: 'Historical Price Trend',
    typicalMarketPrice: 'Typical Market Price (Modal Price)',
    marketComparison: 'Compare Markets',
    marketComparisonSubtitle: (crop, market) =>
      `Comparative price data for ${crop} against ${market} and regional APMCs`,
    marketsTracked: (count) => `${count} Markets Tracked`,
    marketComparisonFooter:
      'Price differentials reflect official APMC recorded modal rates during the specified date range.',
    marketComparisonSource: 'Source: Simulated APMC Mandi Records',
    marketInsight: 'Market Insight',
    marketInsightDesc: 'Deterministic observations derived directly from recorded market figures',
    dataBasedInsight: 'Data-based insight',
    insightTrajectoryLabel: 'Price Trajectory',
    insightHighLowLabel: 'Period High / Low',
    insightPositioningLabel: 'Market Positioning',
    insightSpreadLabel: 'Historical Spread',
    insightFooterRule: 'Generated purely via statistical rules over historical records.',
    insightFooterNoAi: 'No predictive algorithms applied.',
    currentPricePosition: 'Current Price Position',
    priceContextLabel: 'Historical Context',
    priceContextRange: (min, max) => `Min ₹${min}/kg to Max ₹${max}/kg`,
    percentOfRange: (percent) => `${percent}% of Range`,
    low: 'LOW',
    high: 'HIGH',
    moderate: 'MODERATE',
    noDataTitle: 'No market data available for the selected filters.',
    noDataDesc: 'Try another crop, market, or date range.',
    resetFilters: 'Reset to Default Filters',
    selectedMarket: 'Selected Market',
    baseMarket: 'Base Market (Selected)',
    diffFromSelected: 'Difference from Selected',
    apmcBadge: 'APMC',
    samePrice: 'Same (₹0)',
    footerRights: 'AgriLink — Market Intelligence for a Stronger Tomorrow. College Project Initiative.',
    footerDisclaimer:
      'Disclaimer: This platform provides descriptive historical market price observations. AgriLink does not predict future prices or provide financial guarantees.',
    footerTech: 'Built with Next.js, React, TypeScript, Tailwind CSS & Recharts • No External APIs Connected',
    kgUnit: '₹/kg',
    marketOverview: (crop, market) => `${crop} Market Overview (${market})`,
    daysObserved: (days) => `${days} Days Observed`,
    badgeCurrentModal: 'Current Modal',
    badgeLowest: 'Lowest',
    badgePeak: 'Peak Period',
    badgeAverage: 'Average',
    statsRecordedDays: (count) => `${count} recorded days in period`,
    statsRecordedOn: (date) => `Recorded on ${date}`,
    statsPeakOn: (date) => `Peak on ${date}`,
    statsMeanAcross: 'Mean modal across all dates',
    chartCalculationNote: (first, latest) =>
      `Calculation: Change from start date (₹${first}/kg) to latest date (₹${latest}/kg) over the active filter window.`,
    chartModalDefinition: 'Modal = Most frequent trade price',
    recordedRange: 'Recorded Range:',
    upwardTrendText: (percent) => `↑ Upward trend +${percent}%`,
    downwardTrendText: (percent) => `↓ Downward trend ${percent}%`,
    stableTrendText: (percent) => `→ Relatively stable (${percent > 0 ? '+' : ''}${percent}%)`,
  },
  ta: {
    appName: 'அக்ரிலிங்க்',
    tagline: 'வலிமையான நாளைய விடியலுக்கான சந்தை நுண்ணறிவு',
    dashboard: 'முகப்பு பலகை',
    navTitle: 'சந்தை தகவல் பலகை',
    apmcPortalBadge: 'APMC சந்தை தளம்',
    heroBadge: 'சந்தை தரவு பலகை',
    heroTitle: 'விவசாயிகளுக்கான சந்தை நுண்ணறிவு',
    heroSubtitle:
      'சந்தை விலைகளைப் புரிந்து கொண்டு, மண்டிகளை ஒப்பிட்டு, சரியான விற்பனை முடிவுகளை எடுக்க உதவுவது.',
    demoDataBadge: 'மாதிரி தரவு (டெமோ)',
    demoDataNotice:
      'அரசு சந்தை API அடுத்த வளர்ச்சி கட்டத்தில் இணைக்கப்படும்.',
    demoDataSchemaNote: 'அக்மார்க்நெட் / APMC நிலையான விலை மாதிரியை பிரதிபலிக்கிறது',
    marketSearch: 'சந்தை தேடல்',
    marketSearchDesc: 'அமைவிடம், பயிர் மற்றும் காலவரம்பு வாரியாக அதிகாரப்பூர்வ APMC சந்தை பதிவுகளை வடிகட்டவும்',
    marketSearchFooter: 'தினசரி அரசு APMC மாதிரி விலை பதிவுகளை ரூ/கிலோவில் காட்டுகிறது.',
    crop: 'பயிர்',
    state: 'மாநிலம்',
    district: 'மாவட்டம்',
    market: 'சந்தை / உழவர் சந்தை',
    startDate: 'தொடக்க தேதி',
    endDate: 'முடிவு தேதி',
    fetchData: 'சந்தை தரவை பெறுக',
    fetchingData: 'சந்தை தரவு ஏற்றப்படுகிறது...',
    loadingQueryPrefix: 'மண்டிகளுக்கான பதிவுகள் பெறப்படுகின்றன:',
    dateError: 'சரியான தேதியை தேர்ந்தெடுக்கவும் (தொடக்க தேதி முடிவு தேதியை விட அதிகமாக இருக்கக்கூடாது).',
    latestPrice: 'அண்மை விலை',
    minimumPrice: 'குறைந்தபட்ச விலை',
    maximumPrice: 'அதிகபட்ச விலை',
    averagePrice: 'சராசரி விலை',
    priceHistory: 'விலை வரலாறு',
    priceHistorySubtitle: (crop, market) =>
      `${market} சந்தையில் ${crop} பயிருக்கான தினசரி மாதிரி விலை விகிதங்கள்`,
    priceTrend: 'வரலாற்று விலை போக்கு',
    historicalTrend: 'வரலாற்று விலை போக்கு',
    typicalMarketPrice: 'வழக்கமான சந்தை விலை (மாதிரி விலை)',
    marketComparison: 'சந்தை ஒப்பீடு',
    marketComparisonSubtitle: (crop, market) =>
      `${market} மற்றும் அருகிலுள்ள APMC மண்டிகளுடன் ${crop} விலை ஒப்பீடு`,
    marketsTracked: (count) => `${count} சந்தைகள் கண்காணிக்கப்படுகின்றன`,
    marketComparisonFooter:
      'விலை வேறுபாடுகள் குறிப்பிட்ட தேதி வரம்பில் அதிகாரப்பூர்வ APMC பதிவு செய்யப்பட்ட மாதிரி விலைகளை பிரதிபலிக்கின்றன.',
    marketComparisonSource: 'ஆதாரம்: மாதிரி APMC மண்டி பதிவுகள்',
    marketInsight: 'சந்தை நுண்ணறிவு',
    marketInsightDesc: 'பதிவு செய்யப்பட்ட சந்தை எண்களிலிருந்து நேரடியாக பெறப்பட்ட தரவு அவதானிப்புகள்',
    dataBasedInsight: 'தரவு அடிப்படையிலான நுண்ணறிவு',
    insightTrajectoryLabel: 'விலை போக்கு',
    insightHighLowLabel: 'காலகட்டத்தின் உச்சம் / குறைவு',
    insightPositioningLabel: 'சந்தை ஒப்பீட்டு நிலை',
    insightSpreadLabel: 'வரலாற்று விலை இடைவெளி',
    insightFooterRule: 'வரலாற்று பதிவுகளின் புள்ளிவிவர விதிகளின்படி மட்டுமே உருவாக்கப்பட்டது.',
    insightFooterNoAi: 'எந்தவொரு கணிப்பு அல்காரிதங்களும் பயன்படுத்தப்படவில்லை.',
    currentPricePosition: 'தற்போதைய விலை நிலை',
    priceContextLabel: 'வரலாற்று பின்னணி',
    priceContextRange: (min, max) => `குறைந்தது ₹${min}/கிலோ முதல் அதிகபட்சம் ₹${max}/கிலோ வரை`,
    percentOfRange: (percent) => `வரம்பில் ${percent}%`,
    low: 'குறைவு',
    high: 'அதிகம்',
    moderate: 'மிதமானது',
    noDataTitle: 'தேர்ந்தெடுக்கப்பட்ட வடிகட்டிகளுக்கு சந்தை தரவு எதுவும் கிடைக்கவில்லை.',
    noDataDesc: 'வேறு பயிர், சந்தை அல்லது தேதி வரம்பை முயற்சி செய்யவும்.',
    resetFilters: 'இயல்புநிலை வடிகட்டிகளுக்கு மீட்டமைக்கவும்',
    selectedMarket: 'தேர்ந்தெடுக்கப்பட்ட சந்தை',
    baseMarket: 'அடிப்படை சந்தை (தேர்வு செய்யப்பட்டது)',
    diffFromSelected: 'தேர்ந்தெடுக்கப்பட்ட சந்தையிலிருந்து வேறுபாடு',
    apmcBadge: 'மண்டி',
    samePrice: 'சமம் (₹0)',
    footerRights: 'அக்ரிலிங்க் — வலிமையான நாளைய விடியலுக்கான சந்தை நுண்ணறிவு. கல்லூரி திட்ட முன்முயற்சி.',
    footerDisclaimer:
      'பொறுப்புத் துறப்பு: இத்தளம் வரலாற்று சந்தை விலை அவதானிப்புகளை மட்டுமே வழங்குகிறது. எதிர்கால விலைகளை கணிப்பதோ நிதி உத்தரவாதங்களோ வழங்காது.',
    footerTech: 'Next.js, React, TypeScript, Tailwind CSS மற்றும் Recharts மூலம் உருவாக்கப்பட்டது • வெளி APIகள் இணைக்கப்படவில்லை',
    kgUnit: '₹/கிலோ',
    marketOverview: (crop, market) => `${crop} சந்தை கண்ணோட்டம் (${market})`,
    daysObserved: (days) => `${days} நாட்கள் அவதானிக்கப்பட்டது`,
    badgeCurrentModal: 'தற்போதைய மாதிரி விலை',
    badgeLowest: 'குறைந்தபட்சம்',
    badgePeak: 'உச்ச விலை காலம்',
    badgeAverage: 'சராசரி',
    statsRecordedDays: (count) => `காலகட்டத்தில் பதிவு செய்யப்பட்ட ${count} நாட்கள்`,
    statsRecordedOn: (date) => `${date} அன்று பதிவானது`,
    statsPeakOn: (date) => `${date} அன்று உச்சம்`,
    statsMeanAcross: 'அனைத்து நாட்களின் சராசரி மாதிரி விலை',
    chartCalculationNote: (first, latest) =>
      `கணக்கீடு: தொடக்க தேதி (₹${first}/கிலோ) முதல் அண்மை தேதி (₹${latest}/கிலோ) வரையிலான விலை மாற்றம்.`,
    chartModalDefinition: 'மாதிரி விலை = சந்தையில் அதிகம் வர்த்தகமான விலை',
    recordedRange: 'பதிவான விலை வரம்பு:',
    upwardTrendText: (percent) => `↑ மேல்நோக்கிய போக்கு +${percent}%`,
    downwardTrendText: (percent) => `↓ கீழ்நோக்கிய போக்கு ${percent}%`,
    stableTrendText: (percent) => `→ ஒப்பீட்டளவில் நிலையானது (${percent > 0 ? '+' : ''}${percent}%)`,
  },
};
