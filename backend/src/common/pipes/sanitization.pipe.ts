import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { SanitizerUtil } from '../utils/sanitizer.util';

@Injectable()
export class SanitizationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (typeof value === 'string') {
      return SanitizerUtil.sanitizeHtml(value);
    }
    
    if (typeof value === 'object' && value !== null) {
      return this.sanitizeObject(value);
    }
    
    return value;
  }

  private sanitizeObject(obj: any): any {
    const sanitized = { ...obj };
    
    for (const key in sanitized) {
      if (typeof sanitized[key] === 'string') {
        sanitized[key] = SanitizerUtil.sanitizeHtml(sanitized[key]);
      } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
        sanitized[key] = this.sanitizeObject(sanitized[key]);
      }
    }
    
    return sanitized;
  }
}