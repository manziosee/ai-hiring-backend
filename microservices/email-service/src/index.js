const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

// Email transporter with better configuration
const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Email transporter error:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

// Enhanced email templates
const emailTemplates = {
  application_submitted: (data) => ({
    subject: `Application Submitted: ${data.jobTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Application Submitted Successfully! 🎉</h2>
        <p>Dear <strong>${data.candidateName}</strong>,</p>
        <p>Your application for <strong style="color: #2563eb;">${data.jobTitle}</strong> has been received successfully.</p>
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Application Details:</strong></p>
          <p>Job Title: ${data.jobTitle}</p>
          <p>Company: ${data.company || 'Our Company'}</p>
          <p>Applied On: ${new Date().toLocaleDateString()}</p>
        </div>
        <p>We will review your application and contact you within 3-5 business days.</p>
        <p>Best regards,<br><strong>AI Hiring Team</strong></p>
      </div>
    `,
  }),
  application_status_update: (data) => ({
    subject: `Application Update: ${data.jobTitle} - ${data.status}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: ${getStatusColor(data.status)};">Application Status Updated</h2>
        <p>Dear <strong>${data.candidateName}</strong>,</p>
        <p>Your application for <strong style="color: #2563eb;">${data.jobTitle}</strong> has been updated.</p>
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>New Status:</strong> <span style="color: ${getStatusColor(data.status)}; font-weight: bold;">${data.status}</span></p>
          <p><strong>Updated On:</strong> ${new Date().toLocaleDateString()}</p>
          ${data.notes ? `<p><strong>Notes:</strong> ${data.notes}</p>` : ''}
        </div>
        <p>Best regards,<br><strong>AI Hiring Team</strong></p>
      </div>
    `,
  }),
  interview_scheduled: (data) => ({
    subject: `Interview Scheduled: ${data.jobTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #059669;">Interview Scheduled 📅</h2>
        <p>Dear <strong>${data.candidateName}</strong>,</p>
        <p>We're pleased to invite you for an interview for the position of <strong style="color: #2563eb;">${data.jobTitle}</strong>.</p>
        <div style="background-color: #ecfdf5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Interview Details:</strong></p>
          <p>Date & Time: <strong>${new Date(data.scheduledAt).toLocaleString()}</strong></p>
          <p>Mode: <strong>${data.mode}</strong></p>
          <p>Duration: Approximately 45-60 minutes</p>
          ${data.notes ? `<p><strong>Additional Notes:</strong> ${data.notes}</p>` : ''}
        </div>
        <p>Please ensure you have a stable internet connection if it's a virtual interview.</p>
        <p>Best regards,<br><strong>AI Hiring Team</strong></p>
      </div>
    `,
  }),
  screening_completed: (data) => ({
    subject: `Screening Results: ${data.jobTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #7c3aed;">Screening Results Available</h2>
        <p>Dear <strong>${data.recruiterName}</strong>,</p>
        <p>The AI screening results for <strong>${data.candidateName}</strong>'s application to <strong>${data.jobTitle}</strong> are ready.</p>
        <div style="background-color: #faf5ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Fit Score:</strong> ${(data.fitScore * 100).toFixed(1)}%</p>
          <p><strong>Skills Match:</strong> ${(data.skillMatch * 100).toFixed(1)}%</p>
          <p><strong>Experience Match:</strong> ${data.experienceMatch ? '✅' : '❌'}</p>
        </div>
        <p>You can review the detailed results in your dashboard.</p>
        <p>Best regards,<br><strong>AI Hiring System</strong></p>
      </div>
    `,
  }),
};

function getStatusColor(status) {
  const colors = {
    SUBMITTED: '#3b82f6',
    SCREENING: '#8b5cf6',
    INTERVIEW: '#f59e0b',
    OFFER: '#10b981',
    REJECTED: '#ef4444',
  };
  return colors[status] || '#6b7280';
}

// Email sending endpoint
app.post('/send-email', async (req, res) => {
  try {
    const { to, template, data, subject, html } = req.body;

    if (!to) {
      return res.status(400).json({ error: 'Recipient email is required' });
    }

    let emailContent;
    if (template && emailTemplates[template]) {
      emailContent = emailTemplates[template](data);
    } else if (subject && html) {
      emailContent = { subject, html };
    } else {
      return res.status(400).json({ error: 'Valid template or subject/html required' });
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || `"AI Hiring Platform" <${process.env.EMAIL_USER}>`,
      to: Array.isArray(to) ? to.join(',') : to,
      subject: emailContent.subject,
      html: emailContent.html,
    };

    const result = await transporter.sendMail(mailOptions);
    
    console.log('Email sent successfully:', result.messageId);
    
    res.json({ 
      success: true, 
      message: 'Email sent successfully',
      messageId: result.messageId 
    });
  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({ 
      error: 'Failed to send email',
      details: error.message 
    });
  }
});

// Batch email sending
app.post('/send-batch', async (req, res) => {
  try {
    const { emails } = req.body;
    
    if (!Array.isArray(emails)) {
      return res.status(400).json({ error: 'Emails array is required' });
    }

    const results = [];
    for (const email of emails) {
      try {
        const result = await transporter.sendMail({
          from: process.env.EMAIL_FROM || `"AI Hiring Platform" <${process.env.EMAIL_USER}>`,
          ...email,
        });
        results.push({ success: true, messageId: result.messageId, to: email.to });
      } catch (error) {
        results.push({ success: false, error: error.message, to: email.to });
      }
    }

    res.json({ results });
  } catch (error) {
    res.status(500).json({ error: 'Batch sending failed', details: error.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'email-service',
    timestamp: new Date().toISOString(),
    smtpConfigured: !!process.env.EMAIL_USER
  });
});

// Get available templates
app.get('/templates', (req, res) => {
  res.json({
    templates: Object.keys(emailTemplates),
    description: 'Available email templates for the hiring platform'
  });
});

app.listen(PORT, () => {
  console.log(`📧 Email service running on port ${PORT}`);
  console.log(`🏥 Health check available at http://localhost:${PORT}/health`);
});

module.exports = app;