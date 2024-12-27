import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAttendeeDto {
  @ApiProperty({
    description: 'Full name of the attendee',
    example: 'Pollab Das',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Email address of the attendee',
    example: 'pollabdas@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(255)
  email: string;
}

export class SearchAttendeesDto {
  @ApiProperty({
    description: 'Search query to find attendees by name or email',
    example: 'Pollab',
  })
  @IsNotEmpty()
  @IsString()
  search: string;
}
