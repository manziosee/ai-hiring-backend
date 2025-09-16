import { ApiProperty } from '@nestjs/swagger';

export class HiringPredictionsDto {
  @ApiProperty({
    description: 'Predicted time to hire metrics',
    example: { average: 32, byRole: { 'Software Engineer': 28 } }
  })
  predictedTimeToHire: {
    average: number;
    byRole: { [key: string]: number };
  };

  @ApiProperty({
    description: 'Candidate dropoff rates by stage',
    example: { overall: 15, byStage: { 'Application': 5 } }
  })
  candidateDropoffRate: {
    overall: number;
    byStage: { [key: string]: number };
  };

  @ApiProperty({
    description: 'Hiring trends and patterns',
    example: { monthlyHires: [12, 15, 18], seasonalPatterns: { Q1: 'High demand' } }
  })
  hiringTrends: {
    monthlyHires: number[];
    seasonalPatterns: { [key: string]: string };
  };

  @ApiProperty({ type: [String], description: 'AI-generated recommendations' })
  recommendations: string[];
}

export class BiasAnalysisDto {
  @ApiProperty({ minimum: 0, maximum: 100, description: 'Overall fairness score' })
  overallFairnessScore: number;

  @ApiProperty({
    description: 'Bias indicators by category',
    example: { genderBias: { score: 92, status: 'Good', details: 'Balanced hiring' } }
  })
  biasIndicators: {
    [key: string]: {
      score: number;
      status: string;
      details: string;
    };
  };

  @ApiProperty({ type: [String], description: 'Bias mitigation recommendations' })
  recommendations: string[];

  @ApiProperty({ description: 'Compliance status', example: 'GDPR Compliant' })
  complianceStatus: string;
}

export class SentimentAnalysisDto {
  @ApiProperty({
    description: 'Candidate engagement metrics',
    example: { enthusiasm: 85, confidence: 78, communication: 92 }
  })
  candidateEngagement: {
    enthusiasm: number;
    confidence: number;
    communication: number;
  };

  @ApiProperty({
    description: 'Response analysis results',
    example: { positiveIndicators: ['Strong interest'], concerns: ['Limited availability'] }
  })
  responseAnalysis: {
    positiveIndicators: string[];
    concerns: string[];
  };

  @ApiProperty({ description: 'Overall sentiment classification' })
  overallSentiment: string;

  @ApiProperty({ type: [String], description: 'Recommended next actions' })
  recommendedActions: string[];
}