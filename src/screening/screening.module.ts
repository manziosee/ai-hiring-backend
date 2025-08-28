import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScreeningService } from './screening.service';
import { ScreeningController } from './screening.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    PrismaModule, 
    EmailModule,
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
    ]),
  ],
  controllers: [ScreeningController],
  providers: [ScreeningService],
})
export class ScreeningModule {}