import { Injectable } from '@nestjs/common';
import { LoggerService } from '../common/services/logger.service';

@Injectable()
export class NotificationsService {
  constructor(private readonly logger: LoggerService) {}

  async sendNotification(
    userId: string,
    message: string,
    type: string = 'info',
  ) {
    // Sanitize inputs to prevent log injection
    const sanitizedUserId = userId.replace(/[\r\n\t]/g, '_');
    const sanitizedMessage = message.replace(/[\r\n\t]/g, '_');
    const sanitizedType = type.replace(/[\r\n\t]/g, '_');
    
    this.logger.log(
      `Notification sent - User: ${sanitizedUserId}, Type: ${sanitizedType}, Message: ${sanitizedMessage}`,
      'NotificationsService'
    );
  }

  async sendApplicationUpdate(
    userId: string,
    applicationId: string,
    status: string,
  ) {
    await this.sendNotification(
      userId,
      `Your application ${applicationId} status has been updated to ${status}`,
      'application_update',
    );
  }

  async sendInterviewScheduled(userId: string, interviewDetails: any) {
    await this.sendNotification(
      userId,
      `Interview scheduled for ${interviewDetails.scheduledAt}`,
      'interview_scheduled',
    );
  }
}
