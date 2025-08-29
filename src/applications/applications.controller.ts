import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole, ApplicationStatus } from '@prisma/client';

@ApiTags('Applications')
@ApiBearerAuth('JWT-auth')
@Controller('applications')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post()
  @Roles(UserRole.CANDIDATE)
  @ApiOperation({ summary: 'Apply for a job' })
  @ApiResponse({
    status: 201,
    description: 'Application submitted successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only candidates can apply',
  })
  @ApiResponse({ status: 409, description: 'Already applied for this job' })
  create(@Body() createApplicationDto: CreateApplicationDto, @Req() req) {
    return this.applicationsService.create(
      createApplicationDto,
      req.user.candidateProfile.id,
    );
  }

  @Get('job/:jobId')
  @Roles(UserRole.ADMIN, UserRole.RECRUITER)
  @ApiOperation({ summary: 'Get applications for a specific job' })
  @ApiParam({ name: 'jobId', description: 'Job ID' })
  @ApiResponse({
    status: 200,
    description: 'Applications retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Can only view applications for own jobs',
  })
  findByJobId(@Param('jobId') jobId: string, @Req() req) {
    return this.applicationsService.findByJobId(jobId, req.user.id);
  }

  @Patch(':id/status')
  @Roles(UserRole.ADMIN, UserRole.RECRUITER)
  @ApiOperation({ summary: 'Update application status' })
  @ApiParam({ name: 'id', description: 'Application ID' })
  @ApiResponse({
    status: 200,
    description: 'Application status updated successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Can only update applications for own jobs',
  })
  @ApiResponse({ status: 404, description: 'Application not found' })
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: ApplicationStatus,
    @Req() req,
  ) {
    return this.applicationsService.updateStatus(id, status, req.user.id);
  }
}
