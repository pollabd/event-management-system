import { IsNotEmpty, IsOptional, IsInt, Min, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEventDto {
  @ApiProperty({
    description: 'Name of the event',
    example: 'Tech Conference 2024',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Detailed description of the event',
    example: 'A conference about emerging tech trends and innovations.',
    required: false, // Marking it optional
  })
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Date of the event in ISO 8601 format',
    example: '2024-06-15T09:00:00Z',
  })
  @IsNotEmpty()
  @IsDate()
  date: Date;

  @ApiProperty({
    description: 'Location of the event',
    example: 'Dhaka Convention Center',
    required: false,
  })
  @IsOptional()
  location?: string;

  @ApiProperty({
    description: 'Maximum number of attendees allowed',
    example: 500,
  })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  maxAttendees: number;
}

export class FilterEventsDto {
  @ApiProperty({
    description: 'Start date for filtering events',
    example: '2024-01-01T00:00:00Z',
    required: false,
  })
  startDate?: Date;

  @ApiProperty({
    description: 'End date for filtering events',
    example: '2024-12-31T23:59:59Z',
    required: false,
  })
  endDate?: Date;
}
