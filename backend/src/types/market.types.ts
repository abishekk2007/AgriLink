/**
 * AgriLink Standard Market Record Format
 */
export interface MarketRecord {
  date: string;
  state: string;
  district: string;
  market: string;
  commodity: string;
  variety: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
}

/**
 * Filter parameters for querying market price data
 */
export interface MarketQueryFilters {
  commodity?: string;
  state?: string;
  district?: string;
  market?: string;
  date?: string;
  limit?: number;
  offset?: number;
}

/**
 * Raw external agricultural market API record (e.g. data.gov.in / Agmarknet)
 * External APIs frequently vary in field names, casing, and string numbers
 */
export interface RawExternalMarketRecord {
  arrival_date?: string;
  Arrival_Date?: string;
  date?: string;
  Date?: string;

  state?: string;
  State?: string;

  district?: string;
  District?: string;

  market?: string;
  Market?: string;

  commodity?: string;
  Commodity?: string;

  variety?: string;
  Variety?: string;

  min_price?: string | number;
  Min_Price?: string | number;
  minPrice?: string | number;

  max_price?: string | number;
  Max_Price?: string | number;
  maxPrice?: string | number;

  modal_price?: string | number;
  Modal_Price?: string | number;
  modalPrice?: string | number;

  [key: string]: unknown;
}

/**
 * External Gov API Response Envelope
 */
export interface ExternalMarketApiResponse {
  status?: string | number;
  message?: string;
  total?: number;
  count?: number;
  limit?: string | number;
  offset?: string | number;
  records?: RawExternalMarketRecord[];
}

/**
 * Connection test result details
 */
export interface MarketApiConnectionTestResult {
  status: 'connected' | 'degraded' | 'failed';
  endpoint: string;
  latencyMs: number;
  authenticated: boolean;
  message: string;
}
