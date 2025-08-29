import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FileUploadService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async saveResume(file: Express.Multer.File, candidateId: string) {
    const baseUrl =
      this.configService.get('APP_URL') || 'http://localhost:3000';
    const resumeUrl = `${baseUrl}/uploads/resumes/${file.filename}`;

    await this.prisma.candidate.update({
      where: { id: candidateId },
      data: { resumeUrl },
    });

    return { resumeUrl };
  }

  async validateFile(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const allowedMimeTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Invalid file type. Only PDF, DOC, and DOCX are allowed.',
      );
    }

    return true;
  }
}
