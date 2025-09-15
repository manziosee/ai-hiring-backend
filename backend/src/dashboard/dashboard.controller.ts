import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '@prisma/client';
import { DashboardService } from './dashboard.service';

@ApiTags('Dashboard')
@Controller('dashboard')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('admin')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Get admin dashboard data' })
  async getAdminDashboard() {
    return this.dashboardService.getAdminDashboard();
  }

  @Get('recruiter')
  @UseGuards(RolesGuard)
  @Roles('RECRUITER')
  @ApiOperation({ summary: 'Get recruiter dashboard data' })
  async getRecruiterDashboard(@GetUser() user: User) {
    return this.dashboardService.getRecruiterDashboard(user.id);
  }

  @Get('candidate')
  @UseGuards(RolesGuard)
  @Roles('CANDIDATE')
  @ApiOperation({ summary: 'Get candidate dashboard data' })
  async getCandidateDashboard(@GetUser() user: User) {
    return this.dashboardService.getCandidateDashboard(user.id);
  }
}
