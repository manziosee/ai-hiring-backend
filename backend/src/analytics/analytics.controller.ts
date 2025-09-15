import { Controller, Get, UseGuards, Query, Param } from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { AnalyticsService } from './analytics.service';

@ApiTags('Analytics')
@ApiBearerAuth('JWT-auth')
@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}
  @Get('dashboard')
  @Roles('ADMIN', 'RECRUITER')
  @ApiOperation({ summary: 'Get dashboard analytics metrics' })
  @ApiResponse({
    status: 200,
    description: 'Dashboard metrics retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin/Recruiter only' })
  getDashboardMetrics(@Query('period') period: string = '30d') {
    return this.analyticsService.getDashboardMetrics(period);
  }

  @Get('reports/hiring-funnel')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Get hiring funnel analytics report' })
  @ApiResponse({
    status: 200,
    description: 'Hiring funnel report retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  getHiringFunnelReport() {
    return this.analyticsService.getHiringFunnelReport();
  }

  @Get('jobs/:jobId')
  @Roles('ADMIN', 'RECRUITER')
  @ApiOperation({ summary: 'Get analytics for a specific job' })
  @ApiResponse({
    status: 200,
    description: 'Job analytics retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin/Recruiter only' })
  @ApiResponse({ status: 404, description: 'Job not found' })
  getJobAnalytics(@Param('jobId') jobId: string) {
    return this.analyticsService.getJobAnalytics(jobId);
  }

  @Get('users/:userId')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Get analytics for a specific user' })
  @ApiResponse({
    status: 200,
    description: 'User analytics retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  @ApiResponse({ status: 404, description: 'User not found' })
  getUserAnalytics(@Param('userId') userId: string) {
    return this.analyticsService.getUserActivityAnalytics(userId);
  }
}
