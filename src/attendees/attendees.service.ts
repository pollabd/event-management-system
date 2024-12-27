import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendees } from './attendees.entity';
import { CreateAttendeeDto, SearchAttendeesDto } from './dto/attendee.dto';

@Injectable()
export class AttendeesService {
  constructor(
    @InjectRepository(Attendees)
    private readonly attendeeRepository: Repository<Attendees>,
  ) {}

  async create(createAttendeeDto: CreateAttendeeDto): Promise<Attendees> {
    const { email } = createAttendeeDto;

    const existingAttendee = await this.attendeeRepository.findOne({
      where: { email },
    });
    if (existingAttendee) {
      throw new BadRequestException(
        'An attendee with this email already exists.',
      );
    }

    const attendee = this.attendeeRepository.create(createAttendeeDto);
    return this.attendeeRepository.save(attendee);
  }

  async findAll(): Promise<Attendees[]> {
    return this.attendeeRepository.find();
  }

  async findOne(id: string): Promise<Attendees> {
    const attendee = await this.attendeeRepository.findOne({ where: { id } });
    if (!attendee) {
      throw new NotFoundException(`Attendee with ID ${id} not found.`);
    }
    return attendee;
  }

  async remove(id: string): Promise<void> {
    const result = await this.attendeeRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Attendee with ID ${id} not found.`);
    }
  }

  async search(searchDto: SearchAttendeesDto): Promise<Attendees[]> {
    if (!searchDto.search) {
      throw new BadRequestException('Search term is required.');
    }

    const query = this.attendeeRepository.createQueryBuilder('attendee');

    query
      .where('LOWER(attendee.name) LIKE LOWER(:search)', {
        search: `%${searchDto.search}%`,
      })
      .orWhere('LOWER(attendee.email) LIKE LOWER(:search)', {
        search: `%${searchDto.search}%`,
      });

    const attendees = await query.getMany();

    if (!attendees.length) {
      throw new NotFoundException('No attendees match the search criteria.');
    }

    return attendees;
  }
}
