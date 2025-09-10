import { SetMetadata } from '@nestjs/common';

export interface RateLimitOptions {
  ttl: number;
  limit: number;
}

export const API_RATE_LIMIT_KEY = 'api_rate_limit';

export const ApiRateLimit = (options: RateLimitOptions) => 
  SetMetadata(API_RATE_LIMIT_KEY, options);