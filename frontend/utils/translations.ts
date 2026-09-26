import { Language } from '../types/market';

export interface TranslationDictionary {
  appName: string;
  tagline: string;
  dashboard: string;
  navTitle: string;
  navDashboard: string;
  navMarketPrices: string;
  navCompareMarkets: string;
  navPriceAlerts: string;
  navInsights: string;
  navSettings: string;
  apmcPortalBadge: string;
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  heroExploreBtn: string;
  heroCompareBtn: string;
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
  // Extra features
  shareWhatsApp: string;
  voiceSearchBtn: string;
  listening: string;
  voiceQueryExample: string;
  speechNotSupported: string;
  transportCalculator: string;
  transportCalcDesc: string;
  distanceKm: string;
  transportRate: string;
  quantityKg: string;
  grossMarketValue: string;
  estimatedTransportCost: string;
  netRealization: string;
  netRealizationPerKg: string;
  transportDisclaimer: string;
  mspTitle: string;
  mspPrice: string;
  mspDifference: string;
  mspDisclaimer: string;
  alertsTitle: string;
  alertsSubtitle: string;
  createAlertBtn: string;
  targetPrice: string;
  condition: string;
  conditionAbove: string;
  conditionBelow: string;
  activeAlerts: string;
  triggeredAlerts: string;
  disabledAlerts: string;
  checkAlertsBtn: string;
  checkingAlerts: string;
  noAlertsFound: string;
  volatilityTitle: string;
  volatilityLow: string;
  volatilityMedium: string;
  volatilityHigh: string;
  pricePositionUpper: string;
  pricePositionMiddle: string;
  pricePositionLower: string;
  settingsTitle: string;
  dataSourceTitle: string;
  transparencyNotice: string;
  collegeCredits: string;
  teamAlphaNexus: string;
}

export const COMMODITY_TRANSLATIONS: Record<string, Record<Language, string>> = {
  'Tomato': { en: 'Tomato', ta: 'தக்காளி' },
  'Onion': { en: 'Onion', ta: 'வெங்காயம்' },
  'Potato': { en: 'Potato', ta: 'உருளைக்கிழங்கு' },
  'Rice (Paddy)': { en: 'Rice (Paddy)', ta: 'நெல் / அரிசி' },
  'Wheat': { en: 'Wheat', ta: 'கோதுமை' },
  'Green Chilli': { en: 'Green Chilli', ta: 'பச்சை மிளகாய்' },
  'Carrot': { en: 'Carrot', ta: 'கேரட்' },
  'Maize': { en: 'Maize', ta: 'சோளம்' },
};

export const STATE_TRANSLATIONS: Record<string, Record<Language, string>> = {
  'Tamil Nadu': { en: 'Tamil Nadu', ta: 'தமிழ்நாடு' },
  'Karnataka': { en: 'Karnataka', ta: 'கர்நாடகா' },
  'Maharashtra': { en: 'Maharashtra', ta: 'மகாராஷ்டிரா' },
};

export const DISTRICT_TRANSLATIONS: Record<string, Record<Language, string>> = {
  'Chennai': { en: 'Chennai', ta: 'சென்னை' },
  'Madurai': { en: 'Madurai', ta: 'மதுரை' },
  'Coimbatore': { en: 'Coimbatore', ta: 'கோயம்புத்தூர்' },
  'Salem': { en: 'Salem', ta: 'சேலம்' },
  'Dindigul': { en: 'Dindigul', ta: 'திண்டுக்கல்' },
  'Tiruchirappalli': { en: 'Tiruchirappalli', ta: 'திருச்சிராப்பள்ளி' },
  'Thanjavur': { en: 'Thanjavur', ta: 'தஞ்சாவூர்' },
  'Bengaluru Urban': { en: 'Bengaluru Urban', ta: 'பெங்களூரு நகரம்' },
  'Kolar': { en: 'Kolar', ta: 'கோலார்' },
  'Nashik': { en: 'Nashik', ta: 'நாசிக்' },
  'Pune': { en: 'Pune', ta: 'புனே' },
};

export const MARKET_TRANSLATIONS: Record<string, Record<Language, string>> = {
  'Koyambedu': { en: 'Koyambedu', ta: 'கோயம்பேடு' },
  'Red Hills': { en: 'Red Hills', ta: 'செங்குன்றம் (ரெட் ஹில்ஸ்)' },
  'Madhavaram': { en: 'Madhavaram', ta: 'மாதவரம்' },
  'Madurai': { en: 'Madurai (Mattuthavani)', ta: 'மதுரை மாட்டுத்தாவணி' },
  'Coimbatore': { en: 'Coimbatore (MGR Market)', ta: 'கோயம்புத்தூர் எம்.ஜி.ஆர் சந்தை' },
  'Salem': { en: 'Salem (Shevapet)', ta: 'சேலம் செவ்வாய்ப்பேட்டை' },
  'Ottanchatram (Dindigul)': { en: 'Ottanchatram (Dindigul)', ta: 'ஒட்டன்சத்திரம்' },
  'Tiruchirappalli': { en: 'Tiruchirappalli (Gandhi Market)', ta: 'திருச்சி காந்தி சந்தை' },
  'Thanjavur': { en: 'Thanjavur Regulated Market', ta: 'தஞ்சாவூர் ஒழுங்குமுறை விற்பனைக்கூடம்' },
  'Dindigul APMC': { en: 'Dindigul APMC', ta: 'திண்டுக்கல் மண்டி' },
  'Oddanchatram': { en: 'Oddanchatram', ta: 'ஒட்டன்சத்திரம்' },
  'Coimbatore Central': { en: 'Coimbatore Central', ta: 'கோயம்புத்தூர் மத்திய சந்தை' },
  'Pollachi': { en: 'Pollachi', ta: 'பொள்ளாச்சி' },
  'Yeshwanthpur': { en: 'Yeshwanthpur', ta: 'யஷ்வந்த்பூர்' },
  'KR Market': { en: 'KR Market', ta: 'கே.ஆர். சந்தை' },
  'Binny Mill': { en: 'Binny Mill', ta: 'பின்னி மில்' },
  'Kolar': { en: 'Kolar APMC Market', ta: 'கோலார் மண்டி' },
  'Kolar APMC': { en: 'Kolar APMC', ta: 'கோலார் மண்டி' },
  'Malur': { en: 'Malur', ta: 'மாலூர்' },
  'Lasalgaon': { en: 'Lasalgaon', ta: 'லசல்கான்' },
  'Pimpalgaon': { en: 'Pimpalgaon', ta: 'பிம்பல்கான்' },
  'Nashik APMC': { en: 'Nashik APMC', ta: 'நாசிக் மண்டி' },
  'Pune (Gultekdi)': { en: 'Pune (Gultekdi)', ta: 'புனே குல்தேக்தி மண்டி' },
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

export function generateWhatsAppShareMessage(params: {
  crop: string;
  market: string;
  latestPrice: number;
  avgPrice: number;
  percentageChange: number;
  unit?: string;
  lang?: Language;
}): string {
  const isTa = params.lang === 'ta';
  const unit = params.unit || '₹/kg';
  const trendArrow = params.percentageChange >= 0 ? '↑' : '↓';
  const absChange = Math.abs(params.percentageChange).toFixed(1);

  if (isTa) {
    return (
      `*அக்ரிலிங்க் சந்தை தகவல்*\n\n` +
      `🌾 *பயிர்:* ${params.crop}\n` +
      `📍 *மண்டி:* ${params.market}\n` +
      `💰 *அண்மை விலை:* ₹${params.latestPrice} (${unit})\n` +
      `📊 *சராசரி விலை:* ₹${params.avgPrice} (${unit})\n` +
      `📈 *விலை போக்கு:* ${trendArrow} ${absChange}%\n\n` +
      `மேலும் விவரங்களுக்கு AgriLink தளத்தை பார்க்கவும்.\n` +
      `அரசு மண்டி தகவல்கள் அடிப்படையில்.`
    );
  }

  return (
    `*AgriLink Market Insight*\n\n` +
    `🌾 *Crop:* ${params.crop}\n` +
    `📍 *Market:* ${params.market}\n` +
    `💰 *Latest Price:* ₹${params.latestPrice} (${unit})\n` +
    `📊 *Average Price:* ₹${params.avgPrice} (${unit})\n` +
    `📈 *Trend:* ${trendArrow} ${absChange}%\n\n` +
    `View verified mandi data on AgriLink.\n` +
    `Source: Real Government APMC Mandi Data.`
  );
}

export const TRANSLATIONS: Record<Language, TranslationDictionary> = {
  en: {
    appName: 'AgriLink',
    tagline: 'Market Intelligence for a Stronger Tomorrow',
    dashboard: 'Dashboard',
    navTitle: 'Market Dashboard',
    navDashboard: 'Dashboard',
    navMarketPrices: 'Market Prices',
    navCompareMarkets: 'Compare Markets',
    navPriceAlerts: 'Price Alerts',
    navInsights: 'Insights',
    navSettings: 'Settings',
    apmcPortalBadge: 'APMC Portal',
    heroBadge: 'Market Intelligence Platform',
    heroTitle: 'Market Intelligence for a Stronger Tomorrow',
    heroSubtitle:
      'Understand real government mandi market prices. Compare opportunities. Make informed selling decisions.',
    heroExploreBtn: 'Explore Market Prices',
    heroCompareBtn: 'Compare Markets',
    demoDataBadge: 'AGMARKNET LIVE',
    demoDataNotice:
      'Real government mandi market price records from AGMARKNET & Open Government Data Platform.',
    demoDataSchemaNote: 'Deterministic calculations • Verified APMC data',
    marketSearch: 'Market Search',
    marketSearchDesc: 'Filter official APMC market records by location, commodity, and timeframe',
    marketSearchFooter: 'Displays daily government APMC modal price records in INR (₹/kg or ₹/quintal).',
    crop: 'Commodity',
    state: 'State',
    district: 'District',
    market: 'Market / APMC',
    startDate: 'Start Date',
    endDate: 'End Date',
    fetchData: 'Analyze Market',
    fetchingData: 'Loading verified market data...',
    loadingQueryPrefix: 'Querying APMC records for',
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
      `Comparative price data for ${crop} across regional APMC mandis`,
    marketsTracked: (count) => `${count} Markets Tracked`,
    marketComparisonFooter:
      'Price differentials reflect official APMC recorded modal rates during the specified date range.',
    marketComparisonSource: 'Source: AGMARKNET / Open Government Data Platform India',
    marketInsight: 'Market Insight',
    marketInsightDesc: 'Deterministic observations derived directly from recorded market figures',
    dataBasedInsight: 'Data-based insight',
    insightTrajectoryLabel: 'Price Trajectory',
    insightHighLowLabel: 'Period High / Low',
    insightPositioningLabel: 'Market Positioning',
    insightSpreadLabel: 'Historical Spread',
    insightFooterRule: 'Generated purely via statistical rules over historical records.',
    insightFooterNoAi: 'No AI/ML forecasts or income guarantees.',
    currentPricePosition: 'Price Position',
    priceContextLabel: 'Historical Context',
    priceContextRange: (min, max) => `Min ₹${min} to Max ₹${max}`,
    percentOfRange: (percent) => `${percent}% of Range`,
    low: 'LOW',
    high: 'HIGH',
    moderate: 'MODERATE',
    noDataTitle: 'No market price records found for the selected filters.',
    noDataDesc: 'Try adjusting the commodity, market, or date range.',
    resetFilters: 'Reset to Default Filters',
    selectedMarket: 'Selected Market',
    baseMarket: 'Base Market (Selected)',
    diffFromSelected: 'Difference from Selected',
    apmcBadge: 'APMC',
    samePrice: 'Same (₹0)',
    footerRights: 'AgriLink — Market Intelligence for a Stronger Tomorrow • Team Alpha Nexus (Panimalar Engineering College)',
    footerDisclaimer:
      'Disclaimer: AgriLink provides descriptive historical market price observations based on government APMC records. AgriLink does not predict future prices or guarantee farm profits.',
    footerTech: 'Powered by Next.js, Express, PostgreSQL, Prisma ORM & Recharts • Real Mandi Data',
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
      `Calculation: Change from start date (₹${first}) to latest date (₹${latest}) over active filter window.`,
    chartModalDefinition: 'Modal = Most frequent trade price',
    recordedRange: 'Recorded Range:',
    upwardTrendText: (percent) => `↑ Price increased by ${percent}%`,
    downwardTrendText: (percent) => `↓ Price decreased by ${percent}%`,
    stableTrendText: (percent) => `→ Price remained relatively stable (${percent > 0 ? '+' : ''}${percent}%)`,
    shareWhatsApp: 'Share on WhatsApp',
    voiceSearchBtn: 'Voice Search',
    listening: 'Listening...',
    voiceQueryExample: 'e.g., "Tomato price in Chennai"',
    speechNotSupported: 'Speech recognition is not supported in this browser.',
    transportCalculator: 'Transport Cost & Net Realization',
    transportCalcDesc: 'Estimate net farmer realization after factoring in haulage and distance costs.',
    distanceKm: 'Distance (km)',
    transportRate: 'Transport Rate (₹/km)',
    quantityKg: 'Quantity (kg)',
    grossMarketValue: 'Gross Market Value',
    estimatedTransportCost: 'Estimated Transport Cost',
    netRealization: 'Estimated Net Realization',
    netRealizationPerKg: 'Net Realization per kg',
    transportDisclaimer: 'Notice: Net realization is an estimate based on distance and rate. Actual toll charges and transit shrinkage may vary.',
    mspTitle: 'Minimum Support Price (MSP)',
    mspPrice: 'Official MSP Rate',
    mspDifference: 'Difference from MSP',
    mspDisclaimer: 'MSP is a government benchmark price and does not guarantee open market selling price.',
    alertsTitle: 'Mandi Price Alerts',
    alertsSubtitle: 'Configure rule-based alerts when market prices cross your target thresholds.',
    createAlertBtn: 'Create Price Alert',
    targetPrice: 'Target Price (₹)',
    condition: 'Trigger Condition',
    conditionAbove: 'Price goes ABOVE target',
    conditionBelow: 'Price drops BELOW target',
    activeAlerts: 'Active Alerts',
    triggeredAlerts: 'Triggered History',
    disabledAlerts: 'Disabled Alerts',
    checkAlertsBtn: 'Check Alerts Now',
    checkingAlerts: 'Checking...',
    noAlertsFound: 'No alerts created yet. Set a price alert to monitor mandi movements.',
    volatilityTitle: 'Price Volatility Index',
    volatilityLow: 'Low Volatility (Steady Trading)',
    volatilityMedium: 'Moderate Volatility',
    volatilityHigh: 'High Volatility (Rapid Fluctuations)',
    pricePositionUpper: 'Upper Price Range (Top Tier)',
    pricePositionMiddle: 'Middle Price Range',
    pricePositionLower: 'Lower Price Range',
    settingsTitle: 'Settings & Data Transparency',
    dataSourceTitle: 'Government Data Source Provenance',
    transparencyNotice: 'AgriLink sources mandi records directly from AGMARKNET and Open Government Data (data.gov.in).',
    collegeCredits: 'Panimalar Engineering College',
    teamAlphaNexus: 'Team Alpha Nexus',
  },
  ta: {
    appName: 'அக்ரிலிங்க்',
    tagline: 'வலிமையான நாளைய விடியலுக்கான சந்தை நுண்ணறிவு',
    dashboard: 'முகப்பு பலகை',
    navTitle: 'சந்தை தகவல் பலகை',
    navDashboard: 'முகப்பு',
    navMarketPrices: 'சந்தை விலைகள்',
    navCompareMarkets: 'சந்தைகள் ஒப்பீடு',
    navPriceAlerts: 'விலை எச்சரிக்கைகள்',
    navInsights: 'நுண்ணறிவு',
    navSettings: 'அமைப்புகள்',
    apmcPortalBadge: 'APMC சந்தை தளம்',
    heroBadge: 'சந்தை நுண்ணறிவு தளம்',
    heroTitle: 'வலிமையான நாளைய விடியலுக்கான சந்தை நுண்ணறிவு',
    heroSubtitle:
      'உண்மையான அரசு மண்டி சந்தை விலைகளைப் புரிந்து கொள்ளுங்கள். வாய்ப்புகளை ஒப்பிடுங்கள். சரியான விற்பனை முடிவுகளை எடுங்கள்.',
    heroExploreBtn: 'சந்தை விலைகளை ஆராய்க',
    heroCompareBtn: 'சந்தைகளை ஒப்பிடுக',
    demoDataBadge: 'அக்மார்க்நெட் நேரலை',
    demoDataNotice:
      'அக்மார்க்நெட் மற்றும் இந்திய திறந்த அரசு தரவு தளத்தின் சரிபார்க்கப்பட்ட அரசு மண்டி பதிவுகள்.',
    demoDataSchemaNote: 'விதிமுறைகளின்படியான கணக்கீடு • சரிபார்க்கப்பட்ட APMC தரவு',
    marketSearch: 'சந்தை தேடல்',
    marketSearchDesc: 'அமைவிடம், பயிர் மற்றும் காலவரம்பு வாரியாக அதிகாரப்பூர்வ APMC சந்தை பதிவுகளை வடிகட்டவும்',
    marketSearchFooter: 'தினசரி அரசு APMC மாதிரி விலை பதிவுகளை ரூ/கிலோ அல்லது ரூ/குவிண்டாலில் காட்டுகிறது.',
    crop: 'பயிர் / விளைபொருள்',
    state: 'மாநிலம்',
    district: 'மாவட்டம்',
    market: 'சந்தை / உழவர் சந்தை',
    startDate: 'தொடக்க தேதி',
    endDate: 'முடிவு தேதி',
    fetchData: 'சந்தையை ஆராய்க',
    fetchingData: 'சரிபார்க்கப்பட்ட சந்தை தரவு ஏற்றப்படுகிறது...',
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
      `பல்வேறு மண்டிகளுடன் ${crop} விலை ஒப்பீட்டு விவரங்கள்`,
    marketsTracked: (count) => `${count} சந்தைகள் கண்காணிக்கப்படுகின்றன`,
    marketComparisonFooter:
      'விலை வேறுபாடுகள் குறிப்பிட்ட தேதி வரம்பில் அதிகாரப்பூர்வ APMC பதிவு செய்யப்பட்ட மாதிரி விலைகளை பிரதிபலிக்கின்றன.',
    marketComparisonSource: 'ஆதாரம்: அக்மார்க்நெட் / இந்திய திறந்த அரசு தரவு தளம்',
    marketInsight: 'சந்தை நுண்ணறிவு',
    marketInsightDesc: 'பதிவு செய்யப்பட்ட சந்தை எண்களிலிருந்து நேரடியாக பெறப்பட்ட தரவு அவதானிப்புகள்',
    dataBasedInsight: 'தரவு அடிப்படையிலான நுண்ணறிவு',
    insightTrajectoryLabel: 'விலை போக்கு',
    insightHighLowLabel: 'காலகட்டத்தின் உச்சம் / குறைவு',
    insightPositioningLabel: 'சந்தை ஒப்பீட்டு நிலை',
    insightSpreadLabel: 'வரலாற்று விலை இடைவெளி',
    insightFooterRule: 'வரலாற்று பதிவுகளின் புள்ளிவிவர விதிகளின்படி மட்டுமே உருவாக்கப்பட்டது.',
    insightFooterNoAi: 'AI கணிப்புகளோ அல்லது லாப உத்தரவாதங்களோ இல்லை.',
    currentPricePosition: 'விலை நிலை வரம்பு',
    priceContextLabel: 'வரலாற்று பின்னணி',
    priceContextRange: (min, max) => `குறைந்தது ₹${min} முதல் அதிகபட்சம் ₹${max} வரை`,
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
    footerRights: 'அக்ரிலிங்க் — வலிமையான நாளைய விடியலுக்கான சந்தை நுண்ணறிவு • ஆல்ஃபா நெக்ஸஸ் குழு (பனிமலர் பொறியியல் கல்லூரி)',
    footerDisclaimer:
      'பொறுப்புத் துறப்பு: இத்தளம் வரலாற்று அரசு மண்டி விலை அவதானிப்புகளை மட்டுமே வழங்குகிறது. எதிர்கால விலைகளை கணிப்பதோ லாப உத்தரவாதங்களோ வழங்காது.',
    footerTech: 'Next.js, Express, PostgreSQL, Prisma ORM மற்றும் Recharts மூலம் உருவாக்கப்பட்டது • உண்மையான மண்டி தரவு',
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
      `கணக்கீடு: தொடக்க தேதி (₹${first}) முதல் அண்மை தேதி (₹${latest}) வரையிலான விலை மாற்றம்.`,
    chartModalDefinition: 'மாதிரி விலை = சந்தையில் அதிகம் வர்த்தகமான விலை',
    recordedRange: 'பதிவான விலை வரம்பு:',
    upwardTrendText: (percent) => `↑ விலை ${percent}% அதிகரித்துள்ளது`,
    downwardTrendText: (percent) => `↓ விலை ${percent}% குறைந்துள்ளது`,
    stableTrendText: (percent) => `→ விலை ஒப்பீட்டளவில் நிலையாக உள்ளது (${percent > 0 ? '+' : ''}${percent}%)`,
    shareWhatsApp: 'வாட்ஸ்அப்பில் பகிர்க',
    voiceSearchBtn: 'குரல் தேடல்',
    listening: 'கேட்கிறது...',
    voiceQueryExample: 'எ.கா: "சென்னை தக்காளி விலை"',
    speechNotSupported: 'உங்கள் உலாவியில் குரல் தேடல் வசதி இல்லை.',
    transportCalculator: 'போக்குவரத்து செலவு மற்றும் நிகர வருவாய்',
    transportCalcDesc: 'தூரம் மற்றும் போக்குவரத்து கட்டணத்தைக் கழித்து தோராயமான நிகர வருவாயைக் கணக்கிடுங்கள்.',
    distanceKm: 'தூரம் (கி.மீ)',
    transportRate: 'போக்குவரத்து கட்டணம் (₹/கி.மீ)',
    quantityKg: 'அளவு (கிலோ)',
    grossMarketValue: 'மொத்த சந்தை மதிப்பு',
    estimatedTransportCost: 'தோராய போக்குவரத்து செலவு',
    netRealization: 'தோராய நிகர வருவாய்',
    netRealizationPerKg: 'கிலோவுக்கு நிகர வருவாய்',
    transportDisclaimer: 'குறிப்பு: இது தூரம் மற்றும் கட்டணத்தின் அடிப்படையிலான மதிப்பீடு மட்டுமே. சுங்க கட்டணம் மற்றும் சேதாரம் மாறுபடலாம்.',
    mspTitle: 'குறைந்தபட்ச ஆதரவு விலை (MSP)',
    mspPrice: 'அரசு நிர்ணயித்த MSP விலை',
    mspDifference: 'MSP-யிலிருந்து வேறுபாடு',
    mspDisclaimer: 'MSP என்பது அரசின் வழிகாட்டு விலை மட்டுமே, வெளிச்சந்தை விற்பனை விலைக்கு இது உத்தரவாதமல்ல.',
    alertsTitle: 'மண்டி விலை எச்சரிக்கைகள்',
    alertsSubtitle: 'சந்தை விலை உங்கள் இலக்கை அடையும் போது விதிகளின்படி எச்சரிக்கை பெறுங்கள்.',
    createAlertBtn: 'புதிய எச்சரிக்கை உருவாக்குக',
    targetPrice: 'இலக்கு விலை (₹)',
    condition: 'தூண்டுதல் நிபந்தனை',
    conditionAbove: 'விலை இலக்கிற்கு மேல் உயரும் போது',
    conditionBelow: 'விலை இலக்கிற்கு கீழ் குறையும் போது',
    activeAlerts: 'செயலில் உள்ள எச்சரிக்கைகள்',
    triggeredAlerts: 'தூண்டப்பட்ட வரலாறு',
    disabledAlerts: 'முடக்கப்பட்டவை',
    checkAlertsBtn: 'எச்சரிக்கைகளை சரிபார்க்கவும்',
    checkingAlerts: 'சரிபார்க்கிறது...',
    noAlertsFound: 'இதுவரை எச்சரிக்கைகள் எதுவும் உருவாக்கப்படவில்லை.',
    volatilityTitle: 'விலை மாறுபாடு குறியீடு',
    volatilityLow: 'குறைந்த மாறுபாடு (நிலையான வர்த்தகம்)',
    volatilityMedium: 'மிதமான மாறுபாடு',
    volatilityHigh: 'அதிக மாறுபாடு (வேகமான ஏற்ற இறக்கம்)',
    pricePositionUpper: 'மேல் விலை பிரிவு (உயர் வரம்பு)',
    pricePositionMiddle: 'நடுத்தர விலை பிரிவு',
    pricePositionLower: 'கீழ் விலை பிரிவு',
    settingsTitle: 'அமைப்புகள் மற்றும் தரவு வெளிப்படைத்தன்மை',
    dataSourceTitle: 'அரசு தரவு மூல விவரங்கள்',
    transparencyNotice: 'அக்ரிலிங்க் அக்மார்க்நெட் மற்றும் இந்திய திறந்த அரசு தரவு தளத்திலிருந்து நேரடியாக மண்டி பதிவுகளைப் பெறுகிறது.',
    collegeCredits: 'பனிமலர் பொறியியல் கல்லூரி',
    teamAlphaNexus: 'ஆல்ஃபா நெக்ஸஸ் குழு',
  },
};
