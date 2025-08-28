import { IsString, IsDateString, IsOptional } from 'class-validator';

export class CreateInterviewDto {
  @IsString()
  applicationId: string;

  @IsDateString()
  scheduledAt: string;

  @IsString()
  mode: string; // e.g., "VIDEO", "PHONE", "IN_PERSON"

  @IsString()
  @IsOptional()
  notes?: string;
}