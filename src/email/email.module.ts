import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'EMAIL_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.EMAIL_SERVICE_HOST || 'localhost',
          port: parseInt(process.env.EMAIL_SERVICE_PORT || '3002'),
        },
      },
    ]),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}