import { config } from './env.config';

/**
 * External Agricultural Market API Configuration
 * Reads credentials from environment variables securely without hardcoding
 */
export const apiConfig = Object.freeze({
  /**
   * Base URL for the external agricultural market data endpoint
   * Example: https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070
   */
  baseUrl: config.marketApi.baseUrl,

  /**
   * Secret API key read from process environment variables
   */
  apiKey: config.marketApi.apiKey,

  /**
   * Request timeout in milliseconds (defaults to 10,000ms)
   */
  timeout: config.marketApi.timeout,

  /**
   * Returns whether an API key has been supplied in the environment
   */
  hasApiKey: Boolean(config.marketApi.apiKey && config.marketApi.apiKey.trim().length > 0),

  /**
   * Returns a sanitized version of configuration safe for logging and diagnostics
   */
  getSanitizedConfig() {
    const key = this.apiKey;
    const maskedKey = key && key.length > 6
      ? `${key.slice(0, 3)}****${key.slice(-3)}`
      : key ? '****' : 'NOT_CONFIGURED';

    return {
      baseUrl: this.baseUrl,
      apiKeyMasked: maskedKey,
      hasApiKey: this.hasApiKey,
      timeout: this.timeout,
    };
  },
});
