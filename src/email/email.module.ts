import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { EmailProcessor } from './email.processor';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailService } from './email.service';

@Module({
  imports: [
    ConfigModule,
    BullModule.registerQueue({
      name: 'emailSending',
    }),
    MailerModule.forRoot({
      transport: {
        host: 'sandbox.smtp.mailtrap.io',
        port: 2525,
        auth: {
          user: 'a59ec1115a7611',
          pass: '102a6e321cc675',
        },
      },
      defaults: {
        from: '"No Reply" <noreply@example.com>',
      },
    }),
  ],
  providers: [EmailProcessor, EmailService],
  exports: [EmailService],
})
export class EmailModule {}
