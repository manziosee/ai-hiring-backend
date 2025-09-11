import {
  Controller,
  Post,
  Get,
  Param,
  UseGuards,
  HttpException,
  HttpStatus,
  Request,
} from '@nestjs/common';
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
import { ScreeningResultDto } from './dto/screening-result.dto';
import { LoggerService } from '../common/services/logger.service';
import { ResourceOwnershipGuard } from '../auth/guards/resource-ownership.guard';
import { SetMetadata } from '@nestjs/common';
import { ApiRateLimit } from '../common/decorators/api-rate-limit.decorator';

@ApiTags('Screening')
@ApiBearerAuth('JWT-auth')
@Controller('screening')
@UseGuards(JwtAuthGuard, RolesGuard, ResourceOwnershipGuard)
export class ScreeningController {
  constructor(
    private readonly screeningService: ScreeningService,
    private readonly logger: LoggerService,
  ) {}

  @Post('run/:applicationId')
  @Roles(UserRole.ADMIN, UserRole.RECRUITER)
  @SetMetadata('resource', 'application')
  @ApiRateLimit({ ttl: 300000, limit: 5 })
  @ApiOperation({ summary: 'Run AI screening on application' })
  @ApiParam({ name: 'applicationId', description: 'Application ID to screen' })
  @ApiResponse({
    status: 200,
    description: 'Screening completed successfully',
    type: ScreeningResultDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin/Recruiter only' })
  @ApiResponse({ status: 404, description: 'Application not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async runScreening(
    @Param('applicationId') applicationId: string,
    @Request() req: { user?: { id: string } },
  ) {
    try {
      if (!applicationId || typeof applicationId !== 'string') {
        throw new HttpException(
          'Invalid application ID',
          HttpStatus.BAD_REQUEST,
        );
      }

      this.logger.log(
        `Starting screening for application: ${applicationId}`,
        'ScreeningController',
      );
      const result = await this.screeningService.runScreening(
        applicationId,
        req.user?.id,
      );
      this.logger.log(
        `Screening completed for application: ${applicationId}`,
        'ScreeningController',
      );
      return result;
    } catch (error) {
      this.logger.error(
        `Screening failed for application ${applicationId}:`,
        (error as Error).message,
        'ScreeningController',
      );
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Screening failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('job/:jobId')
  @Roles(UserRole.ADMIN, UserRole.RECRUITER)
  @ApiOperation({ summary: 'Get screening results for job' })
  @ApiParam({ name: 'jobId', description: 'Job ID' })
  @ApiResponse({
    status: 200,
    description: 'Job screening results retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin/Recruiter only' })
  async getJobScreeningResults(@Param('jobId') jobId: string) {
    try {
      return await this.screeningService.getJobScreeningResults(jobId);
    } catch (error) {
      this.logger.error(`Failed to get screening results for job ${jobId}:`, (error as Error).message, 'ScreeningController');
      throw new HttpException('Failed to retrieve job screening results', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':applicationId')
  @Roles(UserRole.ADMIN, UserRole.RECRUITER)
  @SetMetadata('resource', 'application')
  @ApiOperation({ summary: 'Get screening results for application' })
  @ApiParam({ name: 'applicationId', description: 'Application ID' })
  @ApiResponse({
    status: 200,
    description: 'Screening results retrieved successfully',
    type: [ScreeningResultDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin/Recruiter only' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getScreeningResults(@Param('applicationId') applicationId: string) {
    try {
      if (!applicationId || typeof applicationId !== 'string') {
        throw new HttpException(
          'Invalid application ID',
          HttpStatus.BAD_REQUEST,
        );
      }

      return await this.screeningService.getScreeningResults(applicationId);
    } catch (error) {
      this.logger.error(
        `Failed to get screening results for application ${applicationId}:`,
        (error as Error).message,
        'ScreeningController',
      );
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to retrieve screening results',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
