import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient().$extends(withAccelerate()) as any;
  }

  async onModuleInit() {
    await this.prisma.$connect();
  }

  async onModuleDestroy() {
    await this.prisma.$disconnect();
  }

  // Proxy all Prisma methods
  get user() {
    return this.prisma.user;
  }
  get job() {
    return this.prisma.job;
  }
  get candidate() {
    return this.prisma.candidate;
  }
  get application() {
    return this.prisma.application;
  }
  get screeningResult() {
    return this.prisma.screeningResult;
  }
  get interview() {
    return this.prisma.interview;
  }
  get auditLog() {
    return (this.prisma as any).auditLog;
  }

  // Proxy utility methods
  get $connect() {
    return this.prisma.$connect.bind(this.prisma);
  }
  get $disconnect() {
    return this.prisma.$disconnect.bind(this.prisma);
  }
  get $queryRaw() {
    return this.prisma.$queryRaw.bind(this.prisma);
  }
  get $executeRaw() {
    return this.prisma.$executeRaw.bind(this.prisma);
  }
  get $transaction() {
    return this.prisma.$transaction.bind(this.prisma);
  }
}
