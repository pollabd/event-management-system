import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { Events } from './events.entity';
import { CreateEventDto, FilterEventsDto } from './dto/event.dto';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  async createEvent(@Body() eventData: CreateEventDto): Promise<Events> {
    return this.eventsService.createEvent(eventData);
  }

  @Get()
  async getAllEvents(): Promise<Events[]> {
    return this.eventsService.findAll();
  }

  @Get('filter/by-date')
  async filterEvents(@Query() filterDto: FilterEventsDto): Promise<Events[]> {
    try {
      return await this.eventsService.filterByDate(filterDto);
    } catch (error: unknown) {
      console.error('Error filtering events:', error);
      throw new BadRequestException('Unable to filter events');
    }
  }

  @Get(':id')
  async getEventById(@Param('id') id: string): Promise<Events> {
    return this.eventsService.findOne(id);
  }

  @Put(':id')
  async updateEvent(
    @Param('id') id: string,
    @Body() eventData: Partial<CreateEventDto>,
  ): Promise<Events> {
    return this.eventsService.updateEvent(id, eventData);
  }

  @Delete(':id')
  async deleteEvent(@Param('id') id: string): Promise<void> {
    return this.eventsService.remove(id);
  }
}
