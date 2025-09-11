import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { ApplicationStatus } from '@prisma/client';
import { EmailService } from '../email/email.service';

@Injectable()
export class ApplicationsService {
  constructor(
    private prisma: PrismaService,
    @Inject(EmailService) private emailService: EmailService,
  ) {}

  async create(
    createApplicationDto: CreateApplicationDto,
    candidateId: string,
  ) {
    // Get candidate to find userId
    const candidate = await this.prisma.candidate.findUnique({
      where: { id: candidateId },
      include: { user: true },
    });

    if (!candidate) {
      throw new NotFoundException('Candidate not found');
    }

    const existingApplication = await this.prisma.application.findUnique({
      where: {
        jobId_candidateId: {
          jobId: createApplicationDto.jobId,
          candidateId,
        },
      },
    });

    if (existingApplication) {
      throw new ForbiddenException('You have already applied for this job');
    }

    const application = await this.prisma.application.create({
      data: {
        ...createApplicationDto,
        candidateId,
        userId: candidate.userId,
      },
      include: {
        job: true,
        candidate: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
              },
            },
          },
        },
      },
    });

    // Send email notification using job data from application
    if (candidate && application.job) {
      this.emailService
        .sendApplicationSubmitted(
          candidate.user.email,
          candidate.name,
          application.job.title,
          'Company Name', // Placeholder for company name
        )
        .catch(console.error);
    }

    return application;
  }

  async findByJobId(jobId: string, userId: string) {
    // Combined query to check job ownership and get applications
    const applications = await this.prisma.application.findMany({
      where: { 
        jobId,
        job: {
          createdBy: userId
        }
      },
      include: {
        candidate: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
              },
            },
          },
        },
        job: {
          select: {
            id: true,
            title: true,
            createdBy: true
          }
        },
        screeningResults: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
    });

    // If no applications found, check if job exists
    if (applications.length === 0) {
      const job = await this.prisma.job.findUnique({
        where: { id: jobId },
        select: { id: true, createdBy: true }
      });
      
      if (!job) {
        throw new NotFoundException('Job not found');
      }
      
      if (job.createdBy !== userId) {
        throw new ForbiddenException(
          'You can only view applications for your own jobs',
        );
      }
    }

    return applications;
  }

  async findOne(id: string, userId: string) {
    const application = await this.prisma.application.findUnique({
      where: { id },
      include: {
        candidate: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
              },
            },
          },
        },
        job: true,
        screeningResults: true,
      },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    // Check if user has access to this application
    if (application.userId !== userId && application.job.createdBy !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return application;
  }

  async findUserApplications(userId: string) {
    return this.prisma.application.findMany({
      where: { userId },
      include: {
        job: true,
        screeningResults: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByCandidate(candidateId: string) {
    return this.prisma.application.findMany({
      where: { candidateId },
      include: {
        job: true,
        screeningResults: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
    });
  }

  async updateStatus(id: string, status: ApplicationStatus, userId: string) {
    const application = await this.prisma.application.findUnique({
      where: { id },
      include: {
        job: true,
      },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    if (application.job.createdBy !== userId) {
      throw new ForbiddenException(
        'You can only update applications for your own jobs',
      );
    }

    const updatedApplication = await this.prisma.application.update({
      where: { id },
      data: { status },
      include: {
        candidate: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
              },
            },
          },
        },
        job: true,
      },
    });

    // Send status update email using candidate data from updatedApplication
    if (updatedApplication.candidate) {
      this.emailService
        .sendStatusUpdate(
          updatedApplication.candidate.user.email,
          updatedApplication.candidate.name,
          updatedApplication.job.title,
          status,
        )
        .catch(console.error);
    }

    return updatedApplication;
  }
}
