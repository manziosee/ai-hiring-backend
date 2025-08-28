import { IsEmail, IsString, IsEnum, IsOptional, IsArray, IsNumber } from 'class-validator';
import { UserRole } from '@prisma/client';

export class CandidateDataDto {
  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsArray()
  @IsString({ each: true })
  skills: string[];

  @IsNumber()
  yearsExp: number;
}

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  fullName: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsOptional()
  candidateData?: CandidateDataDto;
}