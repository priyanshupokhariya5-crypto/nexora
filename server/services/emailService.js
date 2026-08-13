const { Resend } = require('resend');

const sendWelcomeEmail = async (email) => {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.NEWSLETTER_FROM || 'Nexora <onboarding@resend.dev>';

  console.log(`[NEWSLETTER EMAIL CONFIG] Email Provider API Key Configured: ${Boolean(apiKey)} | Sender: ${fromEmail}`);

  if (!apiKey) {
    console.log(`[NEWSLETTER EMAIL WARNING] RESEND_API_KEY is not set in environment variables.`);
    return { 
      success: false, 
      emailSent: false,
      reason: 'RESEND_API_KEY_MISSING',
      message: 'Subscriber saved to MongoDB, but email dispatch requires RESEND_API_KEY on the server.'
    };
  }

  try {
    const resend = new Resend(apiKey);
    const response = await resend.emails.send({
      from: fromEmail,
      to: [email],
      subject: 'Welcome to Nexora Product Updates',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1e293b; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px;">
          <div style="margin-bottom: 20px;">
            <h2 style="margin: 0; font-size: 24px; font-weight: 800; color: #2563eb; font-family: sans-serif;">Nexora</h2>
          </div>
          <h3 style="font-size: 18px; font-weight: 700; color: #0f172a; margin-top: 0;">Welcome to Nexora!</h3>
          <p style="font-size: 14px; line-height: 1.6; color: #475569;">
            Thanks for subscribing to Nexora Product Updates.
          </p>
          <p style="font-size: 14px; line-height: 1.6; color: #475569;">
            You'll receive updates about new templates, features, product improvements and important Nexora announcements.
          </p>
          <p style="font-size: 14px; line-height: 1.6; color: #475569; margin-top: 24px;">
            Thanks,<br/>
            <strong>Nexora Team</strong>
          </p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0 16px 0;" />
          <p style="font-size: 11px; color: #94a3b8; text-align: center;">
            © 2026 Nexora Platform Inc. All rights reserved.
          </p>
        </div>
      `
    });

    if (response.error) {
      console.error(`[NEWSLETTER EMAIL ERROR] Resend returned error for ${email}:`, response.error);
      return { 
        success: false, 
        emailSent: false,
        error: response.error.message || response.error,
        message: "You're subscribed, but we couldn't send the confirmation email right now." 
      };
    }

    const messageId = response.data?.id || response.id;
    console.log(`[NEWSLETTER EMAIL SENT SUCCESS] Email dispatched to ${email} | Resend Message ID: ${messageId}`);

    return { 
      success: true, 
      emailSent: true,
      id: messageId,
      message: "You're subscribed! Check your inbox for a confirmation email." 
    };
  } catch (error) {
    console.error(`[NEWSLETTER EMAIL EXCEPTION] Exception sending email to ${email}:`, error.message || error);
    return { 
      success: false, 
      emailSent: false,
      error: error.message || String(error),
      message: "You're subscribed, but we couldn't send the confirmation email right now." 
    };
  }
};

module.exports = { sendWelcomeEmail };
