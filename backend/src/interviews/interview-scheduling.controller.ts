import { Controller, Get, Post, Body, Param, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '@prisma/client';
import { InterviewSchedulingService } from './interview-scheduling.service';
import { ScheduleInterviewDto, InterviewSlotDto, InterviewDto } from './dto/interview-scheduling.dto';

@ApiTags('Interview Scheduling')
@Controller('interview-scheduling')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class InterviewSchedulingController {
  constructor(private readonly schedulingService: InterviewSchedulingService) {}

  @Post('schedule')
  @ApiOperation({ 
    summary: 'Schedule an interview',
    description: 'Creates a new interview appointment for a candidate application'
  })
  @ApiBody({ type: ScheduleInterviewDto })
  @ApiResponse({ status: 201, description: 'Interview scheduled successfully', type: InterviewDto })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  @ApiResponse({ status: 404, description: 'Application or interviewer not found' })
  async scheduleInterview(@Body() data: ScheduleInterviewDto) {
    return this.schedulingService.scheduleInterview({
      ...data,
      scheduledAt: new Date(data.scheduledAt)
    });
  }

  @Get('available-slots/:interviewerId')
  @ApiOperation({ 
    summary: 'Get available interview slots',
    description: 'Returns available time slots for a specific interviewer on a given date'
  })
  @ApiParam({ name: 'interviewerId', description: 'Interviewer user ID' })
  @ApiQuery({ name: 'date', description: 'Date to check availability (YYYY-MM-DD)', example: '2024-01-15' })
  @ApiResponse({ status: 200, description: 'Available slots retrieved successfully', type: [InterviewSlotDto] })
  @ApiResponse({ status: 404, description: 'Interviewer not found' })
  async getAvailableSlots(
    @Param('interviewerId') interviewerId: string,
    @Query('date') date: string
  ) {
    return this.schedulingService.getAvailableSlots(interviewerId, date);
  }

  @Get('my-interviews')
  @ApiOperation({ 
    summary: 'Get user interviews',
    description: 'Returns all interviews for the authenticated user (as interviewer or candidate)'
  })
  @ApiResponse({ status: 200, description: 'Interviews retrieved successfully', type: [InterviewDto] })
  async getMyInterviews(@GetUser() user: User) {
    return this.schedulingService.getInterviewsByUser(user.id, user.role);
  }
}