import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  AnalyticsService,
  DashboardMetrics,
  HiringFunnelReport,
} from '../../core/services/analytics.service';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="analytics-container">
      <div class="analytics-header">
        <h1>📊 Analytics Dashboard</h1>
        <div class="period-selector">
          <label for="period">Time Period:</label>
          <select
            id="period"
            [(ngModel)]="selectedPeriod"
            (change)="onPeriodChange()"
            class="period-select"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">Last Year</option>
          </select>
        </div>
      </div>

      <div class="loading-spinner" *ngIf="loading">
        <div class="spinner"></div>
        <p>Loading analytics data...</p>
      </div>

      <div class="analytics-content" *ngIf="!loading">
        <!-- Dashboard Metrics -->
        <section class="metrics-section">
          <h2>📈 Key Metrics</h2>
          <div class="metrics-grid">
            <div class="metric-card">
              <div class="metric-icon">💼</div>
              <div class="metric-info">
                <span class="metric-value">{{
                  dashboardMetrics?.totalJobs || 0
                }}</span>
                <span class="metric-label">Total Jobs</span>
              </div>
            </div>
            <div class="metric-card">
              <div class="metric-icon">📋</div>
              <div class="metric-info">
                <span class="metric-value">{{
                  dashboardMetrics?.totalApplications || 0
                }}</span>
                <span class="metric-label">Applications</span>
              </div>
            </div>
            <div class="metric-card">
              <div class="metric-icon">👥</div>
              <div class="metric-info">
                <span class="metric-value">{{
                  dashboardMetrics?.totalCandidates || 0
                }}</span>
                <span class="metric-label">Candidates</span>
              </div>
            </div>
            <div class="metric-card">
              <div class="metric-icon">📅</div>
              <div class="metric-info">
                <span class="metric-value">{{
                  dashboardMetrics?.totalInterviews || 0
                }}</span>
                <span class="metric-label">Interviews</span>
              </div>
            </div>
            <div class="metric-card success">
              <div class="metric-icon">✅</div>
              <div class="metric-info">
                <span class="metric-value"
                  >{{
                    dashboardMetrics?.screeningSuccessRate || 0
                      | number: '1.1-1'
                  }}%</span
                >
                <span class="metric-label">Success Rate</span>
              </div>
            </div>
            <div class="metric-card score">
              <div class="metric-icon">⭐</div>
              <div class="metric-info">
                <span class="metric-value">{{
                  dashboardMetrics?.averageFitScore || 0 | number: '1.1-1'
                }}</span>
                <span class="metric-label">Avg Fit Score</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Application Status Breakdown -->
        <section
          class="breakdown-section"
          *ngIf="dashboardMetrics?.applicationStatusBreakdown?.length"
        >
          <h2>📊 Application Status Breakdown</h2>
          <div class="breakdown-grid">
            <div
              class="breakdown-item"
              *ngFor="
                let status of dashboardMetrics?.applicationStatusBreakdown
              "
            >
              <div class="breakdown-bar">
                <div
                  class="breakdown-fill"
                  [style.width.%]="status.percentage"
                  [class]="getStatusClass(status.status)"
                ></div>
              </div>
              <div class="breakdown-info">
                <span class="breakdown-label">{{ status.status }}</span>
                <span class="breakdown-count"
                  >{{ status.count }} ({{
                    status.percentage | number: '1.0-0'
                  }}%)</span
                >
              </div>
            </div>
          </div>
        </section>

        <!-- Hiring Funnel -->
        <section class="funnel-section" *ngIf="hiringFunnel?.stages?.length">
          <h2>🔄 Hiring Funnel</h2>
          <div class="funnel-container">
            <div
              class="funnel-stage"
              *ngFor="let stage of hiringFunnel?.stages; let i = index"
            >
              <div class="stage-bar" [style.width.%]="stage.percentage">
                <span class="stage-label">{{ stage.stage }}</span>
                <span class="stage-count">{{ stage.count }}</span>
              </div>
              <div class="conversion-rate" *ngIf="stage.conversionRate">
                {{ stage.conversionRate | number: '1.1-1' }}% conversion
              </div>
            </div>
          </div>
          <div class="funnel-summary">
            <p>
              Overall Conversion Rate:
              <strong
                >{{
                  hiringFunnel?.overallConversionRate | number: '1.1-1'
                }}%</strong
              >
            </p>
            <p>
              Total Applications:
              <strong>{{ hiringFunnel?.totalApplications }}</strong>
            </p>
          </div>
        </section>

        <!-- Top Skills -->
        <section
          class="skills-section"
          *ngIf="dashboardMetrics?.topSkills?.length"
        >
          <h2>🏆 Top Skills in Demand</h2>
          <div class="skills-grid">
            <div
              class="skill-item"
              *ngFor="let skill of dashboardMetrics?.topSkills; let i = index"
            >
              <div class="skill-rank">{{ i + 1 }}</div>
              <div class="skill-info">
                <span class="skill-name">{{ skill.skill }}</span>
                <span class="skill-count">{{ skill.count }} mentions</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div class="error-message" *ngIf="error">
        <div class="error-icon">⚠️</div>
        <p>{{ error }}</p>
        <button class="retry-btn" (click)="loadAnalytics()">Retry</button>
      </div>
    </div>
  `,
  styles: [
    `
      .analytics-container {
        padding: 2rem;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        min-height: 100vh;
      }

      .analytics-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
        background: rgba(255, 255, 255, 0.95);
        padding: 1.5rem;
        border-radius: 15px;
        backdrop-filter: blur(10px);
      }

      .analytics-header h1 {
        font-size: 2rem;
        font-weight: 700;
        background: linear-gradient(135deg, #667eea, #764ba2);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin: 0;
      }

      .period-selector {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .period-select {
        padding: 0.5rem 1rem;
        border: 2px solid #e2e8f0;
        border-radius: 8px;
        background: white;
        font-size: 0.9rem;
        cursor: pointer;
        transition: border-color 0.3s ease;
      }

      .period-select:focus {
        outline: none;
        border-color: #667eea;
      }

      .loading-spinner {
        text-align: center;
        padding: 3rem;
        background: rgba(255, 255, 255, 0.95);
        border-radius: 15px;
        backdrop-filter: blur(10px);
      }

      .spinner {
        width: 40px;
        height: 40px;
        border: 4px solid #e2e8f0;
        border-top: 4px solid #667eea;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 1rem;
      }

      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }

      .analytics-content {
        display: flex;
        flex-direction: column;
        gap: 2rem;
      }

      .metrics-section,
      .breakdown-section,
      .funnel-section,
      .skills-section {
        background: rgba(255, 255, 255, 0.95);
        border-radius: 15px;
        padding: 2rem;
        backdrop-filter: blur(10px);
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
      }

      .metrics-section h2,
      .breakdown-section h2,
      .funnel-section h2,
      .skills-section h2 {
        font-size: 1.5rem;
        font-weight: 600;
        color: #1f2937;
        margin-bottom: 1.5rem;
      }

      .metrics-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1.5rem;
      }

      .metric-card {
        background: linear-gradient(135deg, #f8fafc, #e2e8f0);
        border-radius: 12px;
        padding: 1.5rem;
        display: flex;
        align-items: center;
        gap: 1rem;
        transition: transform 0.3s ease;
      }

      .metric-card:hover {
        transform: translateY(-3px);
      }

      .metric-card.success {
        background: linear-gradient(135deg, #d1fae5, #a7f3d0);
      }

      .metric-card.score {
        background: linear-gradient(135deg, #fef3c7, #fde68a);
      }

      .metric-icon {
        font-size: 2rem;
        width: 60px;
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(102, 126, 234, 0.1);
        border-radius: 10px;
      }

      .metric-value {
        font-size: 2rem;
        font-weight: 700;
        color: #1f2937;
        display: block;
      }

      .metric-label {
        color: #6b7280;
        font-size: 0.9rem;
      }

      .breakdown-grid {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .breakdown-item {
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .breakdown-bar {
        flex: 1;
        height: 30px;
        background: #e5e7eb;
        border-radius: 15px;
        overflow: hidden;
        position: relative;
      }

      .breakdown-fill {
        height: 100%;
        border-radius: 15px;
        transition: width 0.8s ease;
      }

      .breakdown-fill.pending {
        background: linear-gradient(135deg, #fbbf24, #f59e0b);
      }
      .breakdown-fill.reviewing {
        background: linear-gradient(135deg, #3b82f6, #2563eb);
      }
      .breakdown-fill.accepted {
        background: linear-gradient(135deg, #10b981, #059669);
      }
      .breakdown-fill.rejected {
        background: linear-gradient(135deg, #ef4444, #dc2626);
      }

      .breakdown-info {
        min-width: 150px;
        display: flex;
        flex-direction: column;
      }

      .breakdown-label {
        font-weight: 600;
        color: #1f2937;
      }

      .breakdown-count {
        color: #6b7280;
        font-size: 0.9rem;
      }

      .funnel-container {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .funnel-stage {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .stage-bar {
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        padding: 1rem;
        border-radius: 8px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-weight: 600;
        transition: width 0.8s ease;
      }

      .conversion-rate {
        font-size: 0.9rem;
        color: #6b7280;
        text-align: center;
      }

      .funnel-summary {
        margin-top: 1.5rem;
        padding: 1rem;
        background: #f8fafc;
        border-radius: 8px;
        text-align: center;
      }

      .skills-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1rem;
      }

      .skill-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        background: #f8fafc;
        border-radius: 8px;
        transition: transform 0.3s ease;
      }

      .skill-item:hover {
        transform: translateY(-2px);
      }

      .skill-rank {
        width: 40px;
        height: 40px;
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
      }

      .skill-info {
        display: flex;
        flex-direction: column;
      }

      .skill-name {
        font-weight: 600;
        color: #1f2937;
      }

      .skill-count {
        color: #6b7280;
        font-size: 0.9rem;
      }

      .error-message {
        text-align: center;
        padding: 2rem;
        background: rgba(255, 255, 255, 0.95);
        border-radius: 15px;
        backdrop-filter: blur(10px);
      }

      .error-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
      }

      .retry-btn {
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 600;
        margin-top: 1rem;
        transition: transform 0.3s ease;
      }

      .retry-btn:hover {
        transform: translateY(-2px);
      }

      @media (max-width: 768px) {
        .analytics-header {
          flex-direction: column;
          gap: 1rem;
          text-align: center;
        }

        .metrics-grid {
          grid-template-columns: 1fr;
        }

        .skills-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class AnalyticsComponent implements OnInit {
  dashboardMetrics: DashboardMetrics | null = null;
  hiringFunnel: HiringFunnelReport | null = null;
  selectedPeriod = '30d';
  loading = false;
  error: string | null = null;

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit(): void {
    this.loadAnalytics();
  }

  onPeriodChange(): void {
    this.loadAnalytics();
  }

  loadAnalytics(): void {
    this.loading = true;
    this.error = null;

    // Load dashboard metrics
    this.analyticsService.getDashboardMetrics(this.selectedPeriod).subscribe({
      next: (data) => {
        this.dashboardMetrics = data;
      },
      error: (error) => {
        console.error('Error loading dashboard metrics:', error);
        this.error = 'Failed to load analytics data. Please try again.';
      },
    });

    // Load hiring funnel
    this.analyticsService.getHiringFunnelReport(this.selectedPeriod).subscribe({
      next: (data) => {
        this.hiringFunnel = data;
      },
      error: (error) => {
        console.error('Error loading hiring funnel:', error);
        if (!this.error) {
          this.error = 'Failed to load hiring funnel data. Please try again.';
        }
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  getStatusClass(status: string): string {
    return status.toLowerCase().replace(/\s+/g, '');
  }
}
