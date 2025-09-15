import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ApplicationStatus, UserRole } from '@prisma/client';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getDashboardMetrics(period: string = '30d') {
    const periodDays = this.parsePeriod(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - periodDays);

    // Get basic counts
    const [totalJobs, totalApplications, totalCandidates, totalInterviews] = await Promise.all([
      this.prisma.job.count({
        where: {
          createdAt: {
            gte: startDate,
          },
        },
      }),
      this.prisma.application.count({
        where: {
          createdAt: {
            gte: startDate,
          },
        },
      }),
      this.prisma.user.count({
        where: {
          role: UserRole.CANDIDATE,
          createdAt: {
            gte: startDate,
          },
        },
      }),
      this.prisma.interview.count({
        where: {
          createdAt: {
            gte: startDate,
          },
        },
      }),
    ]);

    // Get application status breakdown
    const applicationsByStatus = await this.prisma.application.groupBy({
      by: ['status'],
      _count: {
        status: true,
      },
      where: {
        createdAt: {
          gte: startDate,
        },
      },
    });

    // Get screening success rate
    const screenedApplications = await this.prisma.application.count({
      where: {
        status: {
          in: [ApplicationStatus.ACCEPTED, ApplicationStatus.REJECTED],
        },
        createdAt: {
          gte: startDate,
        },
      },
    });

    const acceptedApplications = await this.prisma.application.count({
      where: {
        status: ApplicationStatus.ACCEPTED,
        createdAt: {
          gte: startDate,
        },
      },
    });

    const screeningSuccessRate = screenedApplications > 0 ? (acceptedApplications / screenedApplications) * 100 : 0;

    // Get average fit score from screening results
    const avgFitScore = await this.prisma.screeningResult.aggregate({
      _avg: {
        fitScore: true,
      },
      where: {
        createdAt: {
          gte: startDate,
        },
      },
    });

    // Get top skills from job requirements
    const topSkills = await this.prisma.job.findMany({
      select: {
        skills: true,
      },
      where: {
        createdAt: {
          gte: startDate,
        },
      },
    });

    const skillCounts = this.aggregateSkills(topSkills);

    return {
      totalJobs,
      totalApplications,
      totalCandidates,
      totalInterviews,
      applicationsByStatus: applicationsByStatus.reduce((acc, item) => {
        acc[item.status] = item._count.status;
        return acc;
      }, {} as Record<string, number>),
      screeningSuccessRate: Math.round(screeningSuccessRate * 100) / 100,
      averageFitScore: avgFitScore._avg.fitScore ? Math.round(avgFitScore._avg.fitScore * 100) / 100 : 0,
      topSkills: skillCounts.slice(0, 10),
      period,
    };
  }

  async getHiringFunnelReport() {
    const funnelData = await this.prisma.application.groupBy({
      by: ['status'],
      _count: {
        status: true,
      },
    });

    const totalApplications = funnelData.reduce((sum, item) => sum + item._count.status, 0);

    const funnel = funnelData.map(item => ({
      stage: item.status,
      count: item._count.status,
      percentage: totalApplications > 0 ? Math.round((item._count.status / totalApplications) * 100) : 0,
    }));

    return {
      totalApplications,
      funnel,
      conversionRates: this.calculateConversionRates(funnel),
    };
  }

  async getJobAnalytics(jobId: string) {
    const job = await this.prisma.job.findUnique({
      where: { id: jobId },
      include: {
        applications: {
          include: {
            screeningResults: true,
          },
        },
      },
    });

    if (!job) {
      throw new Error('Job not found');
    }

    const totalApplications = job.applications.length;
    const screenedApplications = job.applications.filter(app => app.screeningResults.length > 0);
    const avgFitScore = screenedApplications.length > 0 
      ? screenedApplications.reduce((sum, app) => {
          const latestResult = app.screeningResults[app.screeningResults.length - 1];
          return sum + (latestResult?.fitScore || 0);
        }, 0) / screenedApplications.length
      : 0;

    return {
      jobId,
      jobTitle: job.title,
      totalApplications,
      screenedApplications: screenedApplications.length,
      averageFitScore: Math.round(avgFitScore * 100) / 100,
      applicationsByStatus: job.applications.reduce((acc, app) => {
        acc[app.status] = (acc[app.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    };
  }

  async getUserActivityAnalytics(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        applications: true,
        interviews: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return {
      userId,
      userName: user.fullName || 'Unknown User',
      role: user.role,
      totalApplications: user.applications?.length || 0,
      totalInterviews: user.interviews?.length || 0,
      applicationsByStatus: user.applications?.reduce((acc, app) => {
        acc[app.status] = (acc[app.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {},
      joinedAt: user.createdAt,
    };
  }

  private parsePeriod(period: string): number {
    const match = period.match(/^(\d+)([dwmy])$/);
    if (!match) return 30; // default to 30 days

    const [, num, unit] = match;
    const value = parseInt(num);

    switch (unit) {
      case 'd': return value;
      case 'w': return value * 7;
      case 'm': return value * 30;
      case 'y': return value * 365;
      default: return 30;
    }
  }

  private aggregateSkills(jobs: { skills: string[] }[]): { skill: string; count: number }[] {
    const skillMap = new Map<string, number>();

    jobs.forEach(job => {
      job.skills.forEach(skill => {
        const normalizedSkill = skill.toLowerCase().trim();
        skillMap.set(normalizedSkill, (skillMap.get(normalizedSkill) || 0) + 1);
      });
    });

    return Array.from(skillMap.entries())
      .map(([skill, count]) => ({ skill, count }))
      .sort((a, b) => b.count - a.count);
  }

  private calculateConversionRates(funnel: { stage: string; count: number }[]): Record<string, number> {
    const rates: Record<string, number> = {};
    
    for (let i = 1; i < funnel.length; i++) {
      const current = funnel[i];
      const previous = funnel[i - 1];
      
      if (previous.count > 0) {
        rates[`${previous.stage}_to_${current.stage}`] = 
          Math.round((current.count / previous.count) * 100);
      }
    }

    return rates;
  }
}