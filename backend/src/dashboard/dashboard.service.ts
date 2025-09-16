import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getAdminDashboard() {
    const [
      totalUsers,
      totalJobs,
      totalApplications,
      recentUsers,
      activeInterviews,
      pendingApplications,
      monthlyStats,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.job.count(),
      this.prisma.application.count(),
      this.prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          fullName: true,
          role: true,
          createdAt: true,
        },
      }),
      this.prisma.interview.count({
        where: {
          scheduledAt: {
            gte: new Date(),
          },
        },
      }),
      this.prisma.application.count({
        where: {
          status: 'PENDING',
        },
      }),
      this.getMonthlyStats(),
    ]);

    const usersByRole = await this.prisma.user.groupBy({
      by: ['role'],
      _count: { role: true },
    });

    const roleStats = usersByRole.reduce((acc, curr) => {
      acc[curr.role] = curr._count.role;
      return acc;
    }, {});

    return {
      totalUsers,
      recruiters: roleStats['RECRUITER'] || 0,
      candidates: roleStats['CANDIDATE'] || 0,
      totalJobs,
      totalApplications,
      systemUptime: this.calculateUptime(),
      activeInterviews,
      pendingApprovals: pendingApplications,
      monthlyRevenue: monthlyStats.revenue,
      storageUsed: await this.calculateStorageUsage(),
      recentUsers,
    };
  }

  async getRecruiterDashboard(userId: string) {
    const [
      myJobs,
      totalApplications,
      recentApplications,
      interviewsScheduled,
      candidatesHired,
      pendingReviews,
    ] = await Promise.all([
      this.prisma.job.findMany({
        where: { createdBy: userId },
        include: { _count: { select: { applications: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.application.count({
        where: { job: { createdBy: userId } },
      }),
      this.prisma.application.findMany({
        where: { job: { createdBy: userId } },
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          job: { select: { title: true } },
          candidate: { select: { name: true, email: true } },
        },
      }),
      this.prisma.interview.count({
        where: {
          application: { job: { createdBy: userId } },
          scheduledAt: { gte: new Date() },
        },
      }),
      this.prisma.application.count({
        where: {
          job: { createdBy: userId },
          status: 'ACCEPTED',
        },
      }),
      this.prisma.application.count({
        where: {
          job: { createdBy: userId },
          status: 'PENDING',
        },
      }),
    ]);

    const avgTimeToHire = await this.calculateAvgTimeToHire(userId);
    const topSkills = await this.getTopSkillsInDemand(userId);

    return {
      myActiveJobs: myJobs.length,
      totalApplicationsReceived: totalApplications,
      interviewsScheduled,
      candidatesHired,
      avgTimeToHire,
      topSkillsInDemand: topSkills,
      applicationConversionRate: totalApplications > 0 
        ? Math.round((candidatesHired / totalApplications) * 100 * 100) / 100 
        : 0,
      pendingReviews,
      myJobs,
      recentApplications,
    };
  }

  async getCandidateDashboard(userId: string) {
    const [
      myApplications,
      totalApplications,
      recentJobs,
      interviewsScheduled,
      profileViews,
    ] = await Promise.all([
      this.prisma.application.findMany({
        where: { userId: userId },
        include: {
          job: { select: { title: true, description: true } },
          screeningResults: { select: { fitScore: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.application.count({
        where: { userId: userId },
      }),
      this.prisma.job.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: { id: true, title: true, description: true },
      }),
      this.prisma.interview.count({
        where: {
          application: { userId: userId },
          scheduledAt: { gte: new Date() },
        },
      }),
      this.getProfileViews(userId),
    ]);

    const applicationsByStatus = await this.prisma.application.groupBy({
      where: { userId: userId },
      by: ['status'],
      _count: { _all: true },
    });

    const avgFitScore = myApplications.reduce((sum, app) => {
      return sum + (app.screeningResults?.[0]?.fitScore || 0);
    }, 0) / (myApplications.length || 1);

    return {
      applicationsSubmitted: totalApplications,
      interviewsScheduled,
      jobsViewed: await this.getJobsViewedCount(userId),
      profileViews,
      skillMatchScore: Math.round(avgFitScore),
      recommendedJobs: await this.getRecommendedJobsCount(userId),
      applicationResponseRate: this.calculateResponseRate(myApplications),
      lastLoginDays: await this.getLastLoginDays(userId),
      myApplications,
      recentJobs,
      applicationsByStatus: applicationsByStatus.reduce((acc, curr) => {
        acc[curr.status] = curr._count._all;
        return acc;
      }, {}),
    };
  }

  // Helper methods
  private async getMonthlyStats() {
    // Mock implementation - in real app, calculate from actual data
    return { revenue: 125000 };
  }

  private calculateUptime(): string {
    // Mock implementation - in real app, calculate actual uptime
    return '127 days';
  }

  private async calculateStorageUsage(): Promise<number> {
    // Mock implementation - in real app, calculate actual storage usage
    return 78.5;
  }

  private async calculateAvgTimeToHire(userId: string): Promise<number> {
    // Mock implementation - in real app, calculate from actual hire data
    return 18;
  }

  private async getTopSkillsInDemand(userId: string): Promise<string[]> {
    // Mock implementation - in real app, analyze job postings
    return ['JavaScript', 'Python', 'React', 'Node.js'];
  }

  private async getProfileViews(userId: string): Promise<number> {
    // Mock implementation - in real app, track profile views
    return 156;
  }

  private async getJobsViewedCount(userId: string): Promise<number> {
    // Mock implementation - in real app, track job views
    return 89;
  }

  private async getRecommendedJobsCount(userId: string): Promise<number> {
    // Mock implementation - in real app, calculate recommendations
    return 12;
  }

  private calculateResponseRate(applications: any[]): number {
    if (applications.length === 0) return 0;
    const responded = applications.filter(app => app.status !== 'PENDING').length;
    return Math.round((responded / applications.length) * 100);
  }

  private async getLastLoginDays(userId: string): Promise<number> {
    // Mock implementation - in real app, track last login
    return 2;
  }
}
