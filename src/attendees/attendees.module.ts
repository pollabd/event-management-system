import { Module } from '@nestjs/common';
import { AttendeesService } from './attendees.service';
import { AttendeesController } from './attendees.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendees } from './attendees.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Attendees])],
  providers: [AttendeesService],
  controllers: [AttendeesController],
})
export class AttendeesModule {}
