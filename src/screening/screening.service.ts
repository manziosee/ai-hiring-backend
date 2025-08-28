import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { EmailService } from '../email/email.service';

@Injectable()
export class ScreeningService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    @Inject('ML_SERVICE') private mlClient: ClientProxy,
    @Inject(EmailService) private emailService: EmailService,
  ) {}

  async runScreening(applicationId: string) {
    const application = await this.prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        job: true,
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

      // Send email to recruiter
      const application = await this.prisma.application.findUnique({
        where: { id: applicationId },
        include: {
          job: { include: { creator: true } },
          candidate: true,
        },
      });

      if (application && application.job.creator) {
        this.emailService.sendScreeningResults(
          application.job.creator.email,
          application.job.creator.fullName,
          application.candidate.name,
          application.job.title,
          mlResult.fitScore,
          mlResult.details.skillSimilarity,
          mlResult.details.experienceMatch
        ).catch(console.error);
      }

      return screeningResult;
    } catch (error) {
      // Fallback to basic screening if ML service is down
      return this.runBasicScreening(application);
    }
  }

  private async runBasicScreening(application: any) {
    const fitScore = this.calculateFitScore(application.job, application.candidate);

    return this.prisma.screeningResult.create({
      data: {
        applicationId: application.id,
        stage: 'BASIC_SCREENING',
        fitScore,
        details: {
          jobSkills: application.job.skills,
          candidateSkills: application.candidate.skills,
          experienceMatch: application.candidate.yearsExp >= application.job.experience,
          skillMatch: this.calculateSkillMatch(application.job.skills, application.candidate.skills),
          note: 'ML service unavailable, using basic screening',
        },
      },
    });
  }

  private calculateFitScore(job: any, candidate: any): number {
    // Basic scoring logic
    let score = 0.5;
    if (candidate.yearsExp >= job.experience) score += 0.3;
    score += this.calculateSkillMatch(job.skills, candidate.skills) * 0.5;
    return Math.min(score, 1.0);
  }

  private calculateSkillMatch(jobSkills: string[], candidateSkills: string[]): number {
    const matchedSkills = jobSkills.filter(skill =>
      candidateSkills.some(candidateSkill =>
        candidateSkill.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(candidateSkill.toLowerCase())
      )
    );
    return matchedSkills.length / jobSkills.length;
  }

  async getScreeningResults(applicationId: string) {
    return this.prisma.screeningResult.findMany({
      where: { applicationId },
      orderBy: { createdAt: 'desc' },
    });
  }
}