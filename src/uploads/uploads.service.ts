import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Express, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);
const mkdir = promisify(fs.mkdir);
const access = promisify(fs.access);

@Injectable()
export class UploadsService {
  private readonly uploadDir: string;
  private readonly maxFileSize: number = 10 * 1024 * 1024; // 10MB
  private readonly allowedMimeTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
  ];

  constructor(private configService: ConfigService) {
    this.uploadDir = this.configService.get('UPLOAD_DIR') || './uploads';
    this.ensureUploadDir();
  }

  private async ensureUploadDir() {
    try {
      await access(this.uploadDir);
    } catch {
      await mkdir(this.uploadDir, { recursive: true });
    }
  }

  async uploadResume(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    this.validateFile(file);

    const filename = this.generateFilename(file.originalname, 'resume');
    const filepath = path.join(this.uploadDir, filename);

    try {
      await writeFile(filepath, file.buffer);
      
      return {
        success: true,
        filename,
        originalName: file.originalname,
        size: file.size,
        mimeType: file.mimetype,
        uploadPath: `/uploads/resume/${filename}`,
      };
    } catch (error) {
      throw new BadRequestException('Failed to save file');
    }
  }

  async uploadJobDescription(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    this.validateFile(file);

    const filename = this.generateFilename(file.originalname, 'job-desc');
    const filepath = path.join(this.uploadDir, filename);

    try {
      await writeFile(filepath, file.buffer);
      
      return {
        success: true,
        filename,
        originalName: file.originalname,
        size: file.size,
        mimeType: file.mimetype,
        uploadPath: `/uploads/job-description/${filename}`,
      };
    } catch (error) {
      throw new BadRequestException('Failed to save file');
    }
  }

  async downloadResume(filename: string, res: Response) {
    const filepath = path.join(this.uploadDir, filename);

    try {
      await access(filepath);
      const fileBuffer = await readFile(filepath);
      
      // Set appropriate headers
      res.setHeader('Content-Type', this.getMimeTypeFromFilename(filename));
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      
      return res.send(fileBuffer);
    } catch (error) {
      throw new NotFoundException('File not found');
    }
  }

  private validateFile(file: Express.Multer.File) {
    // Check file size
    if (file.size > this.maxFileSize) {
      throw new BadRequestException(`File size exceeds maximum limit of ${this.maxFileSize / 1024 / 1024}MB`);
    }

    // Check MIME type
    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Invalid file type. Allowed types: PDF, DOC, DOCX, TXT'
      );
    }

    // Check file extension
    const allowedExtensions = ['.pdf', '.doc', '.docx', '.txt'];
    const fileExtension = path.extname(file.originalname).toLowerCase();
    
    if (!allowedExtensions.includes(fileExtension)) {
      throw new BadRequestException(
        'Invalid file extension. Allowed extensions: .pdf, .doc, .docx, .txt'
      );
    }
  }

  private generateFilename(originalName: string, prefix: string): string {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const extension = path.extname(originalName);
    const baseName = path.basename(originalName, extension);
    
    // Sanitize filename
    const sanitizedBaseName = baseName.replace(/[^a-zA-Z0-9-_]/g, '_');
    
    return `${prefix}_${timestamp}_${randomString}_${sanitizedBaseName}${extension}`;
  }

  private getMimeTypeFromFilename(filename: string): string {
    const extension = path.extname(filename).toLowerCase();
    
    switch (extension) {
      case '.pdf':
        return 'application/pdf';
      case '.doc':
        return 'application/msword';
      case '.docx':
        return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      case '.txt':
        return 'text/plain';
      default:
        return 'application/octet-stream';
    }
  }
}
