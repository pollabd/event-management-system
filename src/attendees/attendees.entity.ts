import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Attendees {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;
}
