import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { apiConfig } from '../config/apiConfig';
import { logger } from './logger';
import { ApiError } from './ApiError';

/**
 * Creates and configures the Axios HTTP client instance for External Market API communications
 */
const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: apiConfig.baseUrl,
    timeout: apiConfig.timeout,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'User-Agent': 'AgriLink-Market-Service/1.0',
    },
  });

  // Request Interceptor: Attach authentication and log request dispatch
  client.interceptors.request.use(
    (requestConfig: InternalAxiosRequestConfig) => {
      // Attach start time for latency calculation
      (requestConfig as any).metadata = { startTime: Date.now() };

      // Ensure API key is attached to query parameters if configured and not already present
      if (apiConfig.apiKey) {
        requestConfig.params = {
          'api-key': apiConfig.apiKey,
          format: 'json',
          ...requestConfig.params,
        };
      }

      // Safe parameter logging without exposing secret API keys
      const safeParams = { ...requestConfig.params };
      if (safeParams['api-key']) {
        safeParams['api-key'] = '***REDACTED***';
      }

      logger.debug(
        `[External API Request] ${requestConfig.method?.toUpperCase()} ${requestConfig.baseURL || ''}${requestConfig.url || ''}`,
        { params: safeParams }
      );

      return requestConfig;
    },
    (error) => {
      logger.error('[External API Request Error]', error);
      return Promise.reject(error);
    }
  );

  // Response Interceptor: Log latency & handle error translation
  client.interceptors.response.use(
    (response: AxiosResponse) => {
      const startTime = (response.config as any)?.metadata?.startTime;
      const durationMs = startTime ? Date.now() - startTime : undefined;

      logger.debug(
        `[External API Response] ${response.status} ${response.config.url || ''} - ${durationMs ? `${durationMs}ms` : 'ok'}`
      );

      return response;
    },
    (error) => {
      const startTime = (error.config as any)?.metadata?.startTime;
      const durationMs = startTime ? Date.now() - startTime : undefined;

      // Handle Timeout errors
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        logger.error(`[External API Timeout] Request exceeded ${apiConfig.timeout}ms timeout`);
        return Promise.reject(
          new ApiError(504, `External market API request timed out after ${apiConfig.timeout}ms`)
        );
      }

      // Handle Network / Connection Refused errors
      if (!error.response) {
        logger.error(`[External API Network Error] ${error.message} (${durationMs}ms)`);
        return Promise.reject(
          new ApiError(502, `Unable to connect to external market API: ${error.message}`)
        );
      }

      const status = error.response.status;

      // Handle Authentication / Authorization errors
      if (status === 401 || status === 403) {
        logger.error(`[External API Auth Error] Invalid or unauthorized API key (${status})`);
        return Promise.reject(
          new ApiError(status, 'Invalid or unauthorized external market API key. Please check your credentials.')
        );
      }

      // Handle Rate Limiting
      if (status === 429) {
        logger.warn('[External API Rate Limit] External market service rate limit exceeded');
        return Promise.reject(
          new ApiError(429, 'External market API rate limit exceeded. Please try again later.')
        );
      }

      // Handle Upstream 5xx Server Errors
      if (status >= 500) {
        logger.error(`[External API Upstream Error] Server returned HTTP ${status}`);
        return Promise.reject(
          new ApiError(502, `External market service unavailable (HTTP ${status})`)
        );
      }

      logger.warn(`[External API Client Error] HTTP ${status}: ${error.message}`);
      return Promise.reject(
        new ApiError(status, error.response.data?.message || 'External market API request failed')
      );
    }
  );

  return client;
};

export const apiClient = createApiClient();
