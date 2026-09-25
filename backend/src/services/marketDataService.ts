import { apiClient } from '../utils/apiClient';
import { apiConfig } from '../config/apiConfig';
import { logger } from '../utils/logger';
import { ApiError } from '../utils/ApiError';
import {
  MarketRecord,
  MarketQueryFilters,
  RawExternalMarketRecord,
  MarketApiConnectionTestResult,
} from '../types/market.types';

/**
 * Realistic default fallback agricultural market data for offline resilience,
 * testing, and development when external API is unreachable or demo keys are used.
 */
const FALLBACK_MARKET_DATA: MarketRecord[] = [
  {
    date: '2026-09-25',
    state: 'Tamil Nadu',
    district: 'Chennai',
    market: 'Koyambedu',
    commodity: 'Tomato',
    variety: 'Hybrid',
    minPrice: 2200,
    maxPrice: 2800,
    modalPrice: 2500,
  },
  {
    date: '2026-09-25',
    state: 'Tamil Nadu',
    district: 'Chennai',
    market: 'Koyambedu',
    commodity: 'Onion',
    variety: 'Nasik',
    minPrice: 3200,
    maxPrice: 3800,
    modalPrice: 3500,
  },
  {
    date: '2026-09-25',
    state: 'Tamil Nadu',
    district: 'Chennai',
    market: 'Koyambedu',
    commodity: 'Potato',
    variety: 'Jyoti',
    minPrice: 1800,
    maxPrice: 2400,
    modalPrice: 2100,
  },
  {
    date: '2026-09-25',
    state: 'Maharashtra',
    district: 'Nashik',
    market: 'Lasalgaon',
    commodity: 'Onion',
    variety: 'Red',
    minPrice: 2800,
    maxPrice: 3400,
    modalPrice: 3100,
  },
  {
    date: '2026-09-25',
    state: 'Karnataka',
    district: 'Bengaluru Urban',
    market: 'Yeshwanthpur',
    commodity: 'Tomato',
    variety: 'Local',
    minPrice: 2100,
    maxPrice: 2600,
    modalPrice: 2350,
  },
  {
    date: '2026-09-25',
    state: 'Punjab',
    district: 'Ludhiana',
    market: 'Khanna',
    commodity: 'Wheat',
    variety: 'Sharbati',
    minPrice: 2275,
    maxPrice: 2450,
    modalPrice: 2360,
  },
  {
    date: '2026-09-25',
    state: 'Gujarat',
    district: 'Rajkot',
    market: 'Rajkot',
    commodity: 'Cotton',
    variety: 'Shankar-6',
    minPrice: 6800,
    maxPrice: 7500,
    modalPrice: 7200,
  },
  {
    date: '2026-09-25',
    state: 'Uttar Pradesh',
    district: 'Ghaziabad',
    market: 'Sahibabad',
    commodity: 'Rice',
    variety: 'Basmati',
    minPrice: 3400,
    maxPrice: 4200,
    modalPrice: 3800,
  },
];

export class MarketDataService {
  /**
   * Tests connection to the external agricultural market API endpoint
   */
  public static async testConnection(): Promise<MarketApiConnectionTestResult> {
    const startTime = Date.now();

    try {
      logger.info(`Testing external market API connection at: ${apiConfig.baseUrl}`);

      // Attempt lightweight ping to external API (limit=1)
      const response = await apiClient.get('', {
        params: {
          limit: 1,
          offset: 0,
        },
      });

      const latencyMs = Date.now() - startTime;

      return {
        status: 'connected',
        endpoint: apiConfig.baseUrl,
        latencyMs,
        authenticated: apiConfig.hasApiKey,
        message: 'External agricultural market API connected and responding successfully',
      };
    } catch (error: any) {
      const latencyMs = Date.now() - startTime;
      logger.warn(`External market API test connection error: ${error.message}`);

      // Provide diagnostic feedback
      if (error instanceof ApiError && (error.statusCode === 401 || error.statusCode === 403)) {
        return {
          status: 'degraded',
          endpoint: apiConfig.baseUrl,
          latencyMs,
          authenticated: false,
          message: 'External API reachable, but API key is invalid or unauthorized. Fallback dataset active.',
        };
      }

      return {
        status: 'degraded',
        endpoint: apiConfig.baseUrl,
        latencyMs,
        authenticated: apiConfig.hasApiKey,
        message: `External API reached status with note: ${error.message}. Fallback dataset active for development.`,
      };
    }
  }

  /**
   * Fetches agricultural market data, applying query filters and transforming records
   */
  public static async fetchMarketData(filters: MarketQueryFilters = {}): Promise<MarketRecord[]> {
    try {
      // Build external API query parameters
      const params: Record<string, string | number> = {
        limit: filters.limit || 50,
        offset: filters.offset || 0,
      };

      // data.gov.in filter pattern: filters[field]=value
      if (filters.commodity) {
        params['filters[commodity]'] = filters.commodity;
      }
      if (filters.state) {
        params['filters[state]'] = filters.state;
      }
      if (filters.district) {
        params['filters[district]'] = filters.district;
      }
      if (filters.market) {
        params['filters[market]'] = filters.market;
      }

      logger.info('Fetching market data from external API...', { filters });

      const response = await apiClient.get('', { params });
      const rawRecords = this.extractRecords(response.data);

      if (rawRecords.length === 0) {
        logger.info('External API returned empty records, checking fallback dataset...');
        return this.queryFallbackData(filters);
      }

      // Transform raw external records into clean AgriLink format
      const transformed = rawRecords
        .map((record) => this.transformRecord(record))
        .filter((record): record is MarketRecord => record !== null);

      return transformed;
    } catch (error: any) {
      logger.warn(`External API fetch encountered error (${error.message}). Utilizing resilient fallback data.`);
      
      // If external API fails (network failure, timeout, invalid key), serve fallback dataset
      const fallbackResults = this.queryFallbackData(filters);
      if (fallbackResults.length > 0) {
        return fallbackResults;
      }

      // If even fallback yields nothing matching the criteria
      throw new ApiError(502, `Unable to fetch market data: ${error.message}`);
    }
  }

  /**
   * Extracts records array from various external API response structures
   */
  private static extractRecords(responseData: unknown): RawExternalMarketRecord[] {
    if (!responseData || typeof responseData !== 'object') {
      return [];
    }

    const data = responseData as Record<string, unknown>;

    // Case 1: Standard data.gov.in response: { records: [...] }
    if (Array.isArray(data.records)) {
      return data.records;
    }

    // Case 2: Nested response: { data: [...] }
    if (Array.isArray(data.data)) {
      return data.data;
    }

    // Case 3: Root array
    if (Array.isArray(responseData)) {
      return responseData;
    }

    return [];
  }

  /**
   * Transforms raw external record into AgriLink Standard Market Record Format:
   * External API response → Clean fields → Convert names → AgriLink format
   */
  public static transformRecord(raw: RawExternalMarketRecord): MarketRecord | null {
    if (!raw || typeof raw !== 'object') {
      return null;
    }

    // 1. Normalize Date (e.g. DD/MM/YYYY -> YYYY-MM-DD or standard ISO date)
    const rawDate = raw.arrival_date || raw.Arrival_Date || raw.date || raw.Date || '';
    const formattedDate = this.normalizeDate(String(rawDate));

    // 2. Clean and convert names
    const state = String(raw.state || raw.State || 'Unknown').trim();
    const district = String(raw.district || raw.District || 'Unknown').trim();
    const market = String(raw.market || raw.Market || 'Unknown').trim();
    const commodity = String(raw.commodity || raw.Commodity || 'Unknown').trim();
    const variety = String(raw.variety || raw.Variety || 'Standard').trim();

    // 3. Clean and convert numerical prices (modal_price -> modalPrice, etc.)
    const minPrice = this.parsePrice(raw.min_price ?? raw.Min_Price ?? raw.minPrice);
    const maxPrice = this.parsePrice(raw.max_price ?? raw.Max_Price ?? raw.maxPrice);
    const modalPrice = this.parsePrice(raw.modal_price ?? raw.Modal_Price ?? raw.modalPrice);

    return {
      date: formattedDate,
      state,
      district,
      market,
      commodity,
      variety,
      minPrice,
      maxPrice,
      modalPrice,
    };
  }

  /**
   * Formats various external date strings into YYYY-MM-DD
   */
  private static normalizeDate(dateStr: string): string {
    if (!dateStr || dateStr.trim() === '') {
      return new Date().toISOString().split('T')[0];
    }

    const trimmed = dateStr.trim();

    // Format: DD/MM/YYYY
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(trimmed)) {
      const [day, month, year] = trimmed.split('/');
      return `${year}-${month}-${day}`;
    }

    // Format: DD-MM-YYYY
    if (/^\d{2}-\d{2}-\d{4}$/.test(trimmed)) {
      const [day, month, year] = trimmed.split('-');
      return `${year}-${month}-${day}`;
    }

    // Format: YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
      return trimmed;
    }

    const parsed = new Date(trimmed);
    if (!isNaN(parsed.getTime())) {
      return parsed.toISOString().split('T')[0];
    }

    return new Date().toISOString().split('T')[0];
  }

  /**
   * Safe numerical price parser
   */
  private static parsePrice(value: unknown): number {
    if (value === undefined || value === null) {
      return 0;
    }

    if (typeof value === 'number') {
      return isNaN(value) ? 0 : Math.round(value * 100) / 100;
    }

    // Clean currency symbols, commas and spaces
    const cleaned = String(value).replace(/[^0-9.-]+/g, '');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : Math.round(parsed * 100) / 100;
  }

  /**
   * Filter fallback dataset matching user query parameters
   */
  private static queryFallbackData(filters: MarketQueryFilters): MarketRecord[] {
    return FALLBACK_MARKET_DATA.filter((item) => {
      if (
        filters.commodity &&
        !item.commodity.toLowerCase().includes(filters.commodity.toLowerCase())
      ) {
        return false;
      }
      if (
        filters.state &&
        !item.state.toLowerCase().includes(filters.state.toLowerCase())
      ) {
        return false;
      }
      if (
        filters.district &&
        !item.district.toLowerCase().includes(filters.district.toLowerCase())
      ) {
        return false;
      }
      if (
        filters.market &&
        !item.market.toLowerCase().includes(filters.market.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }
}
