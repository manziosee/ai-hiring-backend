import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInterviewDto } from './dto/create-interview.dto';
import { EmailService } from '../email/email.service';

@Injectable()
export class InterviewsService {
  constructor(
    private prisma: PrismaService,
    @Inject(EmailService) private emailService: EmailService,
  ) {}

  async create(createInterviewDto: CreateInterviewDto, scheduledById: string) {
    const application = await this.prisma.application.findUnique({
      where: { id: createInterviewDto.applicationId },
      include: {
        job: true,
      },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    if (application.job.createdBy !== scheduledById) {
      throw new ForbiddenException(
        'You can only schedule interviews for your own jobs',
      );
    }

    const interview = await this.prisma.interview.create({
      data: {
        ...createInterviewDto,
        scheduledById,
      },
      include: {
        application: {
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
        },
        scheduledBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    // Send interview invitation email
    if (interview.application.candidate.user) {
      this.emailService
        .sendInterviewScheduled(
          interview.application.candidate.user.email,
          interview.application.candidate.name,
          interview.application.job.title,
          new Date(createInterviewDto.scheduledAt),
          createInterviewDto.mode,
          createInterviewDto.notes,
        )
        .catch(console.error);
    }

    return interview;
  }

  async findByApplicationId(applicationId: string, userId: string) {
    const application = await this.prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        job: true,
        candidate: true,
      },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    // Check if user has access to this application
    const isRecruiter = application.job.createdBy === userId;
    const isCandidate = application.candidate.userId === userId;

    if (!isRecruiter && !isCandidate) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.interview.findMany({
      where: { applicationId },
      include: {
        scheduledBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
      orderBy: { scheduledAt: 'desc' },
    });
  }

  async update(id: string, updateData: any, userId: string) {
    const interview = await this.prisma.interview.findUnique({
      where: { id },
      include: {
        application: {
          include: {
            job: true,
          },
        },
      },
    });

    if (!interview) {
      throw new NotFoundException('Interview not found');
    }

    if (interview.application.job.createdBy !== userId) {
      throw new ForbiddenException(
        'You can only update interviews for your own jobs',
      );
    }

    return this.prisma.interview.update({
      where: { id },
      data: updateData,
      include: {
        application: {
          include: {
            candidate: true,
            job: true,
          },
        },
        scheduledBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });
  }

  async remove(id: string, userId: string) {
    const interview = await this.prisma.interview.findUnique({
      where: { id },
      include: {
        application: {
          include: {
            job: true,
          },
        },
      },
    });

    if (!interview) {
      throw new NotFoundException('Interview not found');
    }

    if (interview.application.job.createdBy !== userId) {
      throw new ForbiddenException(
        'You can only cancel interviews for your own jobs',
      );
    }

    return this.prisma.interview.delete({
      where: { id },
    });
  }
}
