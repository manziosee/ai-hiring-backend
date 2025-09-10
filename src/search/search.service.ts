import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  async searchJobs(query: string, filters: any = {}) {
    return this.prisma.job.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { skills: { hasSome: [query] } },
        ],
        ...filters,
      },
      take: 20,
    });
  }

  async searchCandidates(query: string, skills: string[] = []) {
    return this.prisma.candidate.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { skills: { hasSome: skills } },
        ],
      },
      take: 20,
    });
  }
}