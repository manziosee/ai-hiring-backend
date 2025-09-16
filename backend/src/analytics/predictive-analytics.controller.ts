import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '@prisma/client';
import { PredictiveAnalyticsService } from './predictive-analytics.service';
import { HiringPredictionsDto, BiasAnalysisDto, SentimentAnalysisDto } from './dto/predictive-analytics.dto';

@ApiTags('Predictive Analytics')
@Controller('predictive-analytics')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PredictiveAnalyticsController {
  constructor(private readonly analyticsService: PredictiveAnalyticsService) {}

  @Get('hiring-predictions')
  @UseGuards(RolesGuard)
  @Roles('RECRUITER', 'ADMIN')
  @ApiOperation({ 
    summary: 'Get hiring predictions and trends',
    description: 'Provides AI-powered predictions for hiring timelines, dropoff rates, and trends'
  })
  @ApiResponse({ status: 200, description: 'Hiring predictions generated successfully', type: HiringPredictionsDto })
  async getHiringPredictions(@GetUser() user: User) {
    return this.analyticsService.getHiringPredictions(user.id);
  }

  @Get('bias-analysis')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'RECRUITER')
  @ApiOperation({ 
    summary: 'Get bias detection analysis',
    description: 'Analyzes hiring patterns to detect potential biases and ensure fairness'
  })
  @ApiResponse({ status: 200, description: 'Bias analysis completed successfully', type: BiasAnalysisDto })
  async getBiasAnalysis(@GetUser() user: User) {
    return this.analyticsService.getBiasAnalysis(user.id);
  }

  @Get('sentiment-analysis/:applicationId')
  @UseGuards(RolesGuard)
  @Roles('RECRUITER', 'ADMIN')
  @ApiOperation({ 
    summary: 'Get candidate sentiment analysis',
    description: 'Analyzes candidate responses and engagement levels using AI sentiment analysis'
  })
  @ApiParam({ name: 'applicationId', description: 'Application ID to analyze sentiment for' })
  @ApiResponse({ status: 200, description: 'Sentiment analysis completed successfully', type: SentimentAnalysisDto })
  @ApiResponse({ status: 404, description: 'Application not found' })
  async getSentimentAnalysis(@Param('applicationId') applicationId: string) {
    return this.analyticsService.getSentimentAnalysis(applicationId);
  }
}