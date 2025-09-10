import { IsNumber, IsObject, IsString, Min, Max } from 'class-validator';

export class ScreeningResultDto {
  @IsNumber()
  @Min(0)
  @Max(1)
  fitScore: number;

  @IsNumber()
  @Min(0)
  @Max(1)
  skillMatch: number;

  @IsNumber()
  @Min(0)
  @Max(1)
  experienceMatch: number;

  @IsObject()
  details: {
    extractedSkills: string[];
    matchedSkills: string[];
    missingSkills: string[];
    experienceGap: number;
    recommendations: string[];
  };

  @IsString()
  stage: string;
}