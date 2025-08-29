import { IsString, IsOptional } from 'class-validator';

export class CreateApplicationDto {
  @IsString()
  jobId: string;

  @IsString()
  @IsOptional()
  coverLetter?: string;
}
