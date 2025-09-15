import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HtmlSanitizerUtil } from '../common/utils/html-sanitizer.util';
import { LoggerService } from '../common/services/logger.service';

@Injectable()
export class EmailService {
  constructor(
    private configService: ConfigService,
    private logger: LoggerService,
  ) {
    const username = this.configService.get('MAIL_USERNAME');
    const password = this.configService.get('MAIL_PASSWORD');

    if (username && password) {
      this.logger.log(
        'Gmail SMTP credentials configured successfully',
        'EmailService',
      );
    } else {
      this.logger.warn(
        'Gmail SMTP credentials not configured, emails will be logged only',
        'EmailService',
      );
    }
  }

  async sendApplicationSubmitted(
    candidateEmail: string,
    candidateName: string,
    jobTitle: string,
    company: string = 'Our Company',
  ) {
    const emailContent = this.getApplicationSubmittedTemplate(
      candidateName,
      jobTitle,
      company,
    );
    return this.sendEmail(
      candidateEmail,
      emailContent.subject,
      emailContent.html,
    );
  }

  async sendStatusUpdate(
    candidateEmail: string,
    candidateName: string,
    jobTitle: string,
    status: string,
    notes?: string,
  ) {
    const emailContent = this.getStatusUpdateTemplate(
      candidateName,
      jobTitle,
      status,
      notes,
    );
    return this.sendEmail(
      candidateEmail,
      emailContent.subject,
      emailContent.html,
    );
  }

  async sendInterviewScheduled(
    candidateEmail: string,
    candidateName: string,
    jobTitle: string,
    scheduledAt: Date,
    mode: string,
    notes?: string,
  ) {
    const emailContent = this.getInterviewScheduledTemplate(
      candidateName,
      jobTitle,
      scheduledAt,
      mode,
      notes,
    );
    return this.sendEmail(
      candidateEmail,
      emailContent.subject,
      emailContent.html,
    );
  }

  async sendScreeningResults(
    recruiterEmail: string,
    recruiterName: string,
    candidateName: string,
    jobTitle: string,
    fitScore: number,
    skillMatch: number,
    experienceMatch: boolean,
  ) {
    const emailContent = this.getScreeningResultsTemplate(
      recruiterName,
      candidateName,
      jobTitle,
      fitScore,
      skillMatch,
      experienceMatch,
    );
    return this.sendEmail(
      recruiterEmail,
      emailContent.subject,
      emailContent.html,
    );
  }

  async sendVerificationEmail(email: string, name: string, token: string) {
    const emailContent = this.getVerificationEmailTemplate(name, token);
    return this.sendEmail(email, emailContent.subject, emailContent.html);
  }

  private async sendEmail(to: string, subject: string, html: string) {
    try {
      const username = this.configService.get('MAIL_USERNAME');
      const password = this.configService.get('MAIL_PASSWORD');

      if (!username || !password) {
        // Log email instead of sending when credentials not configured
        this.logger.log(
          `📧 [DEMO MODE] Email would be sent to: ${to}`,
          'EmailService',
        );
        this.logger.log(`📧 [DEMO MODE] Subject: ${subject}`, 'EmailService');
        this.logger.log(
          `📧 [DEMO MODE] Content preview: ${html.substring(0, 200)}...`,
          'EmailService',
        );
        return { success: true, messageId: 'demo-' + Date.now() };
      }

      // Try to dynamically import and use nodemailer if available
      try {
        const nodemailer = await eval('import("nodemailer")');
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: username,
            pass: password,
          },
        });

        const result = await transporter.sendMail({
          from: username,
          to,
          subject,
          html,
        });

        this.logger.log(
          `✅ Email sent successfully via Gmail SMTP: ${result.messageId}`,
          'EmailService',
        );
        return { success: true, messageId: result.messageId };
      } catch (nodemailerError) {
        this.logger.error(
          '❌ Nodemailer not available or failed',
          nodemailerError instanceof Error
            ? nodemailerError.message
            : String(nodemailerError),
          'EmailService',
        );

        // Fallback to logging
        this.logger.log(
          `📧 [FALLBACK] Email would be sent to: ${to}`,
          'EmailService',
        );
        this.logger.log(`📧 [FALLBACK] Subject: ${subject}`, 'EmailService');
        return {
          success: true,
          messageId: 'fallback-' + Date.now(),
          fallback: true,
        };
      }
    } catch (error: unknown) {
      this.logger.error(
        '❌ Email service error',
        error instanceof Error ? error.stack : String(error),
        'EmailService',
      );
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      return { success: false, error: errorMessage };
    }
  }

  private getApplicationSubmittedTemplate(
    candidateName: string,
    jobTitle: string,
    company: string,
  ) {
    const safeName = HtmlSanitizerUtil.escapeHtml(
      candidateName?.substring(0, 100) || '',
    );
    const safeTitle = HtmlSanitizerUtil.escapeHtml(
      jobTitle?.substring(0, 200) || '',
    );
    const safeCompany = HtmlSanitizerUtil.escapeHtml(
      company?.substring(0, 100) || '',
    );

    return {
      subject: `Application Submitted: ${safeTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Application Submitted Successfully! 🎉</h2>
          <p>Dear <strong>${safeName}</strong>,</p>
          <p>Your application for <strong style="color: #2563eb;">${safeTitle}</strong> has been received successfully.</p>
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Application Details:</strong></p>
            <p>Job Title: ${safeTitle}</p>
            <p>Company: ${safeCompany}</p>
            <p>Applied On: ${new Date().toLocaleDateString()}</p>
          </div>
          <p>We will review your application and contact you within 3-5 business days.</p>
          <p>Best regards,<br><strong>AI Hiring Team</strong></p>
        </div>
      `,
    };
  }

  private getStatusUpdateTemplate(
    candidateName: string,
    jobTitle: string,
    status: string,
    notes?: string,
  ) {
    return {
      subject: `Application Update: ${HtmlSanitizerUtil.escapeHtml(jobTitle)} - ${HtmlSanitizerUtil.escapeHtml(status)}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: ${this.getStatusColor(status)};">Application Status Updated</h2>
          <p>Dear <strong>${HtmlSanitizerUtil.escapeHtml(candidateName)}</strong>,</p>
          <p>Your application for <strong style="color: #2563eb;">${HtmlSanitizerUtil.escapeHtml(jobTitle)}</strong> has been updated.</p>
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>New Status:</strong> <span style="color: ${this.getStatusColor(status)}; font-weight: bold;">${HtmlSanitizerUtil.escapeHtml(status)}</span></p>
            <p><strong>Updated On:</strong> ${new Date().toLocaleDateString()}</p>
            ${notes ? `<p><strong>Notes:</strong> ${HtmlSanitizerUtil.escapeHtml(notes)}</p>` : ''}
          </div>
          <p>Best regards,<br><strong>AI Hiring Team</strong></p>
        </div>
      `,
    };
  }

  private getInterviewScheduledTemplate(
    candidateName: string,
    jobTitle: string,
    scheduledAt: Date,
    mode: string,
    notes?: string,
  ) {
    return {
      subject: `Interview Scheduled: ${HtmlSanitizerUtil.escapeHtml(jobTitle)}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #059669;">Interview Scheduled 📅</h2>
          <p>Dear <strong>${HtmlSanitizerUtil.escapeHtml(candidateName)}</strong>,</p>
          <p>We're pleased to invite you for an interview for the position of <strong style="color: #2563eb;">${HtmlSanitizerUtil.escapeHtml(jobTitle)}</strong>.</p>
          <div style="background-color: #ecfdf5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Interview Details:</strong></p>
            <p>Date & Time: <strong>${scheduledAt.toLocaleString()}</strong></p>
            <p>Mode: <strong>${HtmlSanitizerUtil.escapeHtml(mode)}</strong></p>
            <p>Duration: Approximately 45-60 minutes</p>
            ${notes ? `<p><strong>Additional Notes:</strong> ${HtmlSanitizerUtil.escapeHtml(notes)}</p>` : ''}
          </div>
          <p>Please ensure you have a stable internet connection if it's a virtual interview.</p>
          <p>Best regards,<br><strong>AI Hiring Team</strong></p>
        </div>
      `,
    };
  }

  private getScreeningResultsTemplate(
    recruiterName: string,
    candidateName: string,
    jobTitle: string,
    fitScore: number,
    skillMatch: number,
    experienceMatch: boolean,
  ) {
    return {
      subject: `Screening Results: ${HtmlSanitizerUtil.escapeHtml(jobTitle)}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #7c3aed;">Screening Results Available</h2>
          <p>Dear <strong>${HtmlSanitizerUtil.escapeHtml(recruiterName)}</strong>,</p>
          <p>The AI screening results for <strong>${HtmlSanitizerUtil.escapeHtml(candidateName)}</strong>'s application to <strong>${HtmlSanitizerUtil.escapeHtml(jobTitle)}</strong> are ready.</p>
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

  private getVerificationEmailTemplate(name: string, token: string) {
    const safeName = HtmlSanitizerUtil.escapeHtml(
      name?.substring(0, 100) || '',
    );
    const safeToken = HtmlSanitizerUtil.escapeHtml(token);
    const verificationUrl = `https://ai-hiring-frontend.fly.dev/verify-email?token=${safeToken}`;

    return {
      subject: 'Verify Your Email - AI Hiring Platform',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin: 0;">🚀 AI Hiring Platform</h1>
          </div>
          <h2 style="color: #1f2937;">Welcome ${safeName}! 🎉</h2>
          <p>Thank you for registering with AI Hiring Platform. To complete your registration, please verify your email address.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Verify Email Address</a>
          </div>
          <p style="color: #6b7280; font-size: 14px;">If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="color: #2563eb; word-break: break-all; font-size: 14px;">${verificationUrl}</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 12px; text-align: center;">This verification link will expire in 24 hours. If you didn't create an account, please ignore this email.</p>
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
    return colors[status as keyof typeof colors] || '#6b7280';
  }
}
