import { Module } from '@nestjs/common';
import { AuditService } from './audit.service';
import { PrismaModule } from '../prisma/prisma.module';
import { LoggerService } from '../common/services/logger.service';

@Module({
  imports: [PrismaModule],
  providers: [AuditService, LoggerService],
  exports: [AuditService],
})
export class AuditModule {}