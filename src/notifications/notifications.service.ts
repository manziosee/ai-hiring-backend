import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationsService {
  async sendNotification(
    userId: string,
    message: string,
    type: string = 'info',
  ) {
    // Placeholder for notification logic
    console.log(`Notification to ${userId}: ${message} (${type})`);
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
