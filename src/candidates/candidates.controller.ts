import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { CandidatesService } from './candidates.service';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Candidates')
@ApiBearerAuth('JWT-auth')
@Controller('candidates')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CandidatesController {
  constructor(private readonly candidatesService: CandidatesService) {}

  @Post()
  @Roles(UserRole.CANDIDATE)
  @ApiOperation({ summary: 'Create candidate profile with resume' })
  @ApiResponse({ status: 201, description: 'Candidate profile created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Only candidates can create profiles' })
  create(@Body() createCandidateDto: CreateCandidateDto, @Req() req) {
    return this.candidatesService.create(createCandidateDto, req.user.id);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.RECRUITER)
  @ApiOperation({ summary: 'Get all candidates (Admin/Recruiter only)' })
  @ApiResponse({ status: 200, description: 'Candidates retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin/Recruiter access only' })
  findAll() {
    return this.candidatesService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.RECRUITER, UserRole.CANDIDATE)
  @ApiOperation({ summary: 'Get candidate details by ID' })
  @ApiParam({ name: 'id', description: 'Candidate ID' })
  @ApiResponse({ status: 200, description: 'Candidate details retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Candidate not found' })
  findOne(@Param('id') id: string) {
    return this.candidatesService.findOne(id);
  }
}