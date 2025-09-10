import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import { SanitizerUtil } from '../utils/sanitizer.util';

@Injectable()
export class LoggerService implements NestLoggerService {
  log(message: any, context?: string) {
    const sanitizedMessage = typeof message === 'string' ? SanitizerUtil.sanitizeForLog(message) : message;
    console.log(`[${new Date().toISOString()}] [LOG] [${context || 'Application'}] ${sanitizedMessage}`);
  }

  error(message: any, trace?: string, context?: string) {
    const sanitizedMessage = typeof message === 'string' ? SanitizerUtil.sanitizeForLog(message) : message;
    const sanitizedTrace = trace ? SanitizerUtil.sanitizeForLog(trace) : '';
    console.error(`[${new Date().toISOString()}] [ERROR] [${context || 'Application'}] ${sanitizedMessage}`, sanitizedTrace);
  }

  warn(message: any, context?: string) {
    const sanitizedMessage = typeof message === 'string' ? SanitizerUtil.sanitizeForLog(message) : message;
    console.warn(`[${new Date().toISOString()}] [WARN] [${context || 'Application'}] ${sanitizedMessage}`);
  }

  debug(message: any, context?: string) {
    const sanitizedMessage = typeof message === 'string' ? SanitizerUtil.sanitizeForLog(message) : message;
    console.debug(`[${new Date().toISOString()}] [DEBUG] [${context || 'Application'}] ${sanitizedMessage}`);
  }

  verbose(message: any, context?: string) {
    const sanitizedMessage = typeof message === 'string' ? SanitizerUtil.sanitizeForLog(message) : message;
    console.log(`[${new Date().toISOString()}] [VERBOSE] [${context || 'Application'}] ${sanitizedMessage}`);
  }
}