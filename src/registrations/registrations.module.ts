import { Module } from '@nestjs/common';
import { RegistrationsService } from './registrations.service';
import { RegistrationsController } from './registrations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Registrations } from './registrations.entity';
import { Events } from 'src/events/events.entity';
import { Attendees } from 'src/attendees/attendees.entity';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    EmailModule,
    TypeOrmModule.forFeature([Registrations, Events, Attendees]),
  ],
  providers: [RegistrationsService],
  controllers: [RegistrationsController],
})
export class RegistrationsModule {}
