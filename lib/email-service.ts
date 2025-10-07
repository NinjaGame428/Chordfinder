import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  html: string;
  text: string;
  type: 'welcome' | 'notification' | 'newsletter' | 'promotional';
}

export interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  template_id: string;
  recipient_list: string[];
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed';
  scheduled_at?: string;
  sent_at?: string;
}

export class EmailService {
  static async sendEmail(to: string, subject: string, html: string, text?: string) {
    try {
      const { data, error } = await resend.emails.send({
        from: process.env.NEXT_PUBLIC_EMAIL_FROM || 'noreply@phinaccords.com',
        to: [to],
        subject,
        html,
        text,
      });

      if (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email');
      }

      return data;
    } catch (error) {
      console.error('Email service error:', error);
      throw error;
    }
  }

  static async sendWelcomeEmail(userEmail: string, userName: string) {
    const subject = 'Bienvenue sur PhinAccords!';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Bienvenue sur PhinAccords!</h1>
        <p>Bonjour ${userName},</p>
        <p>Merci de vous être inscrit sur PhinAccords. Vous pouvez maintenant accéder à notre collection d'accords de musique gospel.</p>
        <p>Découvrez nos fonctionnalités :</p>
        <ul>
          <li>Collection d'accords complets</li>
          <li>Ressources d'apprentissage</li>
          <li>Vidéos YouTube intégrées</li>
          <li>Transposition automatique</li>
        </ul>
        <p>Bonne musique!</p>
        <p>L'équipe PhinAccords</p>
      </div>
    `;

    return this.sendEmail(userEmail, subject, html);
  }

  static async sendNotificationEmail(userEmail: string, title: string, message: string) {
    const subject = `Notification PhinAccords: ${title}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">${title}</h2>
        <p>${message}</p>
        <p>Connectez-vous à votre compte pour plus de détails.</p>
        <p>L'équipe PhinAccords</p>
      </div>
    `;

    return this.sendEmail(userEmail, subject, html);
  }

  static async sendNewsletter(recipients: string[], subject: string, content: string) {
    const results = [];
    
    for (const email of recipients) {
      try {
        const result = await this.sendEmail(email, subject, content);
        results.push({ email, success: true, result });
      } catch (error) {
        results.push({ email, success: false, error });
      }
    }

    return results;
  }

  static async sendBulkEmail(campaign: EmailCampaign, template: EmailTemplate) {
    const results = [];
    
    for (const email of campaign.recipient_list) {
      try {
        const personalizedHtml = template.html.replace('{{user_name}}', email.split('@')[0]);
        const result = await this.sendEmail(email, campaign.subject, personalizedHtml);
        results.push({ email, success: true, result });
      } catch (error) {
        results.push({ email, success: false, error });
      }
    }

    return results;
  }
}
