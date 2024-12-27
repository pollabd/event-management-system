import {
  Controller,
  Post,
  Get,
  Param,
  HttpCode,
  HttpStatus,
  NotFoundException,
  BadRequestException,
  Delete,
} from '@nestjs/common';
import { RegistrationsService } from './registrations.service';
import { Registrations } from './registrations.entity';

@Controller('registrations')
export class RegistrationsController {
  constructor(private readonly registrationsService: RegistrationsService) {}

  @Get('events/:eventId')
  async findByEvent(
    @Param('eventId') eventId: string,
  ): Promise<Registrations[]> {
    try {
      const registrations =
        await this.registrationsService.listRegistrationsForEvent(eventId);
      if (!registrations) {
        throw new NotFoundException(
          `No registrations found for event ${eventId}`,
        );
      }
      return registrations;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new BadRequestException('Unable to retrieve registrations');
    }
  }

  @Post('events/:eventId/attendees/:attendeeId')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Param('eventId') eventId: string,
    @Param('attendeeId') attendeeId: string,
  ): Promise<Registrations> {
    try {
      return await this.registrationsService.registerAttendee(
        eventId,
        attendeeId,
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('Unable to process registration');
    }
  }

  @Delete(':eventId/attendees/:attendeeId/cancel')
  async cancelRegistration(
    @Param('eventId') eventId: string,
    @Param('attendeeId') attendeeId: string,
  ): Promise<void> {
    try {
      await this.registrationsService.cancelRegistration(eventId, attendeeId);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException(
        'An error occurred while canceling the registration.',
      );
    }
  }
}
