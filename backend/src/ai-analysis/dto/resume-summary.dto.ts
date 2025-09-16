import { ApiProperty } from '@nestjs/swagger';

export class ResumeSummaryDto {
  @ApiProperty({ type: [String], description: 'Key skills extracted from resume' })
  keySkills: string[];

  @ApiProperty({ description: 'Experience summary' })
  experience: string;

  @ApiProperty({ type: [String], description: 'Candidate strengths' })
  strengths: string[];

  @ApiProperty({ minimum: 0, maximum: 100, description: 'Job match score percentage' })
  matchScore: number;

  @ApiProperty({ description: 'AI-generated summary' })
  summary: string;
}

export class RankedCandidateDto {
  @ApiProperty({ description: 'Application ID' })
  id: string;

  @ApiProperty({ minimum: 0, maximum: 100, description: 'Match score percentage' })
  matchScore: number;

  @ApiProperty({ type: [String], description: 'Key strengths' })
  keyStrengths: string[];

  @ApiProperty({ description: 'Candidate summary' })
  summary: string;

  @ApiProperty({ description: 'Candidate information' })
  candidate: any;
}

export class SkillGapAnalysisDto {
  @ApiProperty({ type: [String], description: 'Most in-demand skills' })
  inDemandSkills: string[];

  @ApiProperty({ type: [String], description: 'Hard to fill roles' })
  hardToFillRoles: string[];

  @ApiProperty({ description: 'Average time to hire in days' })
  averageTimeToHire: number;

  @ApiProperty({ 
    description: 'Skill demand vs supply heatmap',
    example: { 'Frontend': { demand: 85, supply: 60 } }
  })
  skillHeatmap: { [key: string]: { demand: number; supply: number } };
}