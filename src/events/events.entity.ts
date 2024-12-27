import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Events {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column()
  date: Date;

  @Column({ nullable: true })
  location: string;

  @Column({ type: 'int' })
  maxAttendees: number;

  @CreateDateColumn()
  createdAt: Date;
}
