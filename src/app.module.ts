import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { JobsModule } from './jobs/jobs.module';
import { CandidatesModule } from './candidates/candidates.module';
import { ApplicationsModule } from './applications/applications.module';
import { ScreeningModule } from './screening/screening.module';
import { InterviewsModule } from './interviews/interviews.module';
import { EmailModule } from './email/email.module';
import { AiModule } from './ai/ai.module';
import { UploadsModule } from './uploads/uploads.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: config.get('THROTTLE_TTL', 60000),
          limit: config.get('THROTTLE_LIMIT', 10),
        },
      ],
    }),
    ClientsModule.registerAsync([
      {
        name: 'ML_SERVICE',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('ML_SERVICE_HOST', 'localhost'),
            port: configService.get('ML_SERVICE_PORT', 8000),
          },
        }),
        inject: [ConfigService],
      },
      {
        name: 'EMAIL_SERVICE',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('EMAIL_SERVICE_HOST', 'localhost'),
            port: configService.get('EMAIL_SERVICE_PORT', 3002),
          },
        }),
        inject: [ConfigService],
      },
    ]),
    PrismaModule,
    EmailModule,
    AiModule,
    AuthModule,
    UsersModule,
    JobsModule,
    CandidatesModule,
    ApplicationsModule,
    ScreeningModule,
    InterviewsModule,
    UploadsModule,
    NotificationsModule,
  ],
})
export class AppModule {}
