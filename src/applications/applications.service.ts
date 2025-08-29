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

    // Send email notification
    const job = await this.prisma.job.findUnique({
      where: { id: createApplicationDto.jobId },
    });

    if (candidate && job) {
      this.emailService
        .sendApplicationSubmitted(
          candidate.user.email,
          candidate.name,
          job.title,
          'Company Name', // Placeholder for company name
        )
        .catch(console.error);
    }

    return application;
  }

  async findByJobId(jobId: string, userId: string) {
    const job = await this.prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    if (job.createdBy !== userId) {
      throw new ForbiddenException(
        'You can only view applications for your own jobs',
      );
    }

    return this.prisma.application.findMany({
      where: { jobId },
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
        screeningResults: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
    });
  }

  async findOne(id: string) {
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

    return application;
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

    // Send status update email
    const candidate = await this.prisma.candidate.findUnique({
      where: { id: application.candidateId },
      include: { user: true },
    });

    if (candidate) {
      this.emailService
        .sendStatusUpdate(
          candidate.user.email,
          candidate.name,
          updatedApplication.job.title,
          status,
        )
        .catch(console.error);
    }

    return updatedApplication;
  }
}
