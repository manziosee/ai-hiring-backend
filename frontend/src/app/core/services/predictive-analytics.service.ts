import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface HiringPredictions {
  predictedTimeToHire: {
    average: number;
    byRole: { [key: string]: number };
  };
  candidateDropoffRate: {
    overall: number;
    byStage: { [key: string]: number };
  };
  hiringTrends: {
    monthlyHires: number[];
    seasonalPatterns: { [key: string]: string };
  };
  recommendations: string[];
}

export interface BiasAnalysis {
  overallFairnessScore: number;
  biasIndicators: {
    [key: string]: {
      score: number;
      status: string;
      details: string;
    };
  };
  recommendations: string[];
  complianceStatus: string;
}

export interface SentimentAnalysis {
  candidateEngagement: {
    enthusiasm: number;
    confidence: number;
    communication: number;
  };
  responseAnalysis: {
    positiveIndicators: string[];
    concerns: string[];
  };
  overallSentiment: string;
  recommendedActions: string[];
}

@Injectable({
  providedIn: 'root'
})
export class PredictiveAnalyticsService {
  private apiUrl = `${environment.apiUrl}/predictive-analytics`;

  constructor(private http: HttpClient) {}

  getHiringPredictions(): Observable<HiringPredictions> {
    return this.http.get<HiringPredictions>(`${this.apiUrl}/hiring-predictions`);
  }

  getBiasAnalysis(): Observable<BiasAnalysis> {
    return this.http.get<BiasAnalysis>(`${this.apiUrl}/bias-analysis`);
  }

  getSentimentAnalysis(applicationId: string): Observable<SentimentAnalysis> {
    return this.http.get<SentimentAnalysis>(`${this.apiUrl}/sentiment-analysis/${applicationId}`);
  }
}