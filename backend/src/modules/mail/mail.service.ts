import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

export interface MailTemplateContext {
  name?: string;
  propertyTitle?: string;
  companyName?: string;
  contactEmail?: string;
  message?: string;
  agentName?: string;
  propertyId?: string;
  [key: string]: any;
}

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  /**
   * Envía correo de confirmación de interés en propiedad
   */
  async sendInterestConfirmation(
    email: string,
    name: string,
    propertyTitle: string,
    message?: string
  ): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Hemos recibido tu interés en la propiedad',
        template: 'interest-confirmation',
        context: {
          name,
          propertyTitle,
          message,
          companyName: 'Real Estate Platform',
          contactEmail: process.env.MAIL_FROM,
          currentYear: new Date().getFullYear(),
        },
      });
      console.log(`✅ Correo de confirmación enviado a ${email} para propiedad: ${propertyTitle}`);
    } catch (error) {
      console.error(`❌ Error enviando correo de confirmación a ${email}:`, error);
      // En desarrollo lanzamos el error para debugging
      if (process.env.NODE_ENV !== 'production') {
        throw error;
      }
      // En producción no lanzamos para no bloquear notificaciones
    }
  }

  /**
   * Envía notificación a administrador/agente sobre nuevo interés
   */
  async sendAdminNotification(
    email: string,
    recipientName: string,
    interestedUserName: string,
    interestedUserEmail: string,
    propertyTitle: string,
    message: string
  ): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: `Nuevo interés en propiedad: ${propertyTitle}`,
        template: 'admin-notification',
        context: {
          recipientName,
          interestedUserName,
          interestedUserEmail,
          propertyTitle,
          message,
          companyName: 'Real Estate Platform',
          currentYear: new Date().getFullYear(),
        },
      });
      console.log(`✅ Notificación enviada a administrador ${email}`);
    } catch (error) {
      console.error(`❌ Error enviando notificación a administrador ${email}:`, error);
      // En desarrollo lanzamos el error para debugging
      if (process.env.NODE_ENV !== 'production') {
        throw error;
      }
    }
  }

  /**
   * Método de prueba para verificar envío de correos (SOLO DESARROLLO)
   */
  async testEmail(email: string): Promise<{ success: boolean; message: string }> {
    try {
      console.log(`🧪 Testing email send to: ${email}`);

      await this.mailerService.sendMail({
        to: email,
        subject: 'Test Email - Real Estate Platform',
        template: 'interest-confirmation',
        context: {
          name: 'Usuario de Prueba',
          propertyTitle: 'Propiedad de Prueba',
          message: 'Este es un mensaje de prueba para verificar el funcionamiento del sistema de correos.',
          companyName: 'Real Estate Platform',
          contactEmail: process.env.MAIL_FROM,
          currentYear: new Date().getFullYear(),
        },
      });

      console.log(`✅ Test email sent successfully to ${email}`);
      return { success: true, message: `Correo enviado exitosamente a ${email}` };
    } catch (error) {
      console.error(`❌ Test email failed for ${email}:`, error);
      return { success: false, message: `Error enviando correo: ${error.message}` };
    }
  }
}