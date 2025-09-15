import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getAdminDashboard() {
    const [totalUsers, totalJobs, totalApplications, recentUsers] =
      await Promise.all([
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
      ]);

    const usersByRole = await this.prisma.user.groupBy({
      by: ['role'],
      _count: { role: true },
    });

    return {
      stats: {
        totalUsers,
        totalJobs,
        totalApplications,
        usersByRole: usersByRole.reduce((acc, curr) => {
          acc[curr.role] = curr._count.role;
          return acc;
        }, {}),
      },
      recentUsers,
    };
  }

  async getRecruiterDashboard(userId: string) {
    const [myJobs, totalApplications, recentApplications] = await Promise.all([
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
    ]);

    return {
      stats: {
        totalJobs: myJobs.length,
        totalApplications,
        avgApplicationsPerJob:
          myJobs.length > 0 ? Math.round(totalApplications / myJobs.length) : 0,
      },
      myJobs,
      recentApplications,
    };
  }

  async getCandidateDashboard(userId: string) {
    const [myApplications, totalApplications, recentJobs] = await Promise.all([
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
    ]);

    const applicationsByStatus = await this.prisma.application.groupBy({
      where: { userId: userId },
      by: ['status'],
      _count: { _all: true },
    });

    return {
      stats: {
        totalApplications,
        applicationsByStatus: applicationsByStatus.reduce((acc, curr) => {
          acc[curr.status] = curr._count._all;
          return acc;
        }, {}),
      },
      myApplications,
      recentJobs,
    };
  }
}
