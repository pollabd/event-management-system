import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Registrations } from './registrations.entity';
import { Events } from 'src/events/events.entity';
import { Attendees } from 'src/attendees/attendees.entity';
import { EmailService } from '../email/email.service';

@Injectable()
export class RegistrationsService {
  constructor(
    @InjectRepository(Registrations)
    private readonly registrationRepository: Repository<Registrations>,

    @InjectRepository(Events)
    private readonly eventRepository: Repository<Events>,

    @InjectRepository(Attendees)
    private readonly attendeeRepository: Repository<Attendees>,

    private readonly emailService: EmailService,
  ) {}

  async registerAttendee(
    eventId: string,
    attendeeId: string,
  ): Promise<Registrations> {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
    });
    if (!event) {
      throw new NotFoundException(`Event with ID ${eventId} not found.`);
    }

    const attendee = await this.attendeeRepository.findOne({
      where: { id: attendeeId },
    });
    if (!attendee) {
      throw new NotFoundException(`Attendee with ID ${attendeeId} not found.`);
    }

    const existingRegistration = await this.registrationRepository.findOne({
      where: {
        event: { id: eventId },
        attendee: { id: attendeeId },
      },
    });
    if (existingRegistration) {
      throw new BadRequestException(
        'Attendee is already registered for this event.',
      );
    }

    const totalRegistrations = await this.registrationRepository.count({
      where: { event: { id: eventId } },
    });
    if (totalRegistrations >= event.maxAttendees) {
      throw new BadRequestException(
        'Event registration limit has been reached.',
      );
    }

    const registration = this.registrationRepository.create({
      event,
      attendee,
    });

    await this.emailService.sendEmail({
      from: 'pollabrock@gmail.com',
      to: attendee.email,
      subject: 'Event Registration Confirmation',
      text: `Hello, ${attendee.name}! \n\nThank you for registering for ${event.name}. We look forward to seeing you there.`,
      html: '<h1>Your Event Registration Successful</h1>',
    });

    return this.registrationRepository.save(registration);
  }

  async cancelRegistration(eventId: string, attendeeId: string): Promise<void> {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
    });
    if (!event) {
      throw new NotFoundException(`Event with ID ${eventId} not found.`);
    }

    const attendee = await this.attendeeRepository.findOne({
      where: { id: attendeeId },
    });
    if (!attendee) {
      throw new NotFoundException(`Attendee with ID ${attendeeId} not found.`);
    }

    const registration = await this.registrationRepository.findOne({
      where: {
        event: { id: eventId },
        attendee: { id: attendeeId },
      },
    });

    if (!registration) {
      throw new BadRequestException(
        `Attendee with ID ${attendeeId} is not registered for the event.`,
      );
    }

    await this.registrationRepository.remove(registration);
  }

  async listRegistrationsForEvent(eventId: string): Promise<Registrations[]> {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
    });
    if (!event) {
      throw new NotFoundException(`Event with ID ${eventId} not found.`);
    }

    return this.registrationRepository.find({
      where: { event: { id: eventId } },
      relations: ['attendee'],
    });
  }
}
