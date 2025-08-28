import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { ScreeningService } from './screening.service';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { ApplicationStatus, UserRole } from '@prisma/client';
import { of, throwError } from 'rxjs';

describe('ScreeningService', () => {
  let service: ScreeningService;
  let prismaService: jest.Mocked<PrismaService>;
  let emailService: jest.Mocked<EmailService>;
  let mlClient: jest.Mocked<ClientProxy>;
  let configService: jest.Mocked<ConfigService>;

  const mockApplication = {
    id: '1',
    jobId: '1',
    candidateId: '1',
    status: ApplicationStatus.PENDING,
    coverLetter: 'Cover letter content',
    job: {
      id: '1',
      title: 'Software Engineer',
      description: 'Job description',
      skills: ['JavaScript', 'TypeScript'],
      experience: 3,
      creator: {
        id: '1',
        email: 'recruiter@example.com',
        fullName: 'Recruiter Name',
      },
    },
    candidate: {
      id: '1',
      name: 'John Doe',
      skills: ['JavaScript', 'React'],
      yearsExp: 2,
      resumeUrl: 'https://example.com/resume.pdf',
      user: {
        id: '2',
        email: 'candidate@example.com',
        fullName: 'John Doe',
      },
    },
  };

  const mockMLResult = {
    fitScore: 0.85,
    details: {
      skillSimilarity: 0.8,
      experienceMatch: 0.7,
      overallMatch: 0.85,
    },
  };

  const mockScreeningResult = {
    id: '1',
    applicationId: '1',
    stage: 'AI_SCREENING',
    fitScore: 0.85,
    details: mockMLResult.details,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScreeningService,
        {
          provide: PrismaService,
          useValue: {
            application: {
              findUnique: jest.fn(),
            },
            screeningResult: {
              create: jest.fn(),
              findMany: jest.fn(),
            },
          },
        },
        {
          provide: EmailService,
          useValue: {
            sendScreeningResults: jest.fn(),
          },
        },
        {
          provide: 'ML_SERVICE',
          useValue: {
            send: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ScreeningService>(ScreeningService);
    prismaService = module.get(PrismaService);
    emailService = module.get(EmailService);
    mlClient = module.get('ML_SERVICE');
    configService = module.get(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('runScreening', () => {
    it('should successfully run AI screening', async () => {
      prismaService.application.findUnique
        .mockResolvedValueOnce(mockApplication)
        .mockResolvedValueOnce(mockApplication);
      mlClient.send.mockReturnValue(of(mockMLResult));
      prismaService.screeningResult.create.mockResolvedValue(mockScreeningResult);
      emailService.sendScreeningResults.mockResolvedValue(undefined);

      const result = await service.runScreening('1');

      expect(prismaService.application.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: {
          job: true,
          candidate: {
            include: {
              user: true,
            },
          },
        },
      });
      expect(mlClient.send).toHaveBeenCalledWith('screen_application', {
        job: {
          title: mockApplication.job.title,
          description: mockApplication.job.description,
          skills: mockApplication.job.skills,
          experience: mockApplication.job.experience,
        },
        candidate: {
          resumeUrl: mockApplication.candidate.resumeUrl,
          skills: mockApplication.candidate.skills,
          yearsExp: mockApplication.candidate.yearsExp,
        },
        coverLetter: mockApplication.coverLetter,
      });
      expect(prismaService.screeningResult.create).toHaveBeenCalledWith({
        data: {
          applicationId: '1',
          stage: 'AI_SCREENING',
          fitScore: mockMLResult.fitScore,
          details: mockMLResult.details,
        },
      });
      expect(result).toEqual(mockScreeningResult);
    });

    it('should throw NotFoundException if application not found', async () => {
      prismaService.application.findUnique.mockResolvedValue(null);

      await expect(service.runScreening('1')).rejects.toThrow(NotFoundException);
      expect(mlClient.send).not.toHaveBeenCalled();
    });

    it('should fallback to basic screening if ML service fails', async () => {
      const basicScreeningResult = {
        ...mockScreeningResult,
        stage: 'BASIC_SCREENING',
        fitScore: 0.65,
        details: {
          jobSkills: mockApplication.job.skills,
          candidateSkills: mockApplication.candidate.skills,
          experienceMatch: false,
          skillMatch: 0.5,
          note: 'ML service unavailable, using basic screening',
        },
      };

      prismaService.application.findUnique.mockResolvedValue(mockApplication);
      mlClient.send.mockReturnValue(throwError(() => new Error('ML service down')));
      prismaService.screeningResult.create.mockResolvedValue(basicScreeningResult);

      const result = await service.runScreening('1');

      expect(prismaService.screeningResult.create).toHaveBeenCalledWith({
        data: {
          applicationId: '1',
          stage: 'BASIC_SCREENING',
          fitScore: 0.65,
          details: {
            jobSkills: mockApplication.job.skills,
            candidateSkills: mockApplication.candidate.skills,
            experienceMatch: false,
            skillMatch: 0.5,
            note: 'ML service unavailable, using basic screening',
          },
        },
      });
      expect(result).toEqual(basicScreeningResult);
    });
  });

  describe('getScreeningResults', () => {
    it('should return screening results for an application', async () => {
      const screeningResults = [mockScreeningResult];
      prismaService.screeningResult.findMany.mockResolvedValue(screeningResults);

      const result = await service.getScreeningResults('1');

      expect(prismaService.screeningResult.findMany).toHaveBeenCalledWith({
        where: { applicationId: '1' },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(screeningResults);
    });

    it('should return empty array if no results found', async () => {
      prismaService.screeningResult.findMany.mockResolvedValue([]);

      const result = await service.getScreeningResults('1');

      expect(result).toEqual([]);
    });
  });

  describe('calculateFitScore', () => {
    it('should calculate correct fit score for qualified candidate', () => {
      const job = {
        skills: ['JavaScript', 'TypeScript'],
        experience: 2,
      };
      const candidate = {
        skills: ['JavaScript', 'TypeScript', 'React'],
        yearsExp: 3,
      };

      const score = service['calculateFitScore'](job, candidate);

      expect(score).toBe(1.0); // 0.5 base + 0.3 experience + 0.5 skill match (100%)
    });

    it('should calculate lower score for underqualified candidate', () => {
      const job = {
        skills: ['JavaScript', 'TypeScript', 'Node.js'],
        experience: 5,
      };
      const candidate = {
        skills: ['JavaScript'],
        yearsExp: 2,
      };

      const score = service['calculateFitScore'](job, candidate);

      expect(score).toBeCloseTo(0.67, 1); // 0.5 base + 0 experience + 0.33 skill match (1/3)
    });
  });

  describe('calculateSkillMatch', () => {
    it('should return 1.0 for perfect skill match', () => {
      const jobSkills = ['JavaScript', 'TypeScript'];
      const candidateSkills = ['JavaScript', 'TypeScript', 'React'];

      const match = service['calculateSkillMatch'](jobSkills, candidateSkills);

      expect(match).toBe(1.0);
    });

    it('should return 0.5 for partial skill match', () => {
      const jobSkills = ['JavaScript', 'TypeScript'];
      const candidateSkills = ['JavaScript', 'Python'];

      const match = service['calculateSkillMatch'](jobSkills, candidateSkills);

      expect(match).toBe(0.5);
    });

    it('should return 0 for no skill match', () => {
      const jobSkills = ['JavaScript', 'TypeScript'];
      const candidateSkills = ['Python', 'Java'];

      const match = service['calculateSkillMatch'](jobSkills, candidateSkills);

      expect(match).toBe(0);
    });
  });
});
