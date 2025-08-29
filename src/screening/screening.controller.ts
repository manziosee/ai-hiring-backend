import { Controller, Post, Get, Param, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { ScreeningService } from './screening.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Screening')
@ApiBearerAuth('JWT-auth')
@Controller('screening')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ScreeningController {
  constructor(private readonly screeningService: ScreeningService) {}

  @Post('run/:applicationId')
  @Roles(UserRole.ADMIN, UserRole.RECRUITER)
  @ApiOperation({ summary: 'Run AI screening on application' })
  @ApiParam({ name: 'applicationId', description: 'Application ID to screen' })
  @ApiResponse({ status: 200, description: 'Screening completed successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin/Recruiter only' })
  @ApiResponse({ status: 404, description: 'Application not found' })
  runScreening(@Param('applicationId') applicationId: string) {
    return this.screeningService.runScreening(applicationId);
  }

  @Get(':applicationId')
  @Roles(UserRole.ADMIN, UserRole.RECRUITER)
  @ApiOperation({ summary: 'Get screening results for application' })
  @ApiParam({ name: 'applicationId', description: 'Application ID' })
  @ApiResponse({
    status: 200,
    description: 'Screening results retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin/Recruiter only' })
  getScreeningResults(@Param('applicationId') applicationId: string) {
    return this.screeningService.getScreeningResults(applicationId);
  }
}
