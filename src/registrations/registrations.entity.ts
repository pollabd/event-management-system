import { Attendees } from 'src/attendees/attendees.entity';
import { Events } from 'src/events/events.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Registrations {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Events)
  event: Events;

  @ManyToOne(() => Attendees)
  attendee: Attendees;

  @CreateDateColumn()
  registeredAt: Date;
}
