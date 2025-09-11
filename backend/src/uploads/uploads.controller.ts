import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Get,
  Param,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { Express, Response } from 'express';
import { UploadsService } from './uploads.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Uploads')
@ApiBearerAuth('JWT-auth')
@Controller('uploads')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('resume')
  @Roles(UserRole.CANDIDATE, UserRole.ADMIN, UserRole.RECRUITER)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload resume file' })
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
  @ApiResponse({ status: 400, description: 'Invalid file format or size' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async uploadResume(@UploadedFile() file: Express.Multer.File) {
    return this.uploadsService.uploadResume(file);
  }

  @Get('resume/:filename')
  @Roles(UserRole.ADMIN, UserRole.RECRUITER)
  @ApiOperation({ summary: 'Download resume file' })
  @ApiResponse({ status: 200, description: 'Resume file downloaded' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin/Recruiter only' })
  @ApiResponse({ status: 404, description: 'File not found' })
  async downloadResume(
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    return this.uploadsService.downloadResume(filename, res);
  }

  @Post('job-description')
  @Roles(UserRole.ADMIN, UserRole.RECRUITER)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload job description file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Job description file upload',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Job description file (PDF, DOC, DOCX, TXT)',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Job description uploaded successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid file format or size' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin/Recruiter only' })
  async uploadJobDescription(@UploadedFile() file: Express.Multer.File) {
    return this.uploadsService.uploadJobDescription(file);
  }
}
