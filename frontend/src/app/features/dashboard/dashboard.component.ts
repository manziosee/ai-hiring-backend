import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

interface ApiUser {
  id: string;
  email: string;
  role: string;
  fullName?: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1>{{ getDashboardTitle() }}</h1>
        <p>Welcome, {{ getUserName() }}</p>
      </div>

      <div *ngIf="loading" class="loading">
        <div class="spinner"></div>
        <p>Loading dashboard...</p>
      </div>

      <div *ngIf="error" class="error">
        <p>{{ error }}</p>
      </div>

      <div *ngIf="!loading && !error" class="dashboard-content">
        <!-- Main Dashboard Grid -->
        <div class="dashboard-grid">
          <!-- Core Stats Section -->
          <div class="stats-section">
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-icon users-icon">
                  <i class="fas fa-users"></i>
                </div>
                <div class="stat-info">
                  <h3>{{ stats.totalUsers }}</h3>
                  <p>Total Users</p>
                  <span class="stat-trend positive">+12%</span>
                </div>
              </div>
              <div class="stat-card">
                <div class="stat-icon jobs-icon">
                  <i class="fas fa-briefcase"></i>
                </div>
                <div class="stat-info">
                  <h3>{{ stats.totalJobs }}</h3>
                  <p>Active Jobs</p>
                  <span class="stat-trend positive">+5%</span>
                </div>
              </div>
              <div class="stat-card">
                <div class="stat-icon applications-icon">
                  <i class="fas fa-file-alt"></i>
                </div>
                <div class="stat-info">
                  <h3>{{ stats.totalApplications }}</h3>
                  <p>Applications</p>
                  <span class="stat-trend positive">+23%</span>
                </div>
              </div>
              <div class="stat-card">
                <div class="stat-icon ai-icon">
                  <i class="fas fa-robot"></i>
                </div>
                <div class="stat-info">
                  <h3>{{ aiScreenings }}</h3>
                  <p>AI Screenings</p>
                  <span class="stat-trend positive">+18%</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Advanced Features Sidebar -->
          <div class="advanced-sidebar">
            <h3 class="sidebar-title">
              <i class="fas fa-chart-line"></i>
              Advanced Insights
            </h3>

            <!-- Real-Time Monitoring -->
            <div class="widget-card">
              <div class="widget-header">
                <h4><i class="fas fa-pulse"></i> Real-Time Monitor</h4>
                <div class="status-indicator active"></div>
              </div>
              <div class="widget-content">
                <div class="live-metric">
                  <span class="metric-label">Active Sessions</span>
                  <span class="metric-value">{{ liveMetrics.activeSessions }}</span>
                </div>
                <div class="live-metric">
                  <span class="metric-label">AI Processing</span>
                  <span class="metric-value">{{ liveMetrics.aiProcessing }}</span>
                </div>
                <div class="live-metric">
                  <span class="metric-label">New Applications</span>
                  <span class="metric-value">{{ liveMetrics.newApplications }}</span>
                </div>
              </div>
            </div>

            <!-- AI Insights Panel -->
            <div class="widget-card">
              <div class="widget-header">
                <h4><i class="fas fa-brain"></i> AI Insights</h4>
                <div class="widget-actions">
                  <button class="widget-action" (click)="toggleAIDetails()" [title]="showAIDetails ? 'Hide Details' : 'Show Details'">
                    <i class="fas" [class.fa-chevron-up]="showAIDetails" [class.fa-chevron-down]="!showAIDetails"></i>
                  </button>
                  <button class="widget-action" (click)="refreshAIInsights()" title="Refresh AI Analysis">
                    <i class="fas fa-sync-alt" [class.fa-spin]="aiLoading"></i>
                  </button>
                </div>
              </div>
              <div class="widget-content">
                <div class="insight-item">
                  <div class="insight-icon churn">
                    <i class="fas fa-exclamation-triangle"></i>
                  </div>
                  <div class="insight-text">
                    <span class="insight-title">Churn Risk Analysis</span>
                    <span class="insight-desc">{{ aiInsights.churnRisk }} candidates at risk</span>
                    <div class="insight-trend" *ngIf="showAIDetails">
                      <span class="trend-indicator" [class]="getChurnTrend()">{{ getChurnTrendText() }}</span>
                    </div>
                  </div>
                </div>
                <div class="insight-item">
                  <div class="insight-icon bias">
                    <i class="fas fa-balance-scale"></i>
                  </div>
                  <div class="insight-text">
                    <span class="insight-title">Bias Detection</span>
                    <span class="insight-desc">{{ aiInsights.biasScore }}% fairness score</span>
                    <div class="bias-breakdown" *ngIf="showAIDetails">
                      <div class="bias-metric">
                        <span>Gender: {{ biasBreakdown.gender }}%</span>
                        <span>Age: {{ biasBreakdown.age }}%</span>
                        <span>Location: {{ biasBreakdown.location }}%</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="insight-item">
                  <div class="insight-icon prediction">
                    <i class="fas fa-crystal-ball"></i>
                  </div>
                  <div class="insight-text">
                    <span class="insight-title">Hiring Forecast</span>
                    <span class="insight-desc">{{ aiInsights.hiringForecast }} days avg time-to-hire</span>
                    <div class="forecast-details" *ngIf="showAIDetails">
                      <div class="forecast-metric">
                        <span class="metric-label">Next 30 days:</span>
                        <span class="metric-value">{{ predictiveMetrics.next30Days }} hires</span>
                      </div>
                      <div class="forecast-metric">
                        <span class="metric-label">Success rate:</span>
                        <span class="metric-value">{{ predictiveMetrics.successRate }}%</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Advanced AI Features -->
                <div class="ai-advanced-section" *ngIf="showAIDetails">
                  <div class="section-divider"></div>
                  
                  <!-- Skill Gap Analysis -->
                  <div class="insight-item">
                    <div class="insight-icon skills">
                      <i class="fas fa-cogs"></i>
                    </div>
                    <div class="insight-text">
                      <span class="insight-title">Skill Gap Analysis</span>
                      <div class="skill-gaps">
                        <div class="skill-gap" *ngFor="let gap of skillGaps">
                          <span class="skill-name">{{ gap.skill }}</span>
                          <div class="gap-severity" [class]="gap.severity">
                            {{ gap.percentage }}% shortage
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Market Intelligence -->
                  <div class="insight-item">
                    <div class="insight-icon market">
                      <i class="fas fa-chart-line"></i>
                    </div>
                    <div class="insight-text">
                      <span class="insight-title">Market Intelligence</span>
                      <div class="market-insights">
                        <div class="market-metric">
                          <span class="metric-label">Salary Trend:</span>
                          <span class="metric-value trend-up">+{{ marketData.salaryTrend }}%</span>
                        </div>
                        <div class="market-metric">
                          <span class="metric-label">Competition:</span>
                          <span class="metric-value">{{ marketData.competition }}</span>
                        </div>
                        <div class="market-metric">
                          <span class="metric-label">Demand Score:</span>
                          <span class="metric-value">{{ marketData.demandScore }}/10</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- AI Recommendations -->
                  <div class="ai-recommendations">
                    <h5><i class="fas fa-lightbulb"></i> AI Recommendations</h5>
                    <div class="recommendation" *ngFor="let rec of aiRecommendations">
                      <div class="rec-priority" [class]="rec.priority"></div>
                      <div class="rec-content">
                        <span class="rec-title">{{ rec.title }}</span>
                        <span class="rec-desc">{{ rec.description }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Security & Compliance -->
            <div class="widget-card">
              <div class="widget-header">
                <h4><i class="fas fa-shield-alt"></i> Security & Compliance</h4>
                <div class="widget-actions">
                  <button class="widget-action" (click)="toggleSecurityDetails()" [title]="showSecurityDetails ? 'Hide Details' : 'Show Details'">
                    <i class="fas" [class.fa-chevron-up]="showSecurityDetails" [class.fa-chevron-down]="!showSecurityDetails"></i>
                  </button>
                  <div class="security-status" [class]="securityStatus.level">
                    {{ securityStatus.level }}
                  </div>
                </div>
              </div>
              <div class="widget-content">
                <!-- Core Security Metrics -->
                <div class="security-metric">
                  <span class="metric-label">Failed Logins (24h)</span>
                  <span class="metric-value" [class]="getSecurityMetricClass('failedLogins')">{{ securityMetrics.failedLogins }}</span>
                </div>
                <div class="security-metric">
                  <span class="metric-label">2FA Adoption</span>
                  <span class="metric-value" [class]="getSecurityMetricClass('twoFA')">{{ securityMetrics.twoFAAdoption }}%</span>
                </div>
                <div class="security-metric">
                  <span class="metric-label">GDPR Compliance</span>
                  <span class="metric-value success">{{ securityMetrics.gdprCompliance }}%</span>
                </div>
                <div class="security-metric">
                  <span class="metric-label">Active Threats</span>
                  <span class="metric-value" [class]="getSecurityMetricClass('threats')">{{ securityMetrics.activeThreats }}</span>
                </div>
                
                <!-- Advanced Security Features -->
                <div class="security-advanced-section" *ngIf="showSecurityDetails">
                  <div class="section-divider"></div>
                  
                  <!-- Threat Detection -->
                  <div class="security-subsection">
                    <h6><i class="fas fa-bug"></i> Threat Detection</h6>
                    <div class="threat-list">
                      <div class="threat-item" *ngFor="let threat of recentThreats">
                        <div class="threat-severity" [class]="threat.severity"></div>
                        <div class="threat-details">
                          <span class="threat-type">{{ threat.type }}</span>
                          <span class="threat-desc">{{ threat.description }}</span>
                          <span class="threat-time">{{ threat.timestamp | date:'short' }}</span>
                        </div>
                        <button class="threat-action" (click)="investigateThreat(threat.id)">
                          <i class="fas fa-search"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Compliance Dashboard -->
                  <div class="security-subsection">
                    <h6><i class="fas fa-clipboard-check"></i> Compliance Status</h6>
                    <div class="compliance-grid">
                      <div class="compliance-item" *ngFor="let item of complianceStatus">
                        <div class="compliance-icon" [class]="item.status">
                          <i class="fas" [class.fa-check]="item.status === 'compliant'" [class.fa-exclamation-triangle]="item.status === 'warning'" [class.fa-times]="item.status === 'violation'"></i>
                        </div>
                        <div class="compliance-info">
                          <span class="compliance-name">{{ item.name }}</span>
                          <span class="compliance-desc">{{ item.description }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Audit Trail -->
                  <div class="security-subsection">
                    <h6><i class="fas fa-history"></i> Recent Audit Events</h6>
                    <div class="audit-list">
                      <div class="audit-item" *ngFor="let event of auditEvents">
                        <div class="audit-icon" [class]="event.type">
                          <i class="fas" [class.fa-user]="event.type === 'user'" [class.fa-file]="event.type === 'data'" [class.fa-cog]="event.type === 'system'"></i>
                        </div>
                        <div class="audit-details">
                          <span class="audit-action">{{ event.action }}</span>
                          <span class="audit-user">by {{ event.user }}</span>
                          <span class="audit-time">{{ event.timestamp | date:'short' }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Security Recommendations -->
                  <div class="security-recommendations">
                    <h6><i class="fas fa-shield-alt"></i> Security Recommendations</h6>
                    <div class="security-rec" *ngFor="let rec of securityRecommendations">
                      <div class="sec-rec-priority" [class]="rec.priority"></div>
                      <div class="sec-rec-content">
                        <span class="sec-rec-title">{{ rec.title }}</span>
                        <span class="sec-rec-desc">{{ rec.description }}</span>
                        <button class="sec-rec-action" (click)="implementSecurityRec(rec.id)">
                          {{ rec.actionText }}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Geographic Insights -->
            <div class="widget-card">
              <div class="widget-header">
                <h4><i class="fas fa-globe"></i> Geographic Insights</h4>
                <button class="widget-action" (click)="toggleMapView()">
                  <i class="fas fa-map"></i>
                </button>
              </div>
              <div class="widget-content">
                <div class="geo-stat" *ngFor="let region of topRegions">
                  <div class="region-info">
                    <span class="region-name">{{ region.name }}</span>
                    <span class="region-count">{{ region.candidates }} candidates</span>
                  </div>
                  <div class="region-bar">
                    <div class="bar-fill" [style.width.%]="region.percentage"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Job Quality Metrics -->
            <div class="widget-card">
              <div class="widget-header">
                <h4><i class="fas fa-star"></i> Job Quality</h4>
                <span class="quality-score">{{ jobQuality.averageScore }}/10</span>
              </div>
              <div class="widget-content">
                <div class="quality-metric">
                  <span class="metric-label">High Quality Jobs</span>
                  <span class="metric-value success">{{ jobQuality.highQuality }}%</span>
                </div>
                <div class="quality-metric">
                  <span class="metric-label">Needs Improvement</span>
                  <span class="metric-value warning">{{ jobQuality.needsImprovement }}%</span>
                </div>
                <div class="quality-metric">
                  <span class="metric-label">Compliance Issues</span>
                  <span class="metric-value alert">{{ jobQuality.complianceIssues }}</span>
                </div>
              </div>
            </div>

            <!-- System Health -->
            <div class="widget-card">
              <div class="widget-header">
                <h4><i class="fas fa-heartbeat"></i> System Health</h4>
                <div class="health-indicator" [class]="systemHealth.status">
                  {{ systemHealth.uptime }}%
                </div>
              </div>
              <div class="widget-content">
                <div class="health-metric">
                  <span class="metric-label">API Response Time</span>
                  <span class="metric-value">{{ systemHealth.apiResponseTime }}ms</span>
                </div>
                <div class="health-metric">
                  <span class="metric-label">Database Load</span>
                  <span class="metric-value">{{ systemHealth.dbLoad }}%</span>
                </div>
                <div class="health-metric">
                  <span class="metric-label">AI Service Status</span>
                  <span class="metric-value success">{{ systemHealth.aiServiceStatus }}</span>
                </div>
              </div>
            </div>
            
            <!-- Collaboration & Productivity Tools -->
            <div class="widget-card">
              <div class="widget-header">
                <h4><i class="fas fa-users-cog"></i> Team Collaboration</h4>
                <div class="widget-actions">
                  <button class="widget-action" (click)="toggleCollabDetails()" [title]="showCollabDetails ? 'Hide Details' : 'Show Details'">
                    <i class="fas" [class.fa-chevron-up]="showCollabDetails" [class.fa-chevron-down]="!showCollabDetails"></i>
                  </button>
                  <div class="notification-badge" *ngIf="unreadNotifications > 0">
                    {{ unreadNotifications }}
                  </div>
                </div>
              </div>
              <div class="widget-content">
                <!-- Quick Stats -->
                <div class="collab-metric">
                  <span class="metric-label">Active Team Members</span>
                  <span class="metric-value">{{ collaborationStats.activeMembers }}</span>
                </div>
                <div class="collab-metric">
                  <span class="metric-label">Pending Tasks</span>
                  <span class="metric-value warning">{{ collaborationStats.pendingTasks }}</span>
                </div>
                <div class="collab-metric">
                  <span class="metric-label">Messages Today</span>
                  <span class="metric-value">{{ collaborationStats.messagesCount }}</span>
                </div>
                
                <!-- Expanded Collaboration Features -->
                <div class="collab-advanced-section" *ngIf="showCollabDetails">
                  <div class="section-divider"></div>
                  
                  <!-- Recent Notifications -->
                  <div class="collab-subsection">
                    <h6><i class="fas fa-bell"></i> Recent Notifications</h6>
                    <div class="notification-list">
                      <div class="notification-item" *ngFor="let notification of recentNotifications" [class.unread]="!notification.read">
                        <div class="notification-icon" [class]="notification.type">
                          <i class="fas" [class.fa-user]="notification.type === 'user'" [class.fa-file]="notification.type === 'application'" [class.fa-briefcase]="notification.type === 'job'" [class.fa-exclamation]="notification.type === 'alert'"></i>
                        </div>
                        <div class="notification-content">
                          <span class="notification-title">{{ notification.title }}</span>
                          <span class="notification-desc">{{ notification.message }}</span>
                          <span class="notification-time">{{ notification.timestamp | date:'short' }}</span>
                        </div>
                        <button class="notification-action" (click)="markAsRead(notification.id)" *ngIf="!notification.read">
                          <i class="fas fa-check"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Team Tasks -->
                  <div class="collab-subsection">
                    <h6><i class="fas fa-tasks"></i> Team Tasks</h6>
                    <div class="task-list">
                      <div class="task-item" *ngFor="let task of teamTasks">
                        <div class="task-priority" [class]="task.priority"></div>
                        <div class="task-content">
                          <span class="task-title">{{ task.title }}</span>
                          <span class="task-assignee">Assigned to: {{ task.assignee }}</span>
                          <span class="task-due">Due: {{ task.dueDate | date:'short' }}</span>
                        </div>
                        <div class="task-status" [class]="task.status">
                          {{ task.status }}
                        </div>
                      </div>
                    </div>
                    <button class="add-task-btn" (click)="openTaskModal()">
                      <i class="fas fa-plus"></i> Add Task
                    </button>
                  </div>
                  
                  <!-- Quick Actions -->
                  <div class="collab-subsection">
                    <h6><i class="fas fa-bolt"></i> Quick Actions</h6>
                    <div class="quick-actions">
                      <button class="quick-action-btn" (click)="startTeamMeeting()">
                        <i class="fas fa-video"></i>
                        <span>Start Meeting</span>
                      </button>
                      <button class="quick-action-btn" (click)="sendBroadcast()">
                        <i class="fas fa-bullhorn"></i>
                        <span>Broadcast</span>
                      </button>
                      <button class="quick-action-btn" (click)="generateReport()">
                        <i class="fas fa-chart-bar"></i>
                        <span>Generate Report</span>
                      </button>
                      <button class="quick-action-btn" (click)="scheduleInterview()">
                        <i class="fas fa-calendar-plus"></i>
                        <span>Schedule Interview</span>
                      </button>
                    </div>
                  </div>
                  
                  <!-- Productivity Metrics -->
                  <div class="collab-subsection">
                    <h6><i class="fas fa-chart-line"></i> Team Productivity</h6>
                    <div class="productivity-grid">
                      <div class="productivity-metric">
                        <div class="metric-icon completed">
                          <i class="fas fa-check-circle"></i>
                        </div>
                        <div class="metric-info">
                          <span class="metric-number">{{ productivityMetrics.completedTasks }}</span>
                          <span class="metric-label">Tasks Completed</span>
                        </div>
                      </div>
                      <div class="productivity-metric">
                        <div class="metric-icon efficiency">
                          <i class="fas fa-tachometer-alt"></i>
                        </div>
                        <div class="metric-info">
                          <span class="metric-number">{{ productivityMetrics.efficiency }}%</span>
                          <span class="metric-label">Team Efficiency</span>
                        </div>
                      </div>
                      <div class="productivity-metric">
                        <div class="metric-icon response">
                          <i class="fas fa-clock"></i>
                        </div>
                        <div class="metric-info">
                          <span class="metric-number">{{ productivityMetrics.avgResponseTime }}h</span>
                          <span class="metric-label">Avg Response</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Customizable Reporting Widgets -->
            <div class="widget-card">
              <div class="widget-header">
                <h4><i class="fas fa-chart-pie"></i> Custom Reports</h4>
                <div class="widget-actions">
                  <button class="widget-action" (click)="toggleReportDetails()" [title]="showReportDetails ? 'Hide Details' : 'Show Details'">
                    <i class="fas" [class.fa-chevron-up]="showReportDetails" [class.fa-chevron-down]="!showReportDetails"></i>
                  </button>
                  <button class="widget-action" (click)="createCustomReport()" title="Create New Report">
                    <i class="fas fa-plus"></i>
                  </button>
                </div>
              </div>
              <div class="widget-content">
                <!-- Quick Report Stats -->
                <div class="report-metric">
                  <span class="metric-label">Generated Reports</span>
                  <span class="metric-value">{{ reportingStats.generatedReports }}</span>
                </div>
                <div class="report-metric">
                  <span class="metric-label">Scheduled Reports</span>
                  <span class="metric-value">{{ reportingStats.scheduledReports }}</span>
                </div>
                <div class="report-metric">
                  <span class="metric-label">Export Downloads</span>
                  <span class="metric-value">{{ reportingStats.exportDownloads }}</span>
                </div>
                
                <!-- Expanded Reporting Features -->
                <div class="report-advanced-section" *ngIf="showReportDetails">
                  <div class="section-divider"></div>
                  
                  <!-- Quick Report Templates -->
                  <div class="report-subsection">
                    <h6><i class="fas fa-file-alt"></i> Quick Templates</h6>
                    <div class="template-grid">
                      <div class="template-card" *ngFor="let template of reportTemplates" (click)="generateQuickReport(template.id)">
                        <div class="template-icon" [class]="template.type">
                          <i class="fas" [class.fa-users]="template.type === 'hiring'" [class.fa-chart-bar]="template.type === 'performance'" [class.fa-shield-alt]="template.type === 'security'" [class.fa-clock]="template.type === 'time'"></i>
                        </div>
                        <div class="template-info">
                          <span class="template-name">{{ template.name }}</span>
                          <span class="template-desc">{{ template.description }}</span>
                        </div>
                        <div class="template-action">
                          <i class="fas fa-play"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Scheduled Reports -->
                  <div class="report-subsection">
                    <h6><i class="fas fa-calendar-alt"></i> Scheduled Reports</h6>
                    <div class="scheduled-list">
                      <div class="scheduled-item" *ngFor="let report of scheduledReports">
                        <div class="scheduled-icon" [class]="report.status">
                          <i class="fas" [class.fa-check-circle]="report.status === 'active'" [class.fa-pause-circle]="report.status === 'paused'" [class.fa-times-circle]="report.status === 'failed'"></i>
                        </div>
                        <div class="scheduled-details">
                          <span class="scheduled-name">{{ report.name }}</span>
                          <span class="scheduled-frequency">{{ report.frequency }}</span>
                          <span class="scheduled-next">Next: {{ report.nextRun | date:'short' }}</span>
                        </div>
                        <div class="scheduled-actions">
                          <button class="action-btn" (click)="editScheduledReport(report.id)" title="Edit">
                            <i class="fas fa-edit"></i>
                          </button>
                          <button class="action-btn" (click)="toggleScheduledReport(report.id)" [title]="report.status === 'active' ? 'Pause' : 'Resume'">
                            <i class="fas" [class.fa-pause]="report.status === 'active'" [class.fa-play]="report.status !== 'active'"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                    <button class="schedule-report-btn" (click)="scheduleNewReport()">
                      <i class="fas fa-calendar-plus"></i> Schedule New Report
                    </button>
                  </div>
                  
                  <!-- Export Options -->
                  <div class="report-subsection">
                    <h6><i class="fas fa-download"></i> Export Data</h6>
                    <div class="export-options">
                      <button class="export-btn" (click)="exportData('pdf')">
                        <i class="fas fa-file-pdf"></i>
                        <span>PDF Report</span>
                      </button>
                      <button class="export-btn" (click)="exportData('excel')">
                        <i class="fas fa-file-excel"></i>
                        <span>Excel Data</span>
                      </button>
                      <button class="export-btn" (click)="exportData('csv')">
                        <i class="fas fa-file-csv"></i>
                        <span>CSV Export</span>
                      </button>
                      <button class="export-btn" (click)="exportData('json')">
                        <i class="fas fa-code"></i>
                        <span>JSON Data</span>
                      </button>
                    </div>
                  </div>
                  
                  <!-- Custom Chart Builder -->
                  <div class="report-subsection">
                    <h6><i class="fas fa-chart-line"></i> Chart Builder</h6>
                    <div class="chart-builder">
                      <div class="chart-preview">
                        <div class="preview-placeholder">
                          <i class="fas fa-chart-bar"></i>
                          <span>Chart Preview</span>
                        </div>
                      </div>
                      <div class="chart-controls">
                        <select class="chart-select" [(ngModel)]="chartBuilder.type">
                          <option value="bar">Bar Chart</option>
                          <option value="line">Line Chart</option>
                          <option value="pie">Pie Chart</option>
                          <option value="area">Area Chart</option>
                        </select>
                        <select class="chart-select" [(ngModel)]="chartBuilder.dataSource">
                          <option value="applications">Applications</option>
                          <option value="jobs">Jobs</option>
                          <option value="users">Users</option>
                          <option value="interviews">Interviews</option>
                        </select>
                        <button class="build-chart-btn" (click)="buildCustomChart()">
                          <i class="fas fa-magic"></i> Build Chart
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Report Analytics -->
                  <div class="report-subsection">
                    <h6><i class="fas fa-analytics"></i> Report Analytics</h6>
                    <div class="analytics-grid">
                      <div class="analytics-metric">
                        <div class="metric-icon views">
                          <i class="fas fa-eye"></i>
                        </div>
                        <div class="metric-info">
                          <span class="metric-number">{{ reportAnalytics.totalViews }}</span>
                          <span class="metric-label">Total Views</span>
                        </div>
                      </div>
                      <div class="analytics-metric">
                        <div class="metric-icon popular">
                          <i class="fas fa-star"></i>
                        </div>
                        <div class="metric-info">
                          <span class="metric-number">{{ reportAnalytics.mostPopular }}</span>
                          <span class="metric-label">Most Popular</span>
                        </div>
                      </div>
                      <div class="analytics-metric">
                        <div class="metric-icon automation">
                          <i class="fas fa-robot"></i>
                        </div>
                        <div class="metric-info">
                          <span class="metric-number">{{ reportAnalytics.automationRate }}%</span>
                          <span class="metric-label">Automated</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="actions">
          <button (click)="navigateToJobs()" class="btn btn-primary">
            <i class="fas fa-briefcase"></i>
            View Jobs
          </button>
          <button (click)="navigateToApplications()" class="btn btn-secondary">
            <i class="fas fa-file-alt"></i>
            View Applications
          </button>
          <button (click)="navigateToUsers()" class="btn btn-secondary">
            <i class="fas fa-users"></i>
            View Users
          </button>
          <button (click)="openAnalytics()" class="btn btn-info">
            <i class="fas fa-chart-bar"></i>
            Analytics
          </button>
          <button (click)="logout()" class="btn btn-danger">
            <i class="fas fa-sign-out-alt"></i>
            Logout
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .dashboard-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .dashboard-header h1 {
      color: #1e293b;
      margin-bottom: 0.5rem;
    }

    .loading, .error {
      text-align: center;
      padding: 2rem;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f4f6;
      border-top: 4px solid #3b82f6;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      text-align: center;
    }

    .stat-card h3 {
      font-size: 2rem;
      color: #3b82f6;
      margin-bottom: 0.5rem;
    }

    .stat-card p {
      color: #6b7280;
      margin: 0;
    }

    .actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s;
    }

    .btn-primary {
      background: #3b82f6;
      color: white;
    }

    .btn-primary:hover {
      background: #2563eb;
    }

    .btn-secondary {
      background: #6b7280;
      color: white;
    }

    .btn-secondary:hover {
      background: #4b5563;
    }

    .btn-danger {
      background: #ef4444;
      color: white;
    }

    .btn-danger:hover {
      background: #dc2626;
    }

    .btn-info {
      background: #06b6d4;
      color: white;
    }

    .btn-info:hover {
      background: #0891b2;
    }

    .error {
      color: #ef4444;
    }

    /* Advanced Dashboard Styles */
    .dashboard-grid {
      display: grid;
      grid-template-columns: 1fr 400px;
      gap: 2rem;
      margin-bottom: 2rem;
    }

    .advanced-sidebar {
      background: #f8fafc;
      padding: 1.5rem;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
      max-height: 800px;
      overflow-y: auto;
    }

    .sidebar-title {
      color: #1e293b;
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 1.5rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .widget-card {
      background: white;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
      margin-bottom: 1rem;
      overflow: hidden;
      transition: all 0.2s ease;
    }

    .widget-card:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transform: translateY(-2px);
    }

    .widget-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .widget-header h4 {
      margin: 0;
      font-size: 0.9rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .widget-action {
      background: rgba(255, 255, 255, 0.2);
      border: none;
      color: white;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      cursor: pointer;
      transition: background 0.2s;
    }

    .widget-action:hover {
      background: rgba(255, 255, 255, 0.3);
    }

    .widget-content {
      padding: 1rem;
    }

    .status-indicator {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #ef4444;
    }

    .status-indicator.active {
      background: #10b981;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    .live-metric, .security-metric, .quality-metric, .health-metric {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem 0;
      border-bottom: 1px solid #f1f5f9;
    }

    .live-metric:last-child, .security-metric:last-child, 
    .quality-metric:last-child, .health-metric:last-child {
      border-bottom: none;
    }

    .metric-label {
      font-size: 0.85rem;
      color: #64748b;
    }

    .metric-value {
      font-weight: 600;
      font-size: 0.9rem;
      color: #1e293b;
    }

    .metric-value.success {
      color: #10b981;
    }

    .metric-value.warning {
      color: #f59e0b;
    }

    .metric-value.alert {
      color: #ef4444;
    }

    .security-status {
      background: #10b981;
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .security-status.warning {
      background: #f59e0b;
    }

    .security-status.danger {
      background: #ef4444;
    }

    .insight-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.75rem 0;
      border-bottom: 1px solid #f1f5f9;
    }

    .insight-item:last-child {
      border-bottom: none;
    }

    .insight-icon {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 0.8rem;
    }

    .insight-icon.churn {
      background: #ef4444;
    }

    .insight-icon.bias {
      background: #8b5cf6;
    }

    .insight-icon.prediction {
      background: #06b6d4;
    }

    .insight-text {
      flex: 1;
    }

    .insight-title {
      display: block;
      font-weight: 600;
      font-size: 0.85rem;
      color: #1e293b;
    }

    .insight-desc {
      display: block;
      font-size: 0.75rem;
      color: #64748b;
      margin-top: 0.25rem;
    }

    .widget-actions {
      display: flex;
      gap: 0.5rem;
    }

    .insight-trend {
      margin-top: 0.5rem;
    }

    .trend-indicator {
      font-size: 0.7rem;
      padding: 0.2rem 0.5rem;
      border-radius: 8px;
      font-weight: 600;
    }

    .trend-up {
      background: #fee2e2;
      color: #dc2626;
    }

    .trend-down {
      background: #dcfce7;
      color: #16a34a;
    }

    .trend-stable {
      background: #fef3c7;
      color: #d97706;
    }

    .bias-breakdown {
      margin-top: 0.5rem;
    }

    .bias-metric {
      display: flex;
      justify-content: space-between;
      font-size: 0.7rem;
      color: #64748b;
      gap: 1rem;
    }

    .forecast-details {
      margin-top: 0.5rem;
    }

    .forecast-metric {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.25rem;
      font-size: 0.7rem;
    }

    .ai-advanced-section {
      margin-top: 1rem;
    }

    .section-divider {
      height: 1px;
      background: #e2e8f0;
      margin: 1rem 0;
    }

    .insight-icon.skills {
      background: #f59e0b;
    }

    .insight-icon.market {
      background: #10b981;
    }

    .skill-gaps {
      margin-top: 0.5rem;
    }

    .skill-gap {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.25rem;
      font-size: 0.7rem;
    }

    .skill-name {
      font-weight: 500;
      color: #1e293b;
    }

    .gap-severity {
      padding: 0.1rem 0.4rem;
      border-radius: 6px;
      font-weight: 600;
      font-size: 0.65rem;
    }

    .gap-severity.critical {
      background: #fee2e2;
      color: #dc2626;
    }

    .gap-severity.high {
      background: #fef3c7;
      color: #d97706;
    }

    .gap-severity.medium {
      background: #dbeafe;
      color: #2563eb;
    }

    .market-insights {
      margin-top: 0.5rem;
    }

    .market-metric {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.25rem;
      font-size: 0.7rem;
    }

    .ai-recommendations {
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid #e2e8f0;
    }

    .ai-recommendations h5 {
      margin: 0 0 0.75rem 0;
      font-size: 0.8rem;
      font-weight: 600;
      color: #1e293b;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .recommendation {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      margin-bottom: 0.75rem;
      padding: 0.5rem;
      background: #f8fafc;
      border-radius: 6px;
    }

    .rec-priority {
      width: 4px;
      height: 100%;
      border-radius: 2px;
      min-height: 40px;
    }

    .rec-priority.high {
      background: #ef4444;
    }

    .rec-priority.medium {
      background: #f59e0b;
    }

    .rec-priority.low {
      background: #10b981;
    }

    .rec-content {
      flex: 1;
    }

    .rec-title {
      display: block;
      font-weight: 600;
      font-size: 0.75rem;
      color: #1e293b;
      margin-bottom: 0.25rem;
    }

    .rec-desc {
      display: block;
      font-size: 0.7rem;
      color: #64748b;
      line-height: 1.4;
    }

    /* Security & Compliance Styles */
    .security-advanced-section {
      margin-top: 1rem;
    }

    .security-subsection {
      margin-bottom: 1.5rem;
    }

    .security-subsection h6 {
      margin: 0 0 0.75rem 0;
      font-size: 0.8rem;
      font-weight: 600;
      color: #1e293b;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .threat-list {
      max-height: 200px;
      overflow-y: auto;
    }

    .threat-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.5rem;
      margin-bottom: 0.5rem;
      background: #f8fafc;
      border-radius: 6px;
      border-left: 3px solid transparent;
    }

    .threat-item:hover {
      background: #f1f5f9;
    }

    .threat-severity {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .threat-severity.high {
      background: #ef4444;
      box-shadow: 0 0 8px rgba(239, 68, 68, 0.4);
    }

    .threat-severity.medium {
      background: #f59e0b;
      box-shadow: 0 0 8px rgba(245, 158, 11, 0.4);
    }

    .threat-severity.low {
      background: #10b981;
      box-shadow: 0 0 8px rgba(16, 185, 129, 0.4);
    }

    .threat-details {
      flex: 1;
    }

    .threat-type {
      display: block;
      font-weight: 600;
      font-size: 0.75rem;
      color: #1e293b;
    }

    .threat-desc {
      display: block;
      font-size: 0.7rem;
      color: #64748b;
      margin: 0.25rem 0;
    }

    .threat-time {
      display: block;
      font-size: 0.65rem;
      color: #94a3b8;
    }

    .threat-action {
      background: #3b82f6;
      color: white;
      border: none;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.7rem;
      transition: background 0.2s;
    }

    .threat-action:hover {
      background: #2563eb;
    }

    .compliance-grid {
      display: grid;
      gap: 0.5rem;
    }

    .compliance-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.5rem;
      background: #f8fafc;
      border-radius: 6px;
    }

    .compliance-icon {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.7rem;
      color: white;
    }

    .compliance-icon.compliant {
      background: #10b981;
    }

    .compliance-icon.warning {
      background: #f59e0b;
    }

    .compliance-icon.violation {
      background: #ef4444;
    }

    .compliance-info {
      flex: 1;
    }

    .compliance-name {
      display: block;
      font-weight: 600;
      font-size: 0.75rem;
      color: #1e293b;
    }

    .compliance-desc {
      display: block;
      font-size: 0.7rem;
      color: #64748b;
    }

    .audit-list {
      max-height: 150px;
      overflow-y: auto;
    }

    .audit-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.5rem 0;
      border-bottom: 1px solid #f1f5f9;
    }

    .audit-item:last-child {
      border-bottom: none;
    }

    .audit-icon {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.6rem;
      color: white;
    }

    .audit-icon.user {
      background: #3b82f6;
    }

    .audit-icon.data {
      background: #8b5cf6;
    }

    .audit-icon.system {
      background: #64748b;
    }

    .audit-details {
      flex: 1;
    }

    .audit-action {
      display: block;
      font-weight: 500;
      font-size: 0.75rem;
      color: #1e293b;
    }

    .audit-user {
      display: block;
      font-size: 0.7rem;
      color: #64748b;
    }

    .audit-time {
      display: block;
      font-size: 0.65rem;
      color: #94a3b8;
    }

    .security-recommendations {
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid #e2e8f0;
    }

    .security-recommendations h6 {
      margin: 0 0 0.75rem 0;
      font-size: 0.8rem;
      font-weight: 600;
      color: #1e293b;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .security-rec {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      margin-bottom: 0.75rem;
      padding: 0.5rem;
      background: #f8fafc;
      border-radius: 6px;
    }

    .sec-rec-priority {
      width: 4px;
      height: 100%;
      border-radius: 2px;
      min-height: 50px;
    }

    .sec-rec-priority.high {
      background: #ef4444;
    }

    .sec-rec-priority.medium {
      background: #f59e0b;
    }

    .sec-rec-priority.low {
      background: #10b981;
    }

    .sec-rec-content {
      flex: 1;
    }

    .sec-rec-title {
      display: block;
      font-weight: 600;
      font-size: 0.75rem;
      color: #1e293b;
      margin-bottom: 0.25rem;
    }

    .sec-rec-desc {
      display: block;
      font-size: 0.7rem;
      color: #64748b;
      line-height: 1.4;
      margin-bottom: 0.5rem;
    }

    .sec-rec-action {
      background: #3b82f6;
      color: white;
      border: none;
      padding: 0.25rem 0.75rem;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.7rem;
      font-weight: 500;
      transition: background 0.2s;
    }

    .sec-rec-action:hover {
      background: #2563eb;
    }

    /* Collaboration & Productivity Styles */
    .notification-badge {
      background: #ef4444;
      color: white;
      border-radius: 50%;
      width: 18px;
      height: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.7rem;
      font-weight: 600;
    }

    .collab-metric {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem 0;
      border-bottom: 1px solid #f1f5f9;
    }

    .collab-metric:last-child {
      border-bottom: none;
    }

    .collab-advanced-section {
      margin-top: 1rem;
    }

    .collab-subsection {
      margin-bottom: 1.5rem;
    }

    .collab-subsection h6 {
      margin: 0 0 0.75rem 0;
      font-size: 0.8rem;
      font-weight: 600;
      color: #1e293b;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .notification-list {
      max-height: 200px;
      overflow-y: auto;
    }

    .notification-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.5rem;
      margin-bottom: 0.5rem;
      background: #f8fafc;
      border-radius: 6px;
      transition: all 0.2s;
    }

    .notification-item.unread {
      background: #eff6ff;
      border-left: 3px solid #3b82f6;
    }

    .notification-item:hover {
      background: #f1f5f9;
    }

    .notification-icon {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.7rem;
      color: white;
    }

    .notification-icon.user {
      background: #3b82f6;
    }

    .notification-icon.application {
      background: #10b981;
    }

    .notification-icon.job {
      background: #f59e0b;
    }

    .notification-icon.alert {
      background: #ef4444;
    }

    .notification-content {
      flex: 1;
    }

    .notification-title {
      display: block;
      font-weight: 600;
      font-size: 0.75rem;
      color: #1e293b;
    }

    .notification-desc {
      display: block;
      font-size: 0.7rem;
      color: #64748b;
      margin: 0.25rem 0;
    }

    .notification-time {
      display: block;
      font-size: 0.65rem;
      color: #94a3b8;
    }

    .notification-action {
      background: #10b981;
      color: white;
      border: none;
      padding: 0.25rem;
      border-radius: 50%;
      cursor: pointer;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.7rem;
      transition: background 0.2s;
    }

    .notification-action:hover {
      background: #059669;
    }

    .task-list {
      margin-bottom: 1rem;
    }

    .task-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem;
      margin-bottom: 0.5rem;
      background: #f8fafc;
      border-radius: 6px;
      border-left: 3px solid transparent;
    }

    .task-priority {
      width: 4px;
      height: 100%;
      border-radius: 2px;
      min-height: 40px;
    }

    .task-priority.high {
      background: #ef4444;
    }

    .task-priority.medium {
      background: #f59e0b;
    }

    .task-priority.low {
      background: #10b981;
    }

    .task-content {
      flex: 1;
    }

    .task-title {
      display: block;
      font-weight: 600;
      font-size: 0.75rem;
      color: #1e293b;
    }

    .task-assignee {
      display: block;
      font-size: 0.7rem;
      color: #64748b;
      margin: 0.25rem 0;
    }

    .task-due {
      display: block;
      font-size: 0.65rem;
      color: #94a3b8;
    }

    .task-status {
      padding: 0.25rem 0.5rem;
      border-radius: 12px;
      font-size: 0.65rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .task-status.pending {
      background: #fef3c7;
      color: #d97706;
    }

    .task-status.in-progress {
      background: #dbeafe;
      color: #2563eb;
    }

    .task-status.completed {
      background: #dcfce7;
      color: #16a34a;
    }

    .add-task-btn {
      width: 100%;
      background: #3b82f6;
      color: white;
      border: none;
      padding: 0.5rem;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.75rem;
      font-weight: 500;
      transition: background 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .add-task-btn:hover {
      background: #2563eb;
    }

    .quick-actions {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.5rem;
    }

    .quick-action-btn {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      padding: 0.75rem;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      text-align: center;
    }

    .quick-action-btn:hover {
      background: #f1f5f9;
      border-color: #cbd5e1;
      transform: translateY(-1px);
    }

    .quick-action-btn i {
      font-size: 1.2rem;
      color: #3b82f6;
    }

    .quick-action-btn span {
      font-size: 0.7rem;
      font-weight: 500;
      color: #1e293b;
    }

    .productivity-grid {
      display: grid;
      gap: 0.75rem;
    }

    .productivity-metric {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem;
      background: #f8fafc;
      border-radius: 6px;
    }

    .metric-icon {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 0.9rem;
    }

    .metric-icon.completed {
      background: #10b981;
    }

    .metric-icon.efficiency {
      background: #3b82f6;
    }

    .metric-icon.response {
      background: #f59e0b;
    }

    .metric-info {
      flex: 1;
    }

    .metric-number {
      display: block;
      font-weight: 600;
      font-size: 1rem;
      color: #1e293b;
    }

    .metric-label {
      display: block;
      font-size: 0.7rem;
      color: #64748b;
    }

    /* Customizable Reporting Styles */
    .report-metric {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem 0;
      border-bottom: 1px solid #f1f5f9;
    }

    .report-metric:last-child {
      border-bottom: none;
    }

    .report-advanced-section {
      margin-top: 1rem;
    }

    .report-subsection {
      margin-bottom: 1.5rem;
    }

    .report-subsection h6 {
      margin: 0 0 0.75rem 0;
      font-size: 0.8rem;
      font-weight: 600;
      color: #1e293b;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .template-grid {
      display: grid;
      gap: 0.5rem;
    }

    .template-card {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem;
      background: #f8fafc;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
      border: 1px solid #e2e8f0;
    }

    .template-card:hover {
      background: #f1f5f9;
      border-color: #cbd5e1;
      transform: translateY(-1px);
    }

    .template-icon {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 0.9rem;
    }

    .template-icon.hiring {
      background: #10b981;
    }

    .template-icon.performance {
      background: #3b82f6;
    }

    .template-icon.security {
      background: #ef4444;
    }

    .template-icon.time {
      background: #f59e0b;
    }

    .template-info {
      flex: 1;
    }

    .template-name {
      display: block;
      font-weight: 600;
      font-size: 0.75rem;
      color: #1e293b;
    }

    .template-desc {
      display: block;
      font-size: 0.7rem;
      color: #64748b;
    }

    .template-action {
      color: #3b82f6;
      font-size: 0.8rem;
    }

    .scheduled-list {
      margin-bottom: 1rem;
    }

    .scheduled-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem;
      margin-bottom: 0.5rem;
      background: #f8fafc;
      border-radius: 6px;
    }

    .scheduled-icon {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.7rem;
      color: white;
    }

    .scheduled-icon.active {
      background: #10b981;
    }

    .scheduled-icon.paused {
      background: #f59e0b;
    }

    .scheduled-icon.failed {
      background: #ef4444;
    }

    .scheduled-details {
      flex: 1;
    }

    .scheduled-name {
      display: block;
      font-weight: 600;
      font-size: 0.75rem;
      color: #1e293b;
    }

    .scheduled-frequency {
      display: block;
      font-size: 0.7rem;
      color: #64748b;
      margin: 0.25rem 0;
    }

    .scheduled-next {
      display: block;
      font-size: 0.65rem;
      color: #94a3b8;
    }

    .scheduled-actions {
      display: flex;
      gap: 0.5rem;
    }

    .action-btn {
      background: #f1f5f9;
      border: 1px solid #e2e8f0;
      color: #64748b;
      padding: 0.25rem;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.7rem;
      transition: all 0.2s;
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .action-btn:hover {
      background: #e2e8f0;
      color: #1e293b;
    }

    .schedule-report-btn {
      width: 100%;
      background: #3b82f6;
      color: white;
      border: none;
      padding: 0.5rem;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.75rem;
      font-weight: 500;
      transition: background 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .schedule-report-btn:hover {
      background: #2563eb;
    }

    .export-options {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.5rem;
    }

    .export-btn {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      padding: 0.75rem;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      text-align: center;
    }

    .export-btn:hover {
      background: #f1f5f9;
      border-color: #cbd5e1;
      transform: translateY(-1px);
    }

    .export-btn i {
      font-size: 1.2rem;
      color: #ef4444;
    }

    .export-btn span {
      font-size: 0.7rem;
      font-weight: 500;
      color: #1e293b;
    }

    .chart-builder {
      background: #f8fafc;
      border-radius: 6px;
      padding: 1rem;
    }

    .chart-preview {
      height: 120px;
      background: white;
      border: 2px dashed #e2e8f0;
      border-radius: 6px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-bottom: 1rem;
    }

    .preview-placeholder i {
      font-size: 2rem;
      color: #cbd5e1;
      margin-bottom: 0.5rem;
    }

    .preview-placeholder span {
      font-size: 0.8rem;
      color: #94a3b8;
    }

    .chart-controls {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }

    .chart-select {
      flex: 1;
      padding: 0.5rem;
      border: 1px solid #e2e8f0;
      border-radius: 4px;
      font-size: 0.75rem;
      background: white;
    }

    .build-chart-btn {
      background: #8b5cf6;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.75rem;
      font-weight: 500;
      transition: background 0.2s;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      white-space: nowrap;
    }

    .build-chart-btn:hover {
      background: #7c3aed;
    }

    .analytics-grid {
      display: grid;
      gap: 0.75rem;
    }

    .analytics-metric {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem;
      background: #f8fafc;
      border-radius: 6px;
    }

    .metric-icon.views {
      background: #06b6d4;
    }

    .metric-icon.popular {
      background: #f59e0b;
    }

    .metric-icon.automation {
      background: #8b5cf6;
    }

    .geo-stat {
      margin-bottom: 1rem;
    }

    .region-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    .region-name {
      font-weight: 500;
      font-size: 0.85rem;
      color: #1e293b;
    }

    .region-count {
      font-size: 0.75rem;
      color: #64748b;
    }

    .region-bar {
      height: 6px;
      background: #f1f5f9;
      border-radius: 3px;
      overflow: hidden;
    }

    .bar-fill {
      height: 100%;
      background: linear-gradient(90deg, #3b82f6, #06b6d4);
      transition: width 0.3s ease;
    }

    .quality-score {
      background: #10b981;
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .health-indicator {
      background: #10b981;
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .health-indicator.warning {
      background: #f59e0b;
    }

    .health-indicator.danger {
      background: #ef4444;
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1rem;
      color: white;
      font-size: 1.5rem;
    }

    .users-icon {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .jobs-icon {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    }

    .applications-icon {
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    }

    .ai-icon {
      background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
    }

    .stat-trend {
      font-size: 0.75rem;
      font-weight: 600;
      padding: 0.25rem 0.5rem;
      border-radius: 12px;
      margin-top: 0.5rem;
      display: inline-block;
    }

    .stat-trend.positive {
      background: #dcfce7;
      color: #16a34a;
    }

    .stat-trend.negative {
      background: #fee2e2;
      color: #dc2626;
    }

    @media (max-width: 1024px) {
      .dashboard-grid {
        grid-template-columns: 1fr;
      }
      
      .advanced-sidebar {
        max-height: none;
      }
    }

    @media (max-width: 768px) {
      .dashboard-container {
        padding: 1rem;
      }
      
      .stats-grid {
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  user: ApiUser | null = null;
  loading = false;
  error: string | null = null;
  userRole: string = '';
  
  stats = {
    totalUsers: 0,
    totalJobs: 0,
    totalApplications: 0
  };

  // Advanced dashboard data
  aiScreenings = 0;
  
  liveMetrics = {
    activeSessions: 0,
    aiProcessing: 0,
    newApplications: 0
  };

  aiInsights = {
    churnRisk: 0,
    biasScore: 0,
    hiringForecast: 0
  };

  // Advanced AI features
  showAIDetails = false;
  aiLoading = false;
  
  biasBreakdown = {
    gender: 0,
    age: 0,
    location: 0
  };
  
  predictiveMetrics = {
    next30Days: 0,
    successRate: 0
  };
  
  skillGaps = [
    { skill: 'React', percentage: 25, severity: 'high' },
    { skill: 'Python', percentage: 15, severity: 'medium' },
    { skill: 'DevOps', percentage: 35, severity: 'critical' }
  ];
  
  marketData = {
    salaryTrend: 0,
    competition: 'Medium',
    demandScore: 0
  };
  
  aiRecommendations = [
    {
      title: 'Optimize Job Descriptions',
      description: 'AI detected bias in 3 job postings. Review language for inclusivity.',
      priority: 'high'
    },
    {
      title: 'Expand Sourcing Channels',
      description: 'Low diversity in candidate pool. Consider new platforms.',
      priority: 'medium'
    },
    {
      title: 'Skill Assessment Update',
      description: 'Update technical assessments to match market demands.',
      priority: 'low'
    }
  ];

  securityStatus = {
    level: 'secure'
  };

  securityMetrics = {
    failedLogins: 0,
    twoFAAdoption: 0,
    gdprCompliance: 0,
    activeThreats: 0
  };
  
  // Advanced security features
  showSecurityDetails = false;
  
  recentThreats = [
    {
      id: 1,
      type: 'Brute Force',
      description: 'Multiple failed login attempts from IP 192.168.1.100',
      severity: 'high',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: 2,
      type: 'Suspicious Activity',
      description: 'Unusual data access pattern detected',
      severity: 'medium',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000)
    },
    {
      id: 3,
      type: 'Policy Violation',
      description: 'User attempted to access restricted data',
      severity: 'low',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000)
    }
  ];
  
  complianceStatus = [
    {
      name: 'GDPR',
      description: 'Data protection compliance',
      status: 'compliant'
    },
    {
      name: 'SOC 2',
      description: 'Security controls audit',
      status: 'compliant'
    },
    {
      name: 'ISO 27001',
      description: 'Information security management',
      status: 'warning'
    },
    {
      name: 'CCPA',
      description: 'California privacy compliance',
      status: 'compliant'
    }
  ];
  
  auditEvents = [
    {
      action: 'User login',
      user: 'admin@company.com',
      type: 'user',
      timestamp: new Date(Date.now() - 30 * 60 * 1000)
    },
    {
      action: 'Data export',
      user: 'recruiter@company.com',
      type: 'data',
      timestamp: new Date(Date.now() - 45 * 60 * 1000)
    },
    {
      action: 'System configuration change',
      user: 'system',
      type: 'system',
      timestamp: new Date(Date.now() - 60 * 60 * 1000)
    }
  ];
  
  securityRecommendations = [
    {
      id: 1,
      title: 'Enable Rate Limiting',
      description: 'Implement stricter rate limiting to prevent brute force attacks',
      priority: 'high',
      actionText: 'Configure'
    },
    {
      id: 2,
      title: 'Update Security Policies',
      description: 'Review and update data access policies for compliance',
      priority: 'medium',
      actionText: 'Review'
    },
    {
      id: 3,
      title: 'Security Training',
      description: 'Schedule security awareness training for all users',
      priority: 'low',
      actionText: 'Schedule'
    }
  ];
  
  // Collaboration & Productivity features
  showCollabDetails = false;
  unreadNotifications = 0;
  
  collaborationStats = {
    activeMembers: 0,
    pendingTasks: 0,
    messagesCount: 0
  };
  
  recentNotifications = [
    {
      id: 1,
      title: 'New Application',
      message: 'Sarah Johnson applied for Senior Developer position',
      type: 'application',
      read: false,
      timestamp: new Date(Date.now() - 15 * 60 * 1000)
    },
    {
      id: 2,
      title: 'Interview Scheduled',
      message: 'Interview with John Doe scheduled for tomorrow 2 PM',
      type: 'job',
      read: false,
      timestamp: new Date(Date.now() - 30 * 60 * 1000)
    },
    {
      id: 3,
      title: 'Team Member Online',
      message: 'Mike Smith is now online and available',
      type: 'user',
      read: true,
      timestamp: new Date(Date.now() - 45 * 60 * 1000)
    },
    {
      id: 4,
      title: 'System Alert',
      message: 'High CPU usage detected on server-01',
      type: 'alert',
      read: false,
      timestamp: new Date(Date.now() - 60 * 60 * 1000)
    }
  ];
  
  teamTasks = [
    {
      id: 1,
      title: 'Review candidate applications',
      assignee: 'Jane Smith',
      priority: 'high',
      status: 'in-progress',
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000)
    },
    {
      id: 2,
      title: 'Update job descriptions',
      assignee: 'Mike Johnson',
      priority: 'medium',
      status: 'pending',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
    },
    {
      id: 3,
      title: 'Conduct technical interviews',
      assignee: 'Sarah Wilson',
      priority: 'high',
      status: 'completed',
      dueDate: new Date(Date.now() - 24 * 60 * 60 * 1000)
    },
    {
      id: 4,
      title: 'Prepare hiring report',
      assignee: 'David Brown',
      priority: 'low',
      status: 'pending',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }
  ];
  
  productivityMetrics = {
    completedTasks: 0,
    efficiency: 0,
    avgResponseTime: 0
  };
  
  // Customizable Reporting features
  showReportDetails = false;
  
  reportingStats = {
    generatedReports: 0,
    scheduledReports: 0,
    exportDownloads: 0
  };
  
  reportTemplates = [
    {
      id: 1,
      name: 'Hiring Pipeline',
      description: 'Complete hiring funnel analysis',
      type: 'hiring'
    },
    {
      id: 2,
      name: 'Team Performance',
      description: 'Recruiter and team metrics',
      type: 'performance'
    },
    {
      id: 3,
      name: 'Security Audit',
      description: 'Security and compliance report',
      type: 'security'
    },
    {
      id: 4,
      name: 'Time Analytics',
      description: 'Time-to-hire and efficiency metrics',
      type: 'time'
    }
  ];
  
  scheduledReports = [
    {
      id: 1,
      name: 'Weekly Hiring Summary',
      frequency: 'Weekly - Mondays',
      status: 'active',
      nextRun: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
    },
    {
      id: 2,
      name: 'Monthly Performance Review',
      frequency: 'Monthly - 1st',
      status: 'active',
      nextRun: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
    },
    {
      id: 3,
      name: 'Security Compliance Check',
      frequency: 'Daily - 9 AM',
      status: 'paused',
      nextRun: new Date(Date.now() + 24 * 60 * 60 * 1000)
    }
  ];
  
  chartBuilder = {
    type: 'bar',
    dataSource: 'applications'
  };
  
  reportAnalytics = {
    totalViews: 0,
    mostPopular: '',
    automationRate: 0
  };

  topRegions = [
    { name: 'North America', candidates: 1250, percentage: 45 },
    { name: 'Europe', candidates: 890, percentage: 32 },
    { name: 'Asia Pacific', candidates: 640, percentage: 23 }
  ];

  jobQuality = {
    averageScore: 0,
    highQuality: 0,
    needsImprovement: 0,
    complianceIssues: 0
  };

  systemHealth = {
    status: 'healthy',
    uptime: 0,
    apiResponseTime: 0,
    dbLoad: 0,
    aiServiceStatus: 'Online'
  };

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserData();
    this.loadDashboardData();
    this.initializeAdvancedData();
    this.startRealTimeUpdates();
  }

  private loadUserData(): void {
    this.user = this.authService.getCurrentUser();
    this.userRole = this.user?.role || '';
  }

  private loadDashboardData(): void {
    this.loading = true;
    this.error = null;

    const userRole = this.user?.role;
    if (!userRole) {
      this.error = 'User role not found';
      this.loading = false;
      return;
    }

    // Mock data loading
    setTimeout(() => {
      this.stats = {
        totalUsers: 1247,
        totalJobs: 89,
        totalApplications: 2156
      };
      this.loading = false;
    }, 1000);
  }

  getDashboardTitle(): string {
    switch (this.user?.role) {
      case 'ADMIN': return 'Admin Dashboard';
      case 'RECRUITER': return 'Recruiter Dashboard';
      case 'CANDIDATE': return 'Candidate Dashboard';
      default: return 'Dashboard';
    }
  }

  getUserName(): string {
    if (this.user?.fullName) {
      return this.user.fullName;
    }
    return this.user?.email?.split('@')[0] || 'User';
  }
  
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  navigateToJobs(): void {
    this.router.navigate(['/jobs']);
  }

  navigateToApplications(): void {
    this.router.navigate(['/applications']);
  }

  navigateToUsers(): void {
    this.router.navigate(['/users']);
  }

  openAnalytics(): void {
    // Navigate to analytics page or open analytics modal
    this.router.navigate(['/analytics']);
  }

  refreshAIInsights(): void {
    // Simulate AI insights refresh with advanced analytics
    this.aiLoading = true;
    setTimeout(() => {
      this.aiInsights = {
        churnRisk: Math.floor(Math.random() * 50) + 10,
        biasScore: Math.floor(Math.random() * 20) + 80,
        hiringForecast: Math.floor(Math.random() * 10) + 15
      };
      
      // Update advanced metrics
      this.biasBreakdown = {
        gender: Math.floor(Math.random() * 10) + 90,
        age: Math.floor(Math.random() * 15) + 85,
        location: Math.floor(Math.random() * 8) + 92
      };
      
      this.predictiveMetrics = {
        next30Days: Math.floor(Math.random() * 20) + 15,
        successRate: Math.floor(Math.random() * 15) + 80
      };
      
      this.marketData = {
        salaryTrend: Math.floor(Math.random() * 10) + 5,
        competition: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
        demandScore: Math.floor(Math.random() * 3) + 7
      };
      
      this.aiLoading = false;
    }, 2000);
  }
  
  toggleAIDetails(): void {
    this.showAIDetails = !this.showAIDetails;
  }
  
  getChurnTrend(): string {
    const trend = Math.random();
    if (trend > 0.6) return 'trend-up';
    if (trend > 0.3) return 'trend-stable';
    return 'trend-down';
  }
  
  getChurnTrendText(): string {
    const trendClass = this.getChurnTrend();
    switch (trendClass) {
      case 'trend-up': return '↑ Increasing';
      case 'trend-down': return '↓ Decreasing';
      default: return '→ Stable';
    }
  }
  
  toggleSecurityDetails(): void {
    this.showSecurityDetails = !this.showSecurityDetails;
  }
  
  getSecurityMetricClass(metric: string): string {
    switch (metric) {
      case 'failedLogins':
        return this.securityMetrics.failedLogins > 10 ? 'alert' : this.securityMetrics.failedLogins > 5 ? 'warning' : 'success';
      case 'twoFA':
        return this.securityMetrics.twoFAAdoption > 80 ? 'success' : this.securityMetrics.twoFAAdoption > 60 ? 'warning' : 'alert';
      case 'threats':
        return this.securityMetrics.activeThreats > 0 ? 'alert' : 'success';
      default:
        return '';
    }
  }
  
  investigateThreat(threatId: number): void {
    console.log('Investigating threat:', threatId);
    // Navigate to detailed threat investigation page
  }
  
  implementSecurityRec(recId: number): void {
    console.log('Implementing security recommendation:', recId);
    // Navigate to security configuration or show implementation modal
  }
  
  toggleCollabDetails(): void {
    this.showCollabDetails = !this.showCollabDetails;
  }
  
  markAsRead(notificationId: number): void {
    const notification = this.recentNotifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      this.unreadNotifications = Math.max(0, this.unreadNotifications - 1);
    }
  }
  
  openTaskModal(): void {
    console.log('Opening task creation modal');
    // Open modal for creating new tasks
  }
  
  startTeamMeeting(): void {
    console.log('Starting team meeting');
    // Integrate with video conferencing platform
  }
  
  sendBroadcast(): void {
    console.log('Sending broadcast message');
    // Open broadcast message modal
  }
  
  generateReport(): void {
    console.log('Generating productivity report');
    // Navigate to report generation page
  }
  
  scheduleInterview(): void {
    console.log('Scheduling interview');
    // Navigate to interview scheduling page
  }
  
  toggleReportDetails(): void {
    this.showReportDetails = !this.showReportDetails;
  }
  
  createCustomReport(): void {
    console.log('Creating custom report');
    // Open custom report builder modal
  }
  
  generateQuickReport(templateId: number): void {
    console.log('Generating quick report:', templateId);
    // Generate report based on template
    this.reportingStats.generatedReports++;
  }
  
  editScheduledReport(reportId: number): void {
    console.log('Editing scheduled report:', reportId);
    // Open edit modal for scheduled report
  }
  
  toggleScheduledReport(reportId: number): void {
    const report = this.scheduledReports.find(r => r.id === reportId);
    if (report) {
      report.status = report.status === 'active' ? 'paused' : 'active';
    }
  }
  
  scheduleNewReport(): void {
    console.log('Scheduling new report');
    // Open schedule report modal
  }
  
  exportData(format: string): void {
    console.log('Exporting data as:', format);
    // Trigger data export in specified format
    this.reportingStats.exportDownloads++;
  }
  
  buildCustomChart(): void {
    console.log('Building custom chart:', this.chartBuilder);
    // Build and display custom chart
  }

  toggleMapView(): void {
    // Toggle between map and list view for geographic insights
    console.log('Toggle map view');
  }

  // Initialize advanced dashboard data with realistic mock values
  private initializeAdvancedData(): void {
    // Real-time metrics
    this.liveMetrics = {
      activeSessions: Math.floor(Math.random() * 100) + 50,
      aiProcessing: Math.floor(Math.random() * 20) + 5,
      newApplications: Math.floor(Math.random() * 15) + 3
    };

    // AI insights
    this.aiInsights = {
      churnRisk: Math.floor(Math.random() * 30) + 15,
      biasScore: Math.floor(Math.random() * 15) + 85,
      hiringForecast: Math.floor(Math.random() * 8) + 18
    };
    
    // Initialize advanced AI metrics
    this.biasBreakdown = {
      gender: Math.floor(Math.random() * 10) + 90,
      age: Math.floor(Math.random() * 15) + 85,
      location: Math.floor(Math.random() * 8) + 92
    };
    
    this.predictiveMetrics = {
      next30Days: Math.floor(Math.random() * 20) + 15,
      successRate: Math.floor(Math.random() * 15) + 80
    };
    
    this.marketData = {
      salaryTrend: Math.floor(Math.random() * 10) + 5,
      competition: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
      demandScore: Math.floor(Math.random() * 3) + 7
    };
    
    // Update skill gaps with dynamic data
    this.skillGaps = [
      { skill: 'React', percentage: Math.floor(Math.random() * 20) + 15, severity: 'high' },
      { skill: 'Python', percentage: Math.floor(Math.random() * 15) + 10, severity: 'medium' },
      { skill: 'DevOps', percentage: Math.floor(Math.random() * 25) + 20, severity: 'critical' },
      { skill: 'Machine Learning', percentage: Math.floor(Math.random() * 30) + 25, severity: 'high' }
    ];

    // Security metrics
    this.securityMetrics = {
      failedLogins: Math.floor(Math.random() * 10) + 2,
      twoFAAdoption: Math.floor(Math.random() * 20) + 70,
      gdprCompliance: Math.floor(Math.random() * 5) + 95,
      activeThreats: Math.floor(Math.random() * 3)
    };
    
    // Update security status based on metrics
    this.updateSecurityStatus();
    
    // Initialize collaboration stats
    this.collaborationStats = {
      activeMembers: Math.floor(Math.random() * 10) + 15,
      pendingTasks: Math.floor(Math.random() * 8) + 5,
      messagesCount: Math.floor(Math.random() * 50) + 25
    };
    
    // Initialize productivity metrics
    this.productivityMetrics = {
      completedTasks: Math.floor(Math.random() * 20) + 35,
      efficiency: Math.floor(Math.random() * 15) + 80,
      avgResponseTime: Math.floor(Math.random() * 3) + 2
    };
    
    // Count unread notifications
    this.unreadNotifications = this.recentNotifications.filter(n => !n.read).length;
    
    // Initialize reporting stats
    this.reportingStats = {
      generatedReports: Math.floor(Math.random() * 50) + 120,
      scheduledReports: Math.floor(Math.random() * 5) + 8,
      exportDownloads: Math.floor(Math.random() * 30) + 45
    };
    
    // Initialize report analytics
    this.reportAnalytics = {
      totalViews: Math.floor(Math.random() * 500) + 1200,
      mostPopular: 'Hiring Pipeline',
      automationRate: Math.floor(Math.random() * 20) + 75
    };

    // Job quality metrics
    this.jobQuality = {
      averageScore: Math.floor(Math.random() * 2) + 8,
      highQuality: Math.floor(Math.random() * 15) + 75,
      needsImprovement: Math.floor(Math.random() * 10) + 15,
      complianceIssues: Math.floor(Math.random() * 5) + 1
    };

    // System health
    this.systemHealth = {
      status: 'healthy',
      uptime: Math.floor(Math.random() * 5) + 95,
      apiResponseTime: Math.floor(Math.random() * 50) + 120,
      dbLoad: Math.floor(Math.random() * 30) + 25,
      aiServiceStatus: 'Online'
    };

    // AI screenings count
    this.aiScreenings = Math.floor(Math.random() * 500) + 1200;
  }

  // Simulate real-time updates
  private startRealTimeUpdates(): void {
    setInterval(() => {
      // Update live metrics every 30 seconds
      this.liveMetrics.activeSessions += Math.floor(Math.random() * 10) - 5;
      this.liveMetrics.aiProcessing = Math.max(0, this.liveMetrics.aiProcessing + Math.floor(Math.random() * 6) - 3);
      this.liveMetrics.newApplications += Math.floor(Math.random() * 3);
      
      // Update AI insights periodically
      if (Math.random() > 0.7) {
        this.aiInsights.churnRisk += Math.floor(Math.random() * 6) - 3;
        this.aiInsights.churnRisk = Math.max(5, Math.min(50, this.aiInsights.churnRisk));
      }
      
      // Ensure realistic bounds
      this.liveMetrics.activeSessions = Math.max(20, Math.min(200, this.liveMetrics.activeSessions));
      this.liveMetrics.newApplications = Math.max(0, this.liveMetrics.newApplications);
    }, 30000);

    // Update system health every minute
    setInterval(() => {
      this.systemHealth.apiResponseTime += Math.floor(Math.random() * 20) - 10;
      this.systemHealth.dbLoad += Math.floor(Math.random() * 10) - 5;
      
      // Ensure realistic bounds
      this.systemHealth.apiResponseTime = Math.max(80, Math.min(300, this.systemHealth.apiResponseTime));
      this.systemHealth.dbLoad = Math.max(10, Math.min(90, this.systemHealth.dbLoad));
    }, 60000);
    
    // Update security metrics every 2 minutes
    setInterval(() => {
      this.securityMetrics.failedLogins += Math.floor(Math.random() * 3) - 1;
      this.securityMetrics.failedLogins = Math.max(0, Math.min(20, this.securityMetrics.failedLogins));
      
      // Occasionally add new threats
      if (Math.random() > 0.9) {
        this.securityMetrics.activeThreats = Math.min(5, this.securityMetrics.activeThreats + 1);
      } else if (Math.random() > 0.7) {
        this.securityMetrics.activeThreats = Math.max(0, this.securityMetrics.activeThreats - 1);
      }
      
      this.updateSecurityStatus();
    }, 120000);
    
    // Update collaboration metrics every 5 minutes
    setInterval(() => {
      this.collaborationStats.messagesCount += Math.floor(Math.random() * 5);
      this.collaborationStats.activeMembers += Math.floor(Math.random() * 3) - 1;
      this.collaborationStats.activeMembers = Math.max(10, Math.min(30, this.collaborationStats.activeMembers));
      
      // Occasionally add new notifications
      if (Math.random() > 0.8) {
        const newNotification = {
          id: Date.now(),
          title: 'New Activity',
          message: 'A new event occurred in the system',
          type: ['user', 'application', 'job', 'alert'][Math.floor(Math.random() * 4)] as any,
          read: false,
          timestamp: new Date()
        };
        this.recentNotifications.unshift(newNotification);
        this.recentNotifications = this.recentNotifications.slice(0, 10); // Keep only latest 10
        this.unreadNotifications++;
      }
    }, 300000);
    
    // Update reporting metrics every 10 minutes
    setInterval(() => {
      // Occasionally increment report stats
      if (Math.random() > 0.7) {
        this.reportingStats.generatedReports++;
      }
      if (Math.random() > 0.9) {
        this.reportingStats.exportDownloads++;
      }
      
      // Update analytics
      this.reportAnalytics.totalViews += Math.floor(Math.random() * 10);
    }, 600000);
  }
  
  private updateSecurityStatus(): void {
    const threats = this.securityMetrics.activeThreats;
    const failedLogins = this.securityMetrics.failedLogins;
    
    if (threats > 2 || failedLogins > 15) {
      this.securityStatus.level = 'danger';
    } else if (threats > 0 || failedLogins > 8) {
      this.securityStatus.level = 'warning';
    } else {
      this.securityStatus.level = 'secure';
    }
  }
}
