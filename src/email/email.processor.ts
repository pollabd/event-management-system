import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer'; // Import MailerService

@Processor('emailSending')
@Injectable()
export class EmailProcessor {
  constructor(private readonly mailerService: MailerService) {}

  @Process('sendEmail')
  async sendEmail(job: Job) {
    const { to, subject, text, html } = job.data;

    try {
      await this.mailerService.sendMail({ to, subject, text, html });
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
}
