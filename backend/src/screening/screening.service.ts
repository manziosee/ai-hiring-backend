import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { EmailService } from '../email/email.service';
import { LoggerService } from '../common/services/logger.service';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class ScreeningService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    @Inject('ML_SERVICE') private mlClient: ClientProxy,
    private emailService: EmailService,
    private logger: LoggerService,
    private auditService: AuditService,
  ) {}

  async runScreening(applicationId: string, userId?: string) {
    // Optimized query - get all needed data in one call
    const application = await this.prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        job: {
          include: {
            creator: true, // Include creator for email notification
          },
        },
        candidate: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    // Send to ML service for processing
    const screeningData = {
      job: {
        title: application.job.title,
        description: application.job.description,
        skills: application.job.skills,
        experience: application.job.experience,
      },
      candidate: {
        resumeUrl: application.candidate.resumeUrl,
        skills: application.candidate.skills,
        yearsExp: application.candidate.yearsExp,
      },
      coverLetter: application.coverLetter,
    };

    try {
      const mlResult = await firstValueFrom(
        this.mlClient.send('screen_application', screeningData),
      );

      const screeningResult = await this.prisma.screeningResult.create({
        data: {
          applicationId,
          stage: 'AI_SCREENING',
          fitScore: mlResult.fitScore,
          details: mlResult.details,
        },
      });

      // Log audit trail
      if (userId) {
        await this.auditService.log({
          userId,
          action: 'RUN_SCREENING',
          resource: 'application',
          resourceId: applicationId,
          metadata: { fitScore: mlResult.fitScore },
        });
      }

      // Send email to recruiter (non-blocking)
      if (application.job.creator) {
        this.emailService
          .sendScreeningResults(
            application.job.creator.email,
            application.job.creator.fullName,
            application.candidate.name,
            application.job.title,
            mlResult.fitScore,
            mlResult.details.skillSimilarity,
            mlResult.details.experienceMatch,
          )
          .catch((error) => {
            this.logger.error('Failed to send screening results email', error.stack, 'ScreeningService');
          });
      }

      return screeningResult;
    } catch (error) {
      this.logger.error('ML service screening failed, falling back to basic screening', error.stack, 'ScreeningService');
      return this.runBasicScreening(application);
    }
  }

  private async runBasicScreening(application: any) {
    const fitScore = this.calculateFitScore(
      application.job,
      application.candidate,
    );

    return this.prisma.screeningResult.create({
      data: {
        applicationId: application.id,
        stage: 'BASIC_SCREENING',
        fitScore,
        details: {
          jobSkills: application.job.skills,
          candidateSkills: application.candidate.skills,
          experienceMatch:
            application.candidate.yearsExp >= application.job.experience,
          skillMatch: this.calculateSkillMatch(
            application.job.skills,
            application.candidate.skills,
          ),
          note: 'ML service unavailable, using basic screening',
        },
      },
    });
  }

  // Scoring constants for maintainability
  private static readonly SCORING_WEIGHTS = {
    BASE_SCORE: 0.5,
    EXPERIENCE_WEIGHT: 0.3,
    SKILL_WEIGHT: 0.5,
    MAX_SCORE: 1.0
  };

  private calculateFitScore(job: any, candidate: any): number {
    let score = ScreeningService.SCORING_WEIGHTS.BASE_SCORE;
    
    // Experience match bonus
    if (candidate.yearsExp >= job.experience) {
      score += ScreeningService.SCORING_WEIGHTS.EXPERIENCE_WEIGHT;
    }
    
    // Skill match contribution
    const skillMatch = this.calculateSkillMatch(job.skills, candidate.skills);
    score += skillMatch * ScreeningService.SCORING_WEIGHTS.SKILL_WEIGHT;
    
    return Math.min(score, ScreeningService.SCORING_WEIGHTS.MAX_SCORE);
  }

  private calculateSkillMatch(
    jobSkills: string[],
    candidateSkills: string[],
  ): number {
    if (!jobSkills.length) return 1; // No requirements = perfect match
    
    // Pre-process skills to lowercase for efficient comparison
    const jobSkillsLower = jobSkills.map(skill => skill.toLowerCase());
    const candidateSkillsLower = candidateSkills.map(skill => skill.toLowerCase());
    
    const matchedSkills = jobSkillsLower.filter((skill) =>
      candidateSkillsLower.some((candidateSkill) =>
        candidateSkill.includes(skill) || skill.includes(candidateSkill)
      ),
    );
    
    return matchedSkills.length / jobSkills.length;
  }

  async getScreeningResults(applicationId: string) {
    return this.prisma.screeningResult.findMany({
      where: { applicationId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getJobScreeningResults(jobId: string) {
    return this.prisma.screeningResult.findMany({
      where: {
        application: {
          jobId
        }
      },
      include: {
        application: {
          include: {
            candidate: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
