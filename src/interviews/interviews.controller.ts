import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
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
import { InterviewsService } from './interviews.service';
import { CreateInterviewDto } from './dto/create-interview.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Interviews')
@ApiBearerAuth('JWT-auth')
@Controller('interviews')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InterviewsController {
  constructor(private readonly interviewsService: InterviewsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.RECRUITER)
  @ApiOperation({ summary: 'Schedule an interview' })
  @ApiResponse({ status: 201, description: 'Interview scheduled successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin/Recruiter only' })
  @ApiResponse({ status: 404, description: 'Application not found' })
  create(@Body() createInterviewDto: CreateInterviewDto, @Req() req) {
    return this.interviewsService.create(createInterviewDto, req.user.id);
  }

  @Get(':applicationId')
  @ApiOperation({ summary: 'Get interviews for an application' })
  @ApiParam({ name: 'applicationId', description: 'Application ID' })
  @ApiResponse({
    status: 200,
    description: 'Interviews retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Access denied' })
  @ApiResponse({ status: 404, description: 'Application not found' })
  findByApplicationId(
    @Param('applicationId') applicationId: string,
    @Req() req,
  ) {
    return this.interviewsService.findByApplicationId(
      applicationId,
      req.user.id,
    );
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.RECRUITER)
  @ApiOperation({ summary: 'Update interview' })
  @ApiParam({ name: 'id', description: 'Interview ID' })
  @ApiResponse({ status: 200, description: 'Interview updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin/Recruiter only' })
  @ApiResponse({ status: 404, description: 'Interview not found' })
  update(@Param('id') id: string, @Body() updateData: any, @Req() req) {
    return this.interviewsService.update(id, updateData, req.user.id);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.RECRUITER)
  @ApiOperation({ summary: 'Cancel interview' })
  @ApiParam({ name: 'id', description: 'Interview ID' })
  @ApiResponse({ status: 200, description: 'Interview cancelled successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin/Recruiter only' })
  @ApiResponse({ status: 404, description: 'Interview not found' })
  remove(@Param('id') id: string, @Req() req) {
    return this.interviewsService.remove(id, req.user.id);
  }
}
