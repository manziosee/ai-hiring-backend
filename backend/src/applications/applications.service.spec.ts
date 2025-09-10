import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { ApplicationStatus } from '@prisma/client';
import {
  createMockPrismaService,
  MockPrismaService,
} from '../test/prisma-mock';

describe('ApplicationsService', () => {
  let service: ApplicationsService;
  let prismaService: MockPrismaService;
  let emailService: any;

  const mockJob = {
    id: '1',
    title: 'Software Engineer',
    description: 'Job description',
    skills: ['JavaScript', 'TypeScript'],
    experience: 3,
    creatorId: '1',
    createdAt: new Date(),
    updatedAt: new Date(),
    creator: {
      id: '1',
      email: 'recruiter@example.com',
      fullName: 'Recruiter Name',
      role: 'RECRUITER',
    },
  };

  const mockCandidate = {
    id: '1',
    userId: '2',
    name: 'John Doe',
    skills: ['JavaScript', 'React'],
    yearsExp: 2,
    resumeUrl: 'https://example.com/resume.pdf',
    user: {
      id: '2',
      email: 'candidate@example.com',
      fullName: 'John Doe',
      role: 'CANDIDATE',
    },
  };

  const mockApplication = {
    id: '1',
    jobId: '1',
    candidateId: '1',
    status: ApplicationStatus.SUBMITTED,
    coverLetter: 'Cover letter content',
    createdAt: new Date(),
    updatedAt: new Date(),
    job: mockJob,
    candidate: mockCandidate,
  };

  beforeEach(async () => {
    prismaService = createMockPrismaService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApplicationsService,
        {
          provide: PrismaService,
          useValue: prismaService,
        },
        {
          provide: EmailService,
          useValue: {
            sendApplicationConfirmation: jest.fn(),
            sendApplicationNotification: jest.fn(),
            sendApplicationStatusUpdate: jest.fn(),
            sendScreeningResults: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ApplicationsService>(ApplicationsService);
    emailService = module.get<EmailService>(
      EmailService,
    ) as jest.Mocked<EmailService>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const createApplicationDto = {
      jobId: '1',
      candidateId: '1',
      coverLetter: 'Cover letter content',
    };

    it('should successfully create an application', async () => {
      prismaService.job.findUnique.mockResolvedValue(mockJob);
      prismaService.candidate.findUnique.mockResolvedValue(mockCandidate);
      prismaService.application.create.mockResolvedValue(mockApplication);
      // Mock email service methods (these don't exist in the actual service)
      emailService.sendApplicationConfirmation = jest
        .fn()
        .mockResolvedValue(undefined);
      emailService.sendApplicationNotification = jest
        .fn()
        .mockResolvedValue(undefined);

      const result = await service.create(createApplicationDto, '1');

      expect(prismaService.job.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: { creator: true },
      });
      expect(prismaService.candidate.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: { user: true },
      });
      expect(prismaService.application.create).toHaveBeenCalledWith({
        data: {
          jobId: '1',
          candidateId: '1',
          userId: '2',
          coverLetter: 'Cover letter content',
          status: ApplicationStatus.SUBMITTED,
        },
        include: {
          job: { include: { creator: true } },
          candidate: { include: { user: true } },
        },
      });
      expect(result).toEqual(mockApplication);
    });

    it('should throw NotFoundException if job not found', async () => {
      prismaService.job.findUnique.mockResolvedValue(null);

      await expect(service.create(createApplicationDto, '1')).rejects.toThrow(
        NotFoundException,
      );
      expect(prismaService.candidate.findUnique).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if candidate not found', async () => {
      prismaService.job.findUnique.mockResolvedValue(mockJob);
      prismaService.candidate.findUnique.mockResolvedValue(null);

      await expect(service.create(createApplicationDto, '1')).rejects.toThrow(
        NotFoundException,
      );
      expect(prismaService.application.create).not.toHaveBeenCalled();
    });
  });

  describe('findByJob', () => {
    it('should return applications for a specific job', async () => {
      const applications = [mockApplication];
      prismaService.application.findMany.mockResolvedValue(applications);

      const result = await service.findByJobId('1', 'user1');

      expect(prismaService.application.findMany).toHaveBeenCalledWith({
        where: { jobId: '1' },
        include: {
          candidate: { include: { user: true } },
          job: true,
        },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(applications);
    });
  });

  describe('findByCandidate', () => {
    it('should return applications for a specific candidate', async () => {
      const applications = [mockApplication];
      prismaService.application.findMany.mockResolvedValue(applications);

      const result = await service.findByCandidate('1');

      expect(prismaService.application.findMany).toHaveBeenCalledWith({
        where: { candidateId: '1' },
        include: {
          job: { include: { creator: true } },
          candidate: true,
        },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(applications);
    });
  });

  describe('updateStatus', () => {
    it('should successfully update application status', async () => {
      const updatedApplication = {
        ...mockApplication,
        status: ApplicationStatus.OFFER,
      };

      prismaService.application.findUnique.mockResolvedValue(mockApplication);
      prismaService.application.update.mockResolvedValue(updatedApplication);
      emailService.sendApplicationStatusUpdate = jest
        .fn()
        .mockResolvedValue(undefined);

      const result = await service.updateStatus(
        '1',
        ApplicationStatus.OFFER,
        'user1',
      );

      expect(prismaService.application.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: {
          job: { include: { creator: true } },
          candidate: { include: { user: true } },
        },
      });
      expect(prismaService.application.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { status: ApplicationStatus.OFFER },
        include: {
          job: { include: { creator: true } },
          candidate: { include: { user: true } },
        },
      });
      expect(result).toEqual(updatedApplication);
    });

    it('should throw NotFoundException if application not found', async () => {
      prismaService.application.findUnique.mockResolvedValue(null);

      await expect(
        service.updateStatus('1', ApplicationStatus.OFFER, 'user1'),
      ).rejects.toThrow(NotFoundException);
      expect(prismaService.application.update).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException for invalid status transition', async () => {
      const rejectedApplication = {
        ...mockApplication,
        status: ApplicationStatus.REJECTED,
      };
      prismaService.application.findUnique.mockResolvedValue(
        rejectedApplication,
      );

      await expect(
        service.updateStatus('1', ApplicationStatus.OFFER, 'user1'),
      ).rejects.toThrow(BadRequestException);
      expect(prismaService.application.update).not.toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return application when found', async () => {
      prismaService.application.findUnique.mockResolvedValue(mockApplication);

      const result = await service.findOne('1');

      expect(prismaService.application.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: {
          job: { include: { creator: true } },
          candidate: { include: { user: true } },
        },
      });
      expect(result).toEqual(mockApplication);
    });

    it('should throw NotFoundException when application not found', async () => {
      prismaService.application.findUnique.mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });
});
