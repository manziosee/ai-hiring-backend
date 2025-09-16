import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '@prisma/client';
import { AiAnalysisService } from './ai-analysis.service';
import { ResumeSummaryDto, RankedCandidateDto, SkillGapAnalysisDto } from './dto/resume-summary.dto';

@ApiTags('AI Analysis')
@Controller('ai-analysis')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AiAnalysisController {
  constructor(private readonly aiAnalysisService: AiAnalysisService) {}

  @Get('resume-summary/:applicationId')
  @UseGuards(RolesGuard)
  @Roles('RECRUITER', 'ADMIN')
  @ApiOperation({ 
    summary: 'Get AI resume summary for application',
    description: 'Analyzes candidate resume and provides AI-generated summary with match score'
  })
  @ApiParam({ name: 'applicationId', description: 'Application ID to analyze' })
  @ApiResponse({ status: 200, description: 'Resume summary generated successfully', type: ResumeSummaryDto })
  @ApiResponse({ status: 404, description: 'Application not found' })
  async getResumeSummary(@Param('applicationId') applicationId: string) {
    return this.aiAnalysisService.summarizeResume(applicationId);
  }

  @Get('rank-candidates/:jobId')
  @UseGuards(RolesGuard)
  @Roles('RECRUITER', 'ADMIN')
  @ApiOperation({ 
    summary: 'Get ranked candidates for job',
    description: 'Returns candidates ranked by AI match score for specific job'
  })
  @ApiParam({ name: 'jobId', description: 'Job ID to rank candidates for' })
  @ApiResponse({ status: 200, description: 'Candidates ranked successfully', type: [RankedCandidateDto] })
  async getRankedCandidates(@Param('jobId') jobId: string) {
    return this.aiAnalysisService.rankCandidates(jobId);
  }

  @Get('skill-gaps')
  @UseGuards(RolesGuard)
  @Roles('RECRUITER', 'ADMIN')
  @ApiOperation({ 
    summary: 'Get skill gap analysis',
    description: 'Analyzes market demand vs supply for different skills'
  })
  @ApiResponse({ status: 200, description: 'Skill gap analysis completed', type: SkillGapAnalysisDto })
  async getSkillGaps(@GetUser() user: User) {
    return this.aiAnalysisService.analyzeSkillGaps(user.id);
  }
}