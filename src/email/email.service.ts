import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Mail } from 'src/interface/job'; // Assuming you have a Mail interface

@Injectable()
export class EmailService {
  constructor(@InjectQueue('emailSending') private emailQueue: Queue) {}

  async sendEmail(mailData: Mail) {
    await this.emailQueue.add('sendEmail', mailData);
  }
}
