import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LoggerService } from '../common/services/logger.service';

export interface AuditLogData {
  userId: string;
  action: string;
  resource: string;
  resourceId: string;
  metadata?: any;
  ipAddress?: string;
  userAgent?: string;
}

@Injectable()
export class AuditService {
  constructor(
    private prisma: PrismaService,
    private logger: LoggerService,
  ) {}

  async log(data: AuditLogData) {
    try {
      const auditLog = await this.prisma.auditLog.create({
        data: {
          userId: data.userId,
          action: data.action,
          resource: data.resource,
          resourceId: data.resourceId,
          metadata: data.metadata || {},
          ipAddress: data.ipAddress,
          userAgent: data.userAgent,
          timestamp: new Date(),
        },
      });

      this.logger.log(
        `Audit: ${data.action} on ${data.resource}:${data.resourceId} by user:${data.userId}`,
        'AuditService',
      );

      return auditLog;
    } catch (error) {
      this.logger.error(
        'Failed to create audit log',
        error instanceof Error ? error.stack : String(error),
        'AuditService',
      );
      throw error;
    }
  }

  async getAuditLogs(filters: {
    userId?: string;
    action?: string;
    resource?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    offset?: number;
  }) {
    const where: any = {};

    if (filters.userId) where.userId = filters.userId;
    if (filters.action) where.action = filters.action;
    if (filters.resource) where.resource = filters.resource;
    if (filters.startDate || filters.endDate) {
      where.timestamp = {};
      if (filters.startDate) where.timestamp.gte = filters.startDate;
      if (filters.endDate) where.timestamp.lte = filters.endDate;
    }

    return this.prisma.auditLog.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      take: filters.limit || 100,
      skip: filters.offset || 0,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
      },
    });
  }

  async getUserActivity(userId: string, limit = 50) {
    return this.prisma.auditLog.findMany({
      where: { userId },
      orderBy: { timestamp: 'desc' },
      take: limit,
    });
  }

  async getResourceActivity(resource: string, resourceId: string, limit = 50) {
    return this.prisma.auditLog.findMany({
      where: { resource, resourceId },
      orderBy: { timestamp: 'desc' },
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
      },
    });
  }
}
