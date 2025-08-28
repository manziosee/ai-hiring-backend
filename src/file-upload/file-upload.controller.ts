import { Controller, Post, UseInterceptors, UploadedFile, Req, UseGuards, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileUploadService } from './file-upload.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('File Upload')
@ApiBearerAuth('JWT-auth')
@Controller('upload')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post('resume')
  @Roles(UserRole.CANDIDATE)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload candidate resume file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Resume file upload',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Resume file (PDF, DOC, DOCX)',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Resume uploaded successfully' })
  @ApiResponse({ status: 400, description: 'Invalid file format or candidate profile not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Candidates only' })
  async uploadResume(
    @UploadedFile() file: Express.Multer.File,
    @Req() req,
  ) {
    await this.fileUploadService.validateFile(file);
    
    // Get candidate profile for the user
    const candidate = await this.getCandidateProfile(req.user.id);
    
    return this.fileUploadService.saveResume(file, candidate.id);
  }

  private async getCandidateProfile(userId: string) {
    const candidate = await this.fileUploadService['prisma'].candidate.findUnique({
      where: { userId },
    });

    if (!candidate) {
      throw new BadRequestException('Candidate profile not found');
    }

    return candidate;
  }
}