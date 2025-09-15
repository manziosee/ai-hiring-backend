import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { LoggerService } from '../common/services/logger.service';

@Injectable()
export class HealthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
  ) {}

  async getHealthStatus() {
    const checks = await Promise.allSettled([
      this.checkDatabase(),
      this.checkMlService(),
      this.checkEmailService(),
    ]);

    const status = checks.every(
      (check) => check.status === 'fulfilled' && check.value.healthy,
    );

    return {
      status: status ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
      checks: {
        database:
          checks[0].status === 'fulfilled'
            ? checks[0].value
            : { healthy: false, error: 'Connection failed' },
        mlService:
          checks[1].status === 'fulfilled'
            ? checks[1].value
            : { healthy: false, error: 'Connection failed' },
        emailService:
          checks[2].status === 'fulfilled'
            ? checks[2].value
            : { healthy: false, error: 'Connection failed' },
      },
    };
  }

  async getMetrics() {
    const memoryUsage = process.memoryUsage();

    return {
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: {
        rss: Math.round(memoryUsage.rss / 1024 / 1024),
        heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024),
        heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024),
        external: Math.round(memoryUsage.external / 1024 / 1024),
      },
      cpu: {
        usage: process.cpuUsage(),
      },
      environment: process.env.NODE_ENV || 'development',
    };
  }

  private async checkDatabase() {
    const startTime = Date.now();
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return { healthy: true, responseTime: Date.now() - startTime };
    } catch (error) {
      this.logger.error(
        'Database health check failed',
        error instanceof Error ? error.stack : String(error),
        'HealthService',
      );
      return {
        healthy: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private async checkMlService() {
    try {
      const mlHost = this.configService.get('ML_SERVICE_HOST', 'localhost');
      const mlPort = this.configService.get('ML_SERVICE_PORT', '8000');
      const protocol =
        this.configService.get('NODE_ENV') === 'production' ? 'https' : 'http';
      const startTime = Date.now();

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`${protocol}://${mlHost}:${mlPort}/health`, {
        method: 'GET',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      return {
        healthy: response.ok,
        responseTime: Date.now() - startTime,
        status: response.status,
      };
    } catch (error: any) {
      this.logger.error(
        'ML service health check failed',
        error.stack || String(error),
        'HealthService',
      );
      return { healthy: false, error: error.message || 'Connection failed' };
    }
  }

  private async checkEmailService() {
    try {
      const emailHost = this.configService.get(
        'EMAIL_SERVICE_HOST',
        'localhost',
      );
      const emailPort = this.configService.get('EMAIL_SERVICE_PORT', '3002');
      const protocol =
        this.configService.get('NODE_ENV') === 'production' ? 'https' : 'http';
      const startTime = Date.now();

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(
        `${protocol}://${emailHost}:${emailPort}/health`,
        {
          method: 'GET',
          signal: controller.signal,
        },
      );

      clearTimeout(timeoutId);

      return {
        healthy: response.ok,
        responseTime: Date.now() - startTime,
        status: response.status,
      };
    } catch (error: any) {
      this.logger.error(
        'Email service health check failed',
        error.stack || String(error),
        'HealthService',
      );
      return { healthy: false, error: error.message || 'Connection failed' };
    }
  }
}
