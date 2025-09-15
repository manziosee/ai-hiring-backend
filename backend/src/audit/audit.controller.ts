import {
  Controller,
  Get,
  Query,
  UseGuards,
  Request,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { AuditService } from './audit.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { LoggerService } from '../common/services/logger.service';

@ApiTags('Audit')
@ApiBearerAuth('JWT-auth')
@Controller('audit')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AuditController {
  constructor(
    private readonly auditService: AuditService,
    private readonly logger: LoggerService,
  ) {}

  @Get('logs')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get audit logs (Admin only)' })
  @ApiQuery({ name: 'userId', required: false })
  @ApiQuery({ name: 'action', required: false })
  @ApiQuery({ name: 'resource', required: false })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'offset', required: false })
  @ApiResponse({
    status: 200,
    description: 'Audit logs retrieved successfully',
  })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  async getAuditLogs(
    @Query('userId') userId?: string,
    @Query('action') action?: string,
    @Query('resource') resource?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    try {
      const filters = {
        userId,
        action,
        resource,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        limit: limit ? parseInt(limit, 10) : undefined,
        offset: offset ? parseInt(offset, 10) : undefined,
      };

      return await this.auditService.getAuditLogs(filters);
    } catch (error) {
      this.logger.error(
        'Failed to retrieve audit logs',
        error instanceof Error ? error.stack : String(error),
        'AuditController',
      );
      throw new HttpException(
        'Failed to retrieve audit logs',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('user/:userId')
  @Roles(UserRole.ADMIN, UserRole.RECRUITER)
  @ApiOperation({ summary: 'Get user activity logs' })
  @ApiResponse({
    status: 200,
    description: 'User activity retrieved successfully',
  })
  async getUserActivity(
    @Param('userId') userId: string,
    @Request() req: { user: { id: string; role: string } },
    @Query('limit') limit?: string,
  ) {
    try {
      // Users can only view their own activity unless they're admin
      if (req.user.role !== UserRole.ADMIN && req.user.id !== userId) {
        throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
      }

      const limitNum = limit ? parseInt(limit, 10) : 50;
      return await this.auditService.getUserActivity(userId, limitNum);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(
        `Failed to retrieve user activity for ${userId}`,
        error instanceof Error ? error.stack : String(error),
        'AuditController',
      );
      throw new HttpException(
        'Failed to retrieve user activity',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('resource/:resource/:resourceId')
  @Roles(UserRole.ADMIN, UserRole.RECRUITER)
  @ApiOperation({ summary: 'Get resource activity logs' })
  @ApiResponse({
    status: 200,
    description: 'Resource activity retrieved successfully',
  })
  async getResourceActivity(
    @Param('resource') resource: string,
    @Param('resourceId') resourceId: string,
    @Query('limit') limit?: string,
  ) {
    try {
      const limitNum = limit ? parseInt(limit, 10) : 50;
      return await this.auditService.getResourceActivity(
        resource,
        resourceId,
        limitNum,
      );
    } catch (error) {
      this.logger.error(
        `Failed to retrieve resource activity for ${resource}:${resourceId}`,
        error instanceof Error ? error.stack : String(error),
        'AuditController',
      );
      throw new HttpException(
        'Failed to retrieve resource activity',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('my-activity')
  @ApiOperation({ summary: 'Get current user activity logs' })
  @ApiResponse({
    status: 200,
    description: 'User activity retrieved successfully',
  })
  async getMyActivity(
    @Request() req: { user: { id: string } },
    @Query('limit') limit?: string,
  ) {
    try {
      const limitNum = limit ? parseInt(limit, 10) : 50;
      return await this.auditService.getUserActivity(req.user.id, limitNum);
    } catch (error) {
      this.logger.error(
        `Failed to retrieve activity for user ${req.user.id}`,
        error instanceof Error ? error.stack : String(error),
        'AuditController',
      );
      throw new HttpException(
        'Failed to retrieve your activity',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
