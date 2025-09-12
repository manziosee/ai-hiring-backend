const nodemailer = require('nodemailer');

async function testEmail() {
  try {
    // Create transporter
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: 'manziosee3@gmail.com',
        pass: 'Niyongira@2001',
      },
    });

    // Send test email
    const result = await transporter.sendMail({
      from: 'manziosee3@gmail.com',
      to: 'manziosee3@gmail.com',
      subject: 'Test Email from AI Hiring Platform',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Email Service Test 🚀</h2>
          <p>This is a test email to verify Gmail SMTP configuration.</p>
          <p>If you receive this, the email service is working correctly!</p>
          <p>Best regards,<br><strong>AI Hiring Platform</strong></p>
        </div>
      `,
    });

    console.log('✅ Email sent successfully!');
    console.log('Message ID:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('❌ Email failed:', error.message);
    return { success: false, error: error.message };
  }
}

testEmail();