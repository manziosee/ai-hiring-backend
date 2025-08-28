import { IsString, IsArray, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateJobDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  @IsString({ each: true })
  skills: string[];

  @IsNumber()
  experience: number;
}