import { SetMetadata } from '@nestjs/common';

export function RateLimit(limit: number, windowMs?: number) {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    SetMetadata('rateLimit', limit)(target, propertyKey, descriptor);
    if (windowMs) {
      SetMetadata('rateLimitWindow', windowMs)(target, propertyKey, descriptor);
    }
  };
}
