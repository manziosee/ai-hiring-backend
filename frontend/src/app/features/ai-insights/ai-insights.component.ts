import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AiAnalysisService, SkillGapAnalysis } from '../../core/services/ai-analysis.service';
import { PredictiveAnalyticsService, HiringPredictions, BiasAnalysis } from '../../core/services/predictive-analytics.service';

@Component({
  selector: 'app-ai-insights',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="ai-insights-container">
      <div class="page-header">
        <h1><i class="fas fa-brain"></i> AI Insights Dashboard</h1>
        <p>Advanced analytics and predictions for smarter hiring decisions</p>
      </div>

      <!-- Hiring Predictions -->
      <div class="insights-section" *ngIf="hiringPredictions">
        <h2><i class="fas fa-chart-line"></i> Hiring Predictions</h2>
        <div class="prediction-cards">
          <div class="prediction-card">
            <div class="card-icon time">
              <i class="fas fa-clock"></i>
            </div>
            <div class="card-content">
              <h3>Average Time to Hire</h3>
              <div class="metric">{{ hiringPredictions.predictedTimeToHire.average }} days</div>
              <div class="breakdown">
                <div *ngFor="let role of getTimeToHireRoles()" class="breakdown-item">
                  <span>{{ role.name }}</span>
                  <span>{{ role.days }} days</span>
                </div>
              </div>
            </div>
          </div>

          <div class="prediction-card">
            <div class="card-icon dropoff">
              <i class="fas fa-user-times"></i>
            </div>
            <div class="card-content">
              <h3>Candidate Dropoff Rate</h3>
              <div class="metric">{{ hiringPredictions.candidateDropoffRate.overall }}%</div>
              <div class="stage-breakdown">
                <div *ngFor="let stage of getDropoffStages()" class="stage-item">
                  <div class="stage-bar">
                    <div class="stage-fill" [style.width.%]="stage.rate"></div>
                  </div>
                  <span>{{ stage.name }}: {{ stage.rate }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="recommendations">
          <h3><i class="fas fa-lightbulb"></i> AI Recommendations</h3>
          <div class="recommendation-list">
            <div *ngFor="let rec of hiringPredictions.recommendations" class="recommendation-item">
              <i class="fas fa-check-circle"></i>
              <span>{{ rec }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Bias Analysis -->
      <div class="insights-section" *ngIf="biasAnalysis">
        <h2><i class="fas fa-balance-scale"></i> Bias Detection & Fairness</h2>
        <div class="bias-overview">
          <div class="fairness-score">
            <div class="score-circle" [class]="getFairnessScoreClass()">
              <span>{{ biasAnalysis.overallFairnessScore }}</span>
              <small>Fairness Score</small>
            </div>
          </div>
          <div class="compliance-status">
            <div class="status-badge compliant">
              <i class="fas fa-shield-check"></i>
              {{ biasAnalysis.complianceStatus }}
            </div>
          </div>
        </div>

        <div class="bias-indicators">
          <div *ngFor="let indicator of getBiasIndicators()" class="bias-card">
            <div class="bias-header">
              <h4>{{ indicator.name }}</h4>
              <div class="bias-score" [class]="indicator.statusClass">{{ indicator.score }}</div>
            </div>
            <div class="bias-status">{{ indicator.status }}</div>
            <div class="bias-details">{{ indicator.details }}</div>
          </div>
        </div>
      </div>

      <!-- Skill Gap Analysis -->
      <div class="insights-section" *ngIf="skillGaps">
        <h2><i class="fas fa-chart-bar"></i> Skill Gap Analysis</h2>
        <div class="skill-analysis">
          <div class="in-demand-skills">
            <h3>Most In-Demand Skills</h3>
            <div class="skill-tags">
              <span *ngFor="let skill of skillGaps.inDemandSkills" class="skill-tag">{{ skill }}</span>
            </div>
          </div>

          <div class="skill-heatmap">
            <h3>Supply vs Demand Heatmap</h3>
            <div class="heatmap-grid">
              <div *ngFor="let skill of getSkillHeatmapData()" class="heatmap-item">
                <div class="skill-name">{{ skill.name }}</div>
                <div class="skill-bars">
                  <div class="demand-bar">
                    <div class="bar-fill demand" [style.width.%]="skill.demand"></div>
                    <span>Demand: {{ skill.demand }}%</span>
                  </div>
                  <div class="supply-bar">
                    <div class="bar-fill supply" [style.width.%]="skill.supply"></div>
                    <span>Supply: {{ skill.supply }}%</span>
                  </div>
                </div>
                <div class="gap-indicator" [class]="skill.gapClass">
                  {{ skill.gap > 0 ? 'High Demand' : 'Balanced' }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .ai-insights-container {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
      min-height: 100vh;
    }

    .page-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .page-header h1 {
      font-size: 2.5rem;
      color: #1e293b;
      margin-bottom: 0.5rem;
    }

    .page-header i {
      color: #10b981;
      margin-right: 1rem;
    }

    .insights-section {
      background: white;
      border-radius: 16px;
      padding: 2rem;
      margin-bottom: 2rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }

    .insights-section h2 {
      color: #1e293b;
      margin-bottom: 1.5rem;
      font-size: 1.5rem;
    }

    .insights-section h2 i {
      color: #10b981;
      margin-right: 0.5rem;
    }

    .prediction-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 2rem;
      margin-bottom: 2rem;
    }

    .prediction-card {
      background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
      border-radius: 12px;
      padding: 1.5rem;
      display: flex;
      gap: 1rem;
    }

    .card-icon {
      width: 60px;
      height: 60px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      color: white;
    }

    .card-icon.time { background: linear-gradient(135deg, #3b82f6, #1d4ed8); }
    .card-icon.dropoff { background: linear-gradient(135deg, #ef4444, #dc2626); }

    .card-content {
      flex: 1;
    }

    .card-content h3 {
      margin: 0 0 0.5rem 0;
      color: #374151;
      font-size: 1.1rem;
    }

    .metric {
      font-size: 2rem;
      font-weight: 700;
      color: #10b981;
      margin-bottom: 1rem;
    }

    .breakdown {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .breakdown-item {
      display: flex;
      justify-content: space-between;
      padding: 0.25rem 0;
      border-bottom: 1px solid #e5e7eb;
    }

    .stage-breakdown {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .stage-item {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .stage-bar {
      width: 100px;
      height: 8px;
      background: #e5e7eb;
      border-radius: 4px;
      overflow: hidden;
    }

    .stage-fill {
      height: 100%;
      background: linear-gradient(90deg, #ef4444, #dc2626);
      transition: width 0.3s ease;
    }

    .recommendations {
      background: #f0fdf4;
      border-radius: 12px;
      padding: 1.5rem;
      border-left: 4px solid #10b981;
    }

    .recommendations h3 {
      color: #065f46;
      margin-bottom: 1rem;
    }

    .recommendation-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .recommendation-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      color: #047857;
    }

    .recommendation-item i {
      color: #10b981;
    }

    .bias-overview {
      display: flex;
      align-items: center;
      gap: 2rem;
      margin-bottom: 2rem;
    }

    .fairness-score {
      display: flex;
      align-items: center;
    }

    .score-circle {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      font-weight: 700;
      color: white;
    }

    .score-circle.excellent { background: linear-gradient(135deg, #10b981, #059669); }
    .score-circle.good { background: linear-gradient(135deg, #3b82f6, #1d4ed8); }
    .score-circle.needs-attention { background: linear-gradient(135deg, #f59e0b, #d97706); }

    .score-circle small {
      font-size: 0.75rem;
      font-weight: 500;
    }

    .status-badge {
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .status-badge.compliant {
      background: #dcfce7;
      color: #166534;
    }

    .bias-indicators {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .bias-card {
      background: #f8fafc;
      border-radius: 12px;
      padding: 1.5rem;
      border: 1px solid #e2e8f0;
    }

    .bias-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    .bias-score {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      color: white;
      font-size: 0.875rem;
    }

    .bias-score.good { background: #10b981; }
    .bias-score.needs-attention { background: #f59e0b; }
    .bias-score.poor { background: #ef4444; }

    .skill-analysis {
      display: grid;
      grid-template-columns: 1fr 2fr;
      gap: 2rem;
    }

    .skill-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .skill-tag {
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .heatmap-grid {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .heatmap-item {
      background: #f8fafc;
      border-radius: 8px;
      padding: 1rem;
    }

    .skill-name {
      font-weight: 600;
      margin-bottom: 0.5rem;
      color: #374151;
    }

    .skill-bars {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }

    .demand-bar, .supply-bar {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .bar-fill {
      height: 8px;
      border-radius: 4px;
      width: 150px;
      background: #e5e7eb;
      position: relative;
      overflow: hidden;
    }

    .bar-fill.demand::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      background: linear-gradient(90deg, #ef4444, #dc2626);
      width: var(--width, 0%);
    }

    .bar-fill.supply::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      background: linear-gradient(90deg, #10b981, #059669);
      width: var(--width, 0%);
    }

    .gap-indicator {
      font-size: 0.75rem;
      font-weight: 600;
      padding: 0.25rem 0.5rem;
      border-radius: 12px;
      display: inline-block;
    }

    .gap-indicator.high-demand {
      background: #fef3c7;
      color: #92400e;
    }

    .gap-indicator.balanced {
      background: #dcfce7;
      color: #166534;
    }

    @media (max-width: 768px) {
      .prediction-cards {
        grid-template-columns: 1fr;
      }
      
      .skill-analysis {
        grid-template-columns: 1fr;
      }
      
      .bias-overview {
        flex-direction: column;
        text-align: center;
      }
    }
  `]
})
export class AiInsightsComponent implements OnInit {
  hiringPredictions: HiringPredictions | null = null;
  biasAnalysis: BiasAnalysis | null = null;
  skillGaps: SkillGapAnalysis | null = null;
  loading = false;

  constructor(
    private aiAnalysisService: AiAnalysisService,
    private predictiveAnalyticsService: PredictiveAnalyticsService
  ) {}

  ngOnInit() {
    this.loadInsights();
  }

  loadInsights() {
    this.loading = true;
    
    this.predictiveAnalyticsService.getHiringPredictions().subscribe({
      next: data => this.hiringPredictions = data,
      error: err => console.error('Failed to load hiring predictions:', err)
    });

    this.predictiveAnalyticsService.getBiasAnalysis().subscribe({
      next: data => this.biasAnalysis = data,
      error: err => console.error('Failed to load bias analysis:', err)
    });

    this.aiAnalysisService.getSkillGaps().subscribe({
      next: data => {
        this.skillGaps = data;
        this.loading = false;
      },
      error: err => {
        console.error('Failed to load skill gaps:', err);
        this.loading = false;
      }
    });
  }

  getTimeToHireRoles() {
    if (!this.hiringPredictions) return [];
    return Object.entries(this.hiringPredictions.predictedTimeToHire.byRole)
      .map(([name, days]) => ({ name, days }));
  }

  getDropoffStages() {
    if (!this.hiringPredictions) return [];
    return Object.entries(this.hiringPredictions.candidateDropoffRate.byStage)
      .map(([name, rate]) => ({ name, rate }));
  }

  getFairnessScoreClass() {
    if (!this.biasAnalysis) return 'good';
    const score = this.biasAnalysis.overallFairnessScore;
    if (score >= 90) return 'excellent';
    if (score >= 75) return 'good';
    return 'needs-attention';
  }

  getBiasIndicators() {
    if (!this.biasAnalysis) return [];
    return Object.entries(this.biasAnalysis.biasIndicators)
      .map(([name, data]) => ({
        name: name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
        score: data.score,
        status: data.status,
        details: data.details,
        statusClass: data.score >= 85 ? 'good' : data.score >= 70 ? 'needs-attention' : 'poor'
      }));
  }

  getSkillHeatmapData() {
    if (!this.skillGaps) return [];
    return Object.entries(this.skillGaps.skillHeatmap)
      .map(([name, data]) => ({
        name,
        demand: data.demand,
        supply: data.supply,
        gap: data.demand - data.supply,
        gapClass: data.demand - data.supply > 20 ? 'high-demand' : 'balanced'
      }));
  }
}