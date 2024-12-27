import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Events } from './events.entity';
import { CreateEventDto, FilterEventsDto } from './dto/event.dto';

@Injectable()
export class EventsService {
  private readonly CACHE_KEY = 'ALL_EVENTS';

  constructor(
    @InjectRepository(Events)
    private readonly eventRepository: Repository<Events>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  private async invalidateCache(): Promise<void> {
    await this.cacheManager.del(this.CACHE_KEY);
  }

  private async setCacheEvents(events: Events[]): Promise<void> {
    await this.cacheManager.set(this.CACHE_KEY, events);
  }

  async createEvent(createEventDto: CreateEventDto): Promise<Events> {
    const eventDate = new Date(createEventDto.date);

    const overlappingEvent = await this.eventRepository.findOne({
      where: {
        date: eventDate,
      },
    });

    if (overlappingEvent) {
      throw new BadRequestException('An event already exists on this date.');
    }

    const event = this.eventRepository.create({
      name: createEventDto.name,
      description: createEventDto.description || null,
      date: eventDate,
      location: createEventDto.location || null,
      maxAttendees: createEventDto.maxAttendees,
    });

    const savedEvent = await this.eventRepository.save(event);
    await this.invalidateCache();
    return savedEvent;
  }

  async findAll(): Promise<Events[]> {
    const cachedEvents = await this.cacheManager.get<Events[]>(this.CACHE_KEY);

    if (cachedEvents) {
      return cachedEvents;
    }

    const events = await this.eventRepository.find({
      order: {
        date: 'ASC',
        createdAt: 'DESC',
      },
    });

    await this.setCacheEvents(events);

    console.log('Cache set:', events);
    return events;
  }

  async findOne(id: string): Promise<Events> {
    const event = await this.eventRepository.findOne({
      where: { id },
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return event;
  }

  async remove(id: string): Promise<void> {
    const result = await this.eventRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    await this.invalidateCache();
  }

  async filterByDate(filterDto: FilterEventsDto): Promise<Events[]> {
    const query = this.eventRepository.createQueryBuilder('event');

    if (filterDto.startDate) {
      query.andWhere('event.date >= :startDate', {
        startDate: new Date(filterDto.startDate),
      });
    }

    if (filterDto.endDate) {
      query.andWhere('event.date <= :endDate', {
        endDate: new Date(filterDto.endDate),
      });
    }

    query.orderBy('event.date', 'ASC').addOrderBy('event.createdAt', 'DESC');

    return query.getMany();
  }

  async updateEvent(
    id: string,
    updateEventDto: Partial<CreateEventDto>,
  ): Promise<Events> {
    const event = await this.findOne(id);

    if (updateEventDto.date) {
      const eventDate = new Date(updateEventDto.date);
      const overlappingEvent = await this.eventRepository.findOne({
        where: {
          date: eventDate,
          id: Not(id),
        },
      });

      if (overlappingEvent) {
        throw new BadRequestException('An event already exists on this date.');
      }
    }

    Object.assign(event, updateEventDto);
    const updatedEvent = await this.eventRepository.save(event);
    await this.invalidateCache();
    return updatedEvent;
  }
}
