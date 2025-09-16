import { Module } from '@nestjs/common';
import { InterviewsService } from './interviews.service';
import { InterviewsController } from './interviews.controller';
import { InterviewSchedulingService } from './interview-scheduling.service';
import { InterviewSchedulingController } from './interview-scheduling.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [PrismaModule, EmailModule],
  controllers: [InterviewsController, InterviewSchedulingController],
  providers: [InterviewsService, InterviewSchedulingService],
})
export class InterviewsModule {}
