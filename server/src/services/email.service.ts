import nodemailer from 'nodemailer';
import { config } from '../config/env.js';
import { Inquiry } from '../types/index.js';

/**
 * Reusable HTML escaping function to prevent HTML/script injection in email templates.
 * Escapes &, <, >, ", and '.
 */
export function escapeHtml(value: unknown): string {
  if (value === null || value === undefined) return '';
  const str = typeof value === 'string' ? value : String(value);
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null;
  private isConfigured = false;

  constructor() {
    if (config.email.smtpHost && config.email.smtpUser && config.email.smtpPassword) {
      try {
        this.transporter = nodemailer.createTransport({
          host: config.email.smtpHost,
          port: config.email.smtpPort,
          secure: config.email.smtpPort === 465,
          auth: {
            user: config.email.smtpUser,
            pass: config.email.smtpPassword,
          },
        });
        this.isConfigured = true;
      } catch (err: any) {
        console.error('[EmailService] Failed to initialize SMTP transporter:', err?.message || 'Initialization error');
      }
    }
  }

  async sendClientConfirmation(inquiry: Inquiry): Promise<void> {
    const safeName = escapeHtml(inquiry.name);
    const safeCompany = inquiry.company ? escapeHtml(inquiry.company) : '';
    const safeBudget = escapeHtml(inquiry.budget);
    const safeTimeline = escapeHtml(inquiry.timeline);
    const safeId = escapeHtml(inquiry.id.slice(-6));
    const safeServices = inquiry.services && inquiry.services.length > 0
      ? inquiry.services.map((s) => escapeHtml(s)).join(', ')
      : 'Custom Consultation';

    const plainServices = inquiry.services && inquiry.services.length > 0
      ? inquiry.services.join(', ')
      : 'Custom Consultation';

    const subject = `NexGen Studio: Project Inquiry Received [${safeId}]`;

    const html = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #070a13; color: #f8fafc; padding: 32px; border-radius: 16px; border: 1px solid #1e2b45;">
        <div style="margin-bottom: 24px;">
          <span style="font-size: 24px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">NexGen</span>
          <span style="font-size: 11px; background-color: rgba(6, 182, 212, 0.15); color: #22d3ee; padding: 3px 8px; border-radius: 4px; font-family: monospace; margin-left: 8px;">STUDIO</span>
        </div>

        <h2 style="color: #ffffff; font-size: 20px; font-weight: 700; margin-bottom: 16px;">
          Thank you for reaching out, ${safeName}.
        </h2>

        <p style="color: #94a3b8; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
          We have received your project details. At NexGen, you work directly with a senior full-stack engineer and designer—never through junior account managers. We are reviewing your brief and will respond with a preliminary scope assessment and timeline within <strong>12 business hours</strong>.
        </p>

        <div style="background-color: #0d1322; border: 1px solid #1e2b45; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <h3 style="color: #22d3ee; font-size: 13px; font-family: monospace; text-transform: uppercase; margin-top: 0; margin-bottom: 12px;">Submitted Project Scope</h3>
          <table style="width: 100%; font-size: 13px; color: #cbd5e1; line-height: 1.8;">
            <tr><td style="color: #64748b; width: 120px;">Services:</td><td><strong>${safeServices}</strong></td></tr>
            <tr><td style="color: #64748b;">Target Budget:</td><td>${safeBudget}</td></tr>
            <tr><td style="color: #64748b;">Timeline:</td><td>${safeTimeline}</td></tr>
            ${safeCompany ? `<tr><td style="color: #64748b;">Company:</td><td>${safeCompany}</td></tr>` : ''}
          </table>
        </div>

        <p style="color: #64748b; font-size: 12px; margin-top: 32px; border-top: 1px solid #1e2b45; padding-top: 16px;">
          Need urgent coordination? Reply directly to this email or reach us at <a href="mailto:${escapeHtml(config.email.agencyNotificationEmail)}" style="color: #22d3ee;">${escapeHtml(config.email.agencyNotificationEmail)}</a>.
        </p>
      </div>
    `;

    const text = `
Thank you for reaching out, ${inquiry.name}.

We have received your project details. At NexGen, you work directly with a senior full-stack engineer and designer. We are reviewing your brief and will respond with a preliminary scope assessment and timeline within 12 business hours.

Submitted Project Scope:
- Services: ${plainServices}
- Target Budget: ${inquiry.budget}
- Timeline: ${inquiry.timeline}
${inquiry.company ? `- Company: ${inquiry.company}\n` : ''}

Contact: ${config.email.agencyNotificationEmail}
    `.trim();

    if (this.transporter && this.isConfigured) {
      try {
        await this.transporter.sendMail({
          from: config.email.fromEmail,
          to: inquiry.email,
          subject,
          text,
          html,
        });
      } catch (error: any) {
        console.error('[EmailService] Failed to send client confirmation email:', error?.message || 'SMTP delivery error');
      }
    } else if (config.isProduction) {
      console.warn(`[EmailService:Notice] SMTP not configured. Client confirmation not dispatched for inquiry ${inquiry.id}`);
    } else {
      console.log(`[EmailService:Dev] Client confirmation queued for ${inquiry.email} (Inquiry: ${inquiry.id})`);
    }
  }

  async sendAgencyTeamNotification(inquiry: Inquiry): Promise<void> {
    const safeName = escapeHtml(inquiry.name);
    const safeCompany = inquiry.company ? escapeHtml(inquiry.company) : 'Direct Founder';
    const safeBudget = escapeHtml(inquiry.budget);
    const safeTimeline = escapeHtml(inquiry.timeline);
    const safeMessage = escapeHtml(inquiry.message);
    const safeEmail = escapeHtml(inquiry.email);
    const safeServices = inquiry.services && inquiry.services.length > 0
      ? inquiry.services.map((s) => escapeHtml(s)).join(', ')
      : 'Custom Consultation';

    const plainServices = inquiry.services && inquiry.services.length > 0
      ? inquiry.services.join(', ')
      : 'Custom Consultation';

    const subject = `🔥 New Lead: ${inquiry.name} (${inquiry.company || 'Direct'}) — ${inquiry.budget}`;

    const html = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #070a13; color: #f8fafc; padding: 24px; border-radius: 12px; border: 1px solid #1e2b45;">
        <h2 style="color: #22d3ee; font-size: 18px; margin-top: 0;">New Inbound Client Lead</h2>
        <table style="width: 100%; font-size: 13px; color: #cbd5e1; line-height: 1.8;">
          <tr><td style="color: #64748b; width: 120px;">Name:</td><td><strong>${safeName}</strong></td></tr>
          <tr><td style="color: #64748b;">Email:</td><td><a href="mailto:${safeEmail}" style="color: #22d3ee;">${safeEmail}</a></td></tr>
          <tr><td style="color: #64748b;">Company:</td><td>${safeCompany}</td></tr>
          <tr><td style="color: #64748b;">Services:</td><td>${safeServices}</td></tr>
          <tr><td style="color: #64748b;">Budget:</td><td><strong>${safeBudget}</strong></td></tr>
          <tr><td style="color: #64748b;">Timeline:</td><td>${safeTimeline}</td></tr>
        </table>
        <div style="margin-top: 16px; padding: 12px; background-color: #0d1322; border-radius: 8px; border: 1px solid #1e2b45;">
          <div style="color: #64748b; font-size: 11px; text-transform: uppercase; font-family: monospace; margin-bottom: 6px;">Project Brief:</div>
          <div style="color: #f1f5f9; font-size: 13px; white-space: pre-wrap; line-height: 1.5;">${safeMessage}</div>
        </div>
      </div>
    `;

    const text = `
NEW LEAD SUBMITTED:
- Name: ${inquiry.name}
- Email: ${inquiry.email}
- Company: ${inquiry.company || 'N/A'}
- Services: ${plainServices}
- Budget: ${inquiry.budget}
- Timeline: ${inquiry.timeline}
- Message:
${inquiry.message}
    `.trim();

    if (this.transporter && this.isConfigured && config.email.agencyNotificationEmail) {
      try {
        await this.transporter.sendMail({
          from: config.email.fromEmail,
          to: config.email.agencyNotificationEmail,
          subject,
          text,
          html,
        });
      } catch (error: any) {
        console.error('[EmailService] Failed to send agency team notification:', error?.message || 'SMTP delivery error');
      }
    } else if (config.isProduction) {
      console.warn(`[EmailService:Notice] SMTP not configured. Team notification not dispatched for inquiry ${inquiry.id}`);
    } else {
      console.log(`[EmailService:Dev] Team notification queued for new lead ${inquiry.name} (${inquiry.email})`);
    }
  }
}

export const emailService = new EmailService();


