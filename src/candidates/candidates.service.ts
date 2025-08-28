import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCandidateDto } from './dto/create-candidate.dto';

@Injectable()
export class CandidatesService {
  constructor(private prisma: PrismaService) {}

  async create(createCandidateDto: CreateCandidateDto, userId: string) {
    return this.prisma.candidate.create({
      data: {
        ...createCandidateDto,
        userId,
      },
    });
  }

  async findAll() {
    return this.prisma.candidate.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const candidate = await this.prisma.candidate.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
        applications: {
          include: {
            job: {
              select: {
                id: true,
                title: true,
                description: true,
              },
            },
          },
        },
      },
    });

    if (!candidate) {
      throw new NotFoundException('Candidate not found');
    }

    return candidate;
  }

  async findByUserId(userId: string) {
    return this.prisma.candidate.findUnique({
      where: { userId },
    });
  }
}