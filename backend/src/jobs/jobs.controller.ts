import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
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
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Jobs')
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.RECRUITER)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new job posting' })
  @ApiResponse({ status: 201, description: 'Job created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only recruiters and admins can create jobs',
  })
  create(@Body() createJobDto: CreateJobDto, @Req() req) {
    return this.jobsService.create(createJobDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all job postings' })
  @ApiResponse({ status: 200, description: 'Jobs retrieved successfully' })
  findAll() {
    return this.jobsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get job details by ID' })
  @ApiParam({ name: 'id', description: 'Job ID' })
  @ApiResponse({
    status: 200,
    description: 'Job details retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Job not found' })
  findOne(@Param('id') id: string) {
    return this.jobsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.RECRUITER)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update job posting' })
  @ApiParam({ name: 'id', description: 'Job ID' })
  @ApiResponse({ status: 200, description: 'Job updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Can only update own jobs',
  })
  @ApiResponse({ status: 404, description: 'Job not found' })
  update(
    @Param('id') id: string,
    @Body() updateJobDto: UpdateJobDto,
    @Req() req,
  ) {
    return this.jobsService.update(id, updateJobDto, req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.RECRUITER)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete job posting' })
  @ApiParam({ name: 'id', description: 'Job ID' })
  @ApiResponse({ status: 200, description: 'Job deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Can only delete own jobs',
  })
  @ApiResponse({ status: 404, description: 'Job not found' })
  remove(@Param('id') id: string, @Req() req) {
    return this.jobsService.remove(id, req.user.id);
  }
}
