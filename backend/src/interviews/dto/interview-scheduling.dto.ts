import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString, IsEnum, IsNumber, Min } from 'class-validator';

export enum InterviewType {
  PHONE = 'PHONE',
  VIDEO = 'VIDEO',
  IN_PERSON = 'IN_PERSON'
}

export class ScheduleInterviewDto {
  @ApiProperty({ description: 'Application ID for the interview' })
  @IsString()
  applicationId: string;

  @ApiProperty({ description: 'Interviewer user ID' })
  @IsString()
  interviewerId: string;

  @ApiProperty({ description: 'Scheduled interview date and time', example: '2024-01-15T10:00:00Z' })
  @IsDateString()
  scheduledAt: string;

  @ApiProperty({ enum: InterviewType, description: 'Type of interview' })
  @IsEnum(InterviewType)
  type: InterviewType;

  @ApiProperty({ description: 'Interview duration in minutes', minimum: 15, example: 60 })
  @IsNumber()
  @Min(15)
  duration: number;
}

export class InterviewSlotDto {
  @ApiProperty({ description: 'Available time slot', example: '2024-01-15T10:00:00Z' })
  time: Date;

  @ApiProperty({ description: 'Whether the slot is available' })
  available: boolean;

  @ApiProperty({ description: 'Duration of the slot in minutes' })
  duration: number;
}

export class InterviewDto {
  @ApiProperty({ description: 'Interview ID' })
  id: string;

  @ApiProperty({ description: 'Application ID' })
  applicationId: string;

  @ApiProperty({ description: 'Scheduled by user ID' })
  scheduledById: string;

  @ApiProperty({ description: 'Scheduled date and time' })
  scheduledAt: Date;

  @ApiProperty({ description: 'Interview mode/type' })
  mode: string;

  @ApiProperty({ description: 'Interview notes', required: false })
  notes?: string;

  @ApiProperty({ description: 'Application details' })
  application: any;

  @ApiProperty({ description: 'Scheduled by user details' })
  scheduledBy: any;
}