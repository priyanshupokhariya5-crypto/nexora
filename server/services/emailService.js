const { Resend } = require('resend');

const sendWelcomeEmail = async (email) => {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.NEWSLETTER_FROM || 'Nexora <onboarding@resend.dev>';

  if (!apiKey) {
    console.log(`[Email Service Warning] RESEND_API_KEY is not set in environment variables. Subscriber saved to MongoDB, but email dispatch skipped.`);
    return { success: false, reason: 'RESEND_API_KEY_MISSING' };
  }

  try {
    const resend = new Resend(apiKey);
    const data = await resend.emails.send({
      from: fromEmail,
      to: [email],
      subject: 'Welcome to Nexora Product Updates',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1e293b; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px;">
          <div style="margin-bottom: 20px;">
            <h2 style="margin: 0; font-size: 24px; font-weight: 800; color: #2563eb; font-family: sans-serif;">Nexora</h2>
          </div>
          <h3 style="font-size: 18px; font-weight: 700; color: #0f172a; margin-top: 0;">Thanks for subscribing to Nexora Product Updates!</h3>
          <p style="font-size: 14px; line-height: 1.6; color: #475569;">
            Hi there,
          </p>
          <p style="font-size: 14px; line-height: 1.6; color: #475569;">
            Thanks for subscribing to Nexora Product Updates. You'll receive updates about:
          </p>
          <ul style="font-size: 14px; line-height: 1.8; color: #334155; padding-left: 20px;">
            <li>New customizable website templates</li>
            <li>New features & visual editor tools</li>
            <li>Product improvements</li>
            <li>Important Nexora announcements</li>
          </ul>
          <p style="font-size: 14px; line-height: 1.6; color: #475569; margin-top: 24px;">
            Thanks,<br/>
            <strong>The Nexora Team</strong>
          </p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0 16px 0;" />
          <p style="font-size: 11px; color: #94a3b8; text-align: center;">
            © 2026 Nexora Platform Inc. All rights reserved.
          </p>
        </div>
      `
    });

    console.log(`[Email Service Success] Welcome email sent to ${email} (ID: ${data?.id || 'OK'})`);
    return { success: true, id: data?.id };
  } catch (error) {
    console.error(`[Email Service Error] Failed to send email to ${email}:`, error.message || error);
    return { success: false, error: error.message };
  }
};

module.exports = { sendWelcomeEmail };
