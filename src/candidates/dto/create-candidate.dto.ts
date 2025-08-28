import { IsString, IsArray, IsNumber, IsOptional, IsUrl } from 'class-validator';

export class CreateCandidateDto {
  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsUrl()
  @IsOptional()
  resumeUrl?: string;

  @IsArray()
  @IsString({ each: true })
  skills: string[];

  @IsNumber()
  yearsExp: number;
}