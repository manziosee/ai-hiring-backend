import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatTabsModule,
    MatChipsModule,
    MatMenuModule
  ],
  template: `
    <div class="admin-container">
      <div class="header-section">
        <h1><mat-icon>admin_panel_settings</mat-icon> Admin Dashboard</h1>
        <p>System administration and user management</p>
      </div>

      <div class="stats-grid">
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-icon users-icon">
              <mat-icon>people</mat-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">1,247</div>
              <div class="stat-label">Total Users</div>
            </div>
          </mat-card-content>
        </mat-card>
        
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-icon jobs-icon">
              <mat-icon>work</mat-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">89</div>
              <div class="stat-label">Active Jobs</div>
            </div>
          </mat-card-content>
        </mat-card>
        
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-icon apps-icon">
              <mat-icon>assignment</mat-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">3,456</div>
              <div class="stat-label">Applications</div>
            </div>
          </mat-card-content>
        </mat-card>
        
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-icon system-icon">
              <mat-icon>speed</mat-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">99.9%</div>
              <div class="stat-label">System Uptime</div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <mat-tab-group class="admin-tabs">
        <mat-tab label="User Management">
          <div class="users-section">
            <div class="section-header">
              <h3>System Users</h3>
              <button mat-raised-button color="primary">
                <mat-icon>add</mat-icon> Add User
              </button>
            </div>
            
            <mat-card class="table-card">
              <table mat-table [dataSource]="users" class="users-table">
                <ng-container matColumnDef="name">
                  <th mat-header-cell *matHeaderCellDef>Name</th>
                  <td mat-cell *matCellDef="let user">{{user.name}}</td>
                </ng-container>
                
                <ng-container matColumnDef="email">
                  <th mat-header-cell *matHeaderCellDef>Email</th>
                  <td mat-cell *matCellDef="let user">{{user.email}}</td>
                </ng-container>
                
                <ng-container matColumnDef="role">
                  <th mat-header-cell *matHeaderCellDef>Role</th>
                  <td mat-cell *matCellDef="let user">
                    <mat-chip [color]="getRoleColor(user.role)">{{user.role}}</mat-chip>
                  </td>
                </ng-container>
                
                <ng-container matColumnDef="status">
                  <th mat-header-cell *matHeaderCellDef>Status</th>
                  <td mat-cell *matCellDef="let user">
                    <mat-chip [color]="user.active ? 'primary' : 'warn'">{{user.active ? 'Active' : 'Inactive'}}</mat-chip>
                  </td>
                </ng-container>
                
                <ng-container matColumnDef="actions">
                  <th mat-header-cell *matHeaderCellDef>Actions</th>
                  <td mat-cell *matCellDef="let user">
                    <button mat-icon-button [matMenuTriggerFor]="userMenu">
                      <mat-icon>more_vert</mat-icon>
                    </button>
                    <mat-menu #userMenu="matMenu">
                      <button mat-menu-item>
                        <mat-icon>edit</mat-icon> Edit
                      </button>
                      <button mat-menu-item>
                        <mat-icon>block</mat-icon> Suspend
                      </button>
                      <button mat-menu-item>
                        <mat-icon>delete</mat-icon> Delete
                      </button>
                    </mat-menu>
                  </td>
                </ng-container>
                
                <tr mat-header-row *matHeaderRowDef="userColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: userColumns;"></tr>
              </table>
            </mat-card>
          </div>
        </mat-tab>
        
        <mat-tab label="System Settings">
          <div class="settings-section">
            <div class="settings-grid">
              <mat-card class="setting-card">
                <mat-card-header>
                  <mat-card-title>Email Configuration</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <p>Configure SMTP settings and email templates</p>
                </mat-card-content>
                <mat-card-actions>
                  <button mat-button color="primary">Configure</button>
                </mat-card-actions>
              </mat-card>
              
              <mat-card class="setting-card">
                <mat-card-header>
                  <mat-card-title>AI Services</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <p>Manage OpenAI and ML service integrations</p>
                </mat-card-content>
                <mat-card-actions>
                  <button mat-button color="primary">Configure</button>
                </mat-card-actions>
              </mat-card>
              
              <mat-card class="setting-card">
                <mat-card-header>
                  <mat-card-title>Security Settings</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <p>Configure authentication and security policies</p>
                </mat-card-content>
                <mat-card-actions>
                  <button mat-button color="primary">Configure</button>
                </mat-card-actions>
              </mat-card>
            </div>
          </div>
        </mat-tab>
        
        <mat-tab label="Audit Logs">
          <div class="audit-section">
            <mat-card class="table-card">
              <table mat-table [dataSource]="auditLogs" class="audit-table">
                <ng-container matColumnDef="timestamp">
                  <th mat-header-cell *matHeaderCellDef>Timestamp</th>
                  <td mat-cell *matCellDef="let log">{{log.timestamp | date:'medium'}}</td>
                </ng-container>
                
                <ng-container matColumnDef="user">
                  <th mat-header-cell *matHeaderCellDef>User</th>
                  <td mat-cell *matCellDef="let log">{{log.user}}</td>
                </ng-container>
                
                <ng-container matColumnDef="action">
                  <th mat-header-cell *matHeaderCellDef>Action</th>
                  <td mat-cell *matCellDef="let log">{{log.action}}</td>
                </ng-container>
                
                <ng-container matColumnDef="resource">
                  <th mat-header-cell *matHeaderCellDef>Resource</th>
                  <td mat-cell *matCellDef="let log">{{log.resource}}</td>
                </ng-container>
                
                <tr mat-header-row *matHeaderRowDef="auditColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: auditColumns;"></tr>
              </table>
            </mat-card>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .admin-container {
      padding: 24px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .header-section h1 {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 0 0 8px 0;
      color: #333;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 24px;
      margin-bottom: 32px;
    }

    .stat-card {
      border-radius: 12px;
    }

    .stat-card mat-card-content {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 24px;
    }

    .stat-icon {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .users-icon { background: linear-gradient(135deg, #667eea, #764ba2); }
    .jobs-icon { background: linear-gradient(135deg, #f093fb, #f5576c); }
    .apps-icon { background: linear-gradient(135deg, #4facfe, #00f2fe); }
    .system-icon { background: linear-gradient(135deg, #43e97b, #38f9d7); }

    .stat-info {
      flex: 1;
    }

    .stat-value {
      font-size: 2rem;
      font-weight: 700;
      color: #333;
      margin-bottom: 4px;
    }

    .stat-label {
      color: #666;
      font-size: 14px;
    }

    .admin-tabs {
      margin-bottom: 24px;
    }

    .users-section, .settings-section, .audit-section {
      padding: 24px 0;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .table-card {
      border-radius: 12px;
      overflow: hidden;
    }

    .users-table, .audit-table {
      width: 100%;
    }

    .settings-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 24px;
    }

    .setting-card {
      border-radius: 12px;
    }
  `]
})
export class AdminComponent implements OnInit {
  userColumns = ['name', 'email', 'role', 'status', 'actions'];
  auditColumns = ['timestamp', 'user', 'action', 'resource'];
  
  users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'ADMIN', active: true },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'RECRUITER', active: true },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'CANDIDATE', active: false }
  ];
  
  auditLogs = [
    { timestamp: new Date(), user: 'admin@example.com', action: 'USER_LOGIN', resource: 'Authentication' },
    { timestamp: new Date(), user: 'recruiter@example.com', action: 'JOB_CREATED', resource: 'Job #123' },
    { timestamp: new Date(), user: 'candidate@example.com', action: 'APPLICATION_SUBMITTED', resource: 'Application #456' }
  ];

  ngOnInit(): void {}

  getRoleColor(role: string): string {
    switch (role) {
      case 'ADMIN': return 'warn';
      case 'RECRUITER': return 'primary';
      case 'CANDIDATE': return 'accent';
      default: return '';
    }
  }
}