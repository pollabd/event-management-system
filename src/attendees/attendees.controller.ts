import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { AttendeesService } from './attendees.service';
import { CreateAttendeeDto, SearchAttendeesDto } from './dto/attendee.dto';
import { Attendees } from './attendees.entity';

@Controller('attendees')
export class AttendeesController {
  constructor(private readonly attendeesService: AttendeesService) {}

  @Post()
  async create(
    @Body() createAttendeeDto: CreateAttendeeDto,
  ): Promise<Attendees> {
    return this.attendeesService.create(createAttendeeDto);
  }

  @Get()
  async findAll(): Promise<Attendees[]> {
    return this.attendeesService.findAll();
  }

  @Get('search')
  async searchAttendees(
    @Query() searchDto: SearchAttendeesDto,
  ): Promise<Attendees[]> {
    return this.attendeesService.search(searchDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Attendees> {
    return this.attendeesService.findOne(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.attendeesService.remove(id);
  }
}
