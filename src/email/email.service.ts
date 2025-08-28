import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private resend: Resend;

  constructor(private configService: ConfigService) {
    this.resend = new Resend(this.configService.get('RESEND_API_KEY'));
  }

  async sendApplicationSubmitted(candidateEmail: string, candidateName: string, jobTitle: string, company: string = 'Our Company') {
    const emailContent = this.getApplicationSubmittedTemplate(candidateName, jobTitle, company);
    return this.sendEmail(candidateEmail, emailContent.subject, emailContent.html);
  }

  async sendStatusUpdate(candidateEmail: string, candidateName: string, jobTitle: string, status: string, notes?: string) {
    const emailContent = this.getStatusUpdateTemplate(candidateName, jobTitle, status, notes);
    return this.sendEmail(candidateEmail, emailContent.subject, emailContent.html);
  }

  async sendInterviewScheduled(candidateEmail: string, candidateName: string, jobTitle: string, scheduledAt: Date, mode: string, notes?: string) {
    const emailContent = this.getInterviewScheduledTemplate(candidateName, jobTitle, scheduledAt, mode, notes);
    return this.sendEmail(candidateEmail, emailContent.subject, emailContent.html);
  }

  async sendScreeningResults(recruiterEmail: string, recruiterName: string, candidateName: string, jobTitle: string, fitScore: number, skillMatch: number, experienceMatch: boolean) {
    const emailContent = this.getScreeningResultsTemplate(recruiterName, candidateName, jobTitle, fitScore, skillMatch, experienceMatch);
    return this.sendEmail(recruiterEmail, emailContent.subject, emailContent.html);
  }

  private async sendEmail(to: string, subject: string, html: string) {
    try {
      const result = await this.resend.emails.send({
        from: this.configService.get('EMAIL_FROM') || 'AI Hiring Platform <noreply@yourdomain.com>',
        to: [to],
        subject,
        html,
      });
      
      console.log('Email sent successfully:', result.data?.id);
      return { success: true, messageId: result.data?.id };
    } catch (error) {
      console.error('Failed to send email:', error);
      return { success: false, error: error.message };
    }
  }

  private getApplicationSubmittedTemplate(candidateName: string, jobTitle: string, company: string) {
    return {
      subject: `Application Submitted: ${jobTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Application Submitted Successfully! 🎉</h2>
          <p>Dear <strong>${candidateName}</strong>,</p>
          <p>Your application for <strong style="color: #2563eb;">${jobTitle}</strong> has been received successfully.</p>
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Application Details:</strong></p>
            <p>Job Title: ${jobTitle}</p>
            <p>Company: ${company}</p>
            <p>Applied On: ${new Date().toLocaleDateString()}</p>
          </div>
          <p>We will review your application and contact you within 3-5 business days.</p>
          <p>Best regards,<br><strong>AI Hiring Team</strong></p>
        </div>
      `,
    };
  }

  private getStatusUpdateTemplate(candidateName: string, jobTitle: string, status: string, notes?: string) {
    return {
      subject: `Application Update: ${jobTitle} - ${status}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: ${this.getStatusColor(status)};">Application Status Updated</h2>
          <p>Dear <strong>${candidateName}</strong>,</p>
          <p>Your application for <strong style="color: #2563eb;">${jobTitle}</strong> has been updated.</p>
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>New Status:</strong> <span style="color: ${this.getStatusColor(status)}; font-weight: bold;">${status}</span></p>
            <p><strong>Updated On:</strong> ${new Date().toLocaleDateString()}</p>
            ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ''}
          </div>
          <p>Best regards,<br><strong>AI Hiring Team</strong></p>
        </div>
      `,
    };
  }

  private getInterviewScheduledTemplate(candidateName: string, jobTitle: string, scheduledAt: Date, mode: string, notes?: string) {
    return {
      subject: `Interview Scheduled: ${jobTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #059669;">Interview Scheduled 📅</h2>
          <p>Dear <strong>${candidateName}</strong>,</p>
          <p>We're pleased to invite you for an interview for the position of <strong style="color: #2563eb;">${jobTitle}</strong>.</p>
          <div style="background-color: #ecfdf5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Interview Details:</strong></p>
            <p>Date & Time: <strong>${scheduledAt.toLocaleString()}</strong></p>
            <p>Mode: <strong>${mode}</strong></p>
            <p>Duration: Approximately 45-60 minutes</p>
            ${notes ? `<p><strong>Additional Notes:</strong> ${notes}</p>` : ''}
          </div>
          <p>Please ensure you have a stable internet connection if it's a virtual interview.</p>
          <p>Best regards,<br><strong>AI Hiring Team</strong></p>
        </div>
      `,
    };
  }

  private getScreeningResultsTemplate(recruiterName: string, candidateName: string, jobTitle: string, fitScore: number, skillMatch: number, experienceMatch: boolean) {
    return {
      subject: `Screening Results: ${jobTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #7c3aed;">Screening Results Available</h2>
          <p>Dear <strong>${recruiterName}</strong>,</p>
          <p>The AI screening results for <strong>${candidateName}</strong>'s application to <strong>${jobTitle}</strong> are ready.</p>
          <div style="background-color: #faf5ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Fit Score:</strong> ${(fitScore * 100).toFixed(1)}%</p>
            <p><strong>Skills Match:</strong> ${(skillMatch * 100).toFixed(1)}%</p>
            <p><strong>Experience Match:</strong> ${experienceMatch ? '✅' : '❌'}</p>
          </div>
          <p>You can review the detailed results in your dashboard.</p>
          <p>Best regards,<br><strong>AI Hiring System</strong></p>
        </div>
      `,
    };
  }

  private getStatusColor(status: string): string {
    const colors = {
      SUBMITTED: '#3b82f6',
      SCREENING: '#8b5cf6',
      INTERVIEW: '#f59e0b',
      OFFER: '#10b981',
      REJECTED: '#ef4444',
    };
    return colors[status] || '#6b7280';
  }
}