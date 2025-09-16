import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface ApiTestResult {
  endpoint: string;
  status: 'success' | 'error' | 'unauthorized';
  responseTime: number;
  data?: any;
  error?: string;
}

export interface ApiIntegrationReport {
  overallStatus: 'healthy' | 'partial' | 'unhealthy';
  totalEndpoints: number;
  successfulEndpoints: number;
  failedEndpoints: number;
  averageResponseTime: number;
  results: ApiTestResult[];
  timestamp: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiIntegrationTestService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private getAuthHeaders() {
    const token = localStorage.getItem('access_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  private testEndpoint(endpoint: string, method: 'GET' | 'POST' = 'GET', data?: any): Observable<ApiTestResult> {
    const startTime = Date.now();
    const url = `${this.baseUrl}${endpoint}`;

    let request: Observable<any>;
    
    if (method === 'GET') {
      request = this.http.get(url, { headers: this.getAuthHeaders() });
    } else {
      request = this.http.post(url, data || {}, { headers: this.getAuthHeaders() });
    }

    return request.pipe(
      map(response => ({
        endpoint,
        status: 'success' as const,
        responseTime: Date.now() - startTime,
        data: response
      })),
      catchError(error => {
        const status = error.status === 401 ? 'unauthorized' : 'error';
        return of({
          endpoint,
          status,
          responseTime: Date.now() - startTime,
          error: error.message || 'Unknown error'
        });
      })
    );
  }

  runComprehensiveTest(): Observable<ApiIntegrationReport> {
    const testEndpoints = [
      // Health check
      { endpoint: '/health', method: 'GET' as const },
      
      // Authentication endpoints
      { endpoint: '/auth/refresh', method: 'POST' as const },
      
      // Dashboard endpoints
      { endpoint: '/dashboard/admin', method: 'GET' as const },
      { endpoint: '/dashboard/recruiter', method: 'GET' as const },
      { endpoint: '/dashboard/candidate', method: 'GET' as const },
      
      // Analytics endpoints
      { endpoint: '/analytics/dashboard', method: 'GET' as const },
      { endpoint: '/analytics/reports/hiring-funnel', method: 'GET' as const },
      
      // Jobs endpoints
      { endpoint: '/jobs', method: 'GET' as const },
      
      // Applications endpoints
      { endpoint: '/applications', method: 'GET' as const },
      
      // Candidates endpoints
      { endpoint: '/candidates', method: 'GET' as const },
      
      // Users endpoints
      { endpoint: '/users/me', method: 'GET' as const },
      
      // Audit endpoints
      { endpoint: '/audit/my-activity', method: 'GET' as const }
    ];

    const tests = testEndpoints.map(({ endpoint, method }) => 
      this.testEndpoint(endpoint, method)
    );

    return forkJoin(tests).pipe(
      map(results => {
        const successfulEndpoints = results.filter(r => r.status === 'success').length;
        const failedEndpoints = results.filter(r => r.status === 'error').length;
        const totalResponseTime = results.reduce((sum, r) => sum + r.responseTime, 0);
        
        let overallStatus: 'healthy' | 'partial' | 'unhealthy';
        if (successfulEndpoints === results.length) {
          overallStatus = 'healthy';
        } else if (successfulEndpoints > failedEndpoints) {
          overallStatus = 'partial';
        } else {
          overallStatus = 'unhealthy';
        }

        return {
          overallStatus,
          totalEndpoints: results.length,
          successfulEndpoints,
          failedEndpoints,
          averageResponseTime: Math.round(totalResponseTime / results.length),
          results,
          timestamp: new Date().toISOString()
        };
      })
    );
  }

  testDashboardIntegration(): Observable<ApiTestResult[]> {
    const dashboardTests = [
      this.testEndpoint('/dashboard/admin'),
      this.testEndpoint('/dashboard/recruiter'),
      this.testEndpoint('/dashboard/candidate'),
      this.testEndpoint('/analytics/dashboard'),
      this.testEndpoint('/analytics/reports/hiring-funnel')
    ];

    return forkJoin(dashboardTests);
  }

  testJobsIntegration(): Observable<ApiTestResult[]> {
    const jobsTests = [
      this.testEndpoint('/jobs'),
      this.testEndpoint('/jobs?status=active'),
      this.testEndpoint('/jobs?department=Engineering')
    ];

    return forkJoin(jobsTests);
  }

  testApplicationsIntegration(): Observable<ApiTestResult[]> {
    const applicationsTests = [
      this.testEndpoint('/applications'),
      this.testEndpoint('/applications?status=pending'),
      this.testEndpoint('/applications?status=reviewed')
    ];

    return forkJoin(applicationsTests);
  }

  testCandidatesIntegration(): Observable<ApiTestResult[]> {
    const candidatesTests = [
      this.testEndpoint('/candidates'),
      this.testEndpoint('/candidates?skills=JavaScript,React')
    ];

    return forkJoin(candidatesTests);
  }

  validateDataIntegrity(data: any, expectedFields: string[]): boolean {
    if (!data || typeof data !== 'object') {
      return false;
    }

    if (Array.isArray(data)) {
      if (data.length === 0) return true; // Empty arrays are valid
      return this.validateDataIntegrity(data[0], expectedFields);
    }

    return expectedFields.every(field => {
      const fieldParts = field.split('.');
      let current = data;
      
      for (const part of fieldParts) {
        if (current === null || current === undefined || !(part in current)) {
          return false;
        }
        current = current[part];
      }
      
      return true;
    });
  }

  generateIntegrationReport(): Observable<string> {
    return this.runComprehensiveTest().pipe(
      map(report => {
        let reportText = `# API Integration Test Report\n\n`;
        reportText += `**Generated:** ${new Date(report.timestamp).toLocaleString()}\n`;
        reportText += `**Overall Status:** ${report.overallStatus.toUpperCase()}\n`;
        reportText += `**Success Rate:** ${Math.round((report.successfulEndpoints / report.totalEndpoints) * 100)}%\n`;
        reportText += `**Average Response Time:** ${report.averageResponseTime}ms\n\n`;

        reportText += `## Summary\n`;
        reportText += `- Total Endpoints Tested: ${report.totalEndpoints}\n`;
        reportText += `- Successful: ${report.successfulEndpoints}\n`;
        reportText += `- Failed: ${report.failedEndpoints}\n`;
        reportText += `- Unauthorized: ${report.results.filter(r => r.status === 'unauthorized').length}\n\n`;

        reportText += `## Detailed Results\n\n`;
        
        report.results.forEach(result => {
          const statusIcon = result.status === 'success' ? '✅' : 
                           result.status === 'unauthorized' ? '🔒' : '❌';
          
          reportText += `${statusIcon} **${result.endpoint}**\n`;
          reportText += `   - Status: ${result.status}\n`;
          reportText += `   - Response Time: ${result.responseTime}ms\n`;
          
          if (result.error) {
            reportText += `   - Error: ${result.error}\n`;
          }
          
          if (result.data && result.status === 'success') {
            const dataType = Array.isArray(result.data) ? 'Array' : typeof result.data;
            const dataSize = Array.isArray(result.data) ? result.data.length : 
                           typeof result.data === 'object' ? Object.keys(result.data).length : 1;
            reportText += `   - Data Type: ${dataType}\n`;
            reportText += `   - Data Size: ${dataSize} ${Array.isArray(result.data) ? 'items' : 'properties'}\n`;
          }
          
          reportText += `\n`;
        });

        reportText += `## Recommendations\n\n`;
        
        if (report.overallStatus === 'unhealthy') {
          reportText += `⚠️ **Critical Issues Detected**\n`;
          reportText += `- Multiple API endpoints are failing\n`;
          reportText += `- Check backend server status and connectivity\n`;
          reportText += `- Verify authentication tokens are valid\n\n`;
        } else if (report.overallStatus === 'partial') {
          reportText += `⚠️ **Some Issues Detected**\n`;
          reportText += `- Some API endpoints are failing\n`;
          reportText += `- Review failed endpoints for specific issues\n`;
          reportText += `- Consider implementing fallback mechanisms\n\n`;
        } else {
          reportText += `✅ **All Systems Operational**\n`;
          reportText += `- All API endpoints are responding correctly\n`;
          reportText += `- Data integration is working as expected\n\n`;
        }

        if (report.averageResponseTime > 2000) {
          reportText += `⚠️ **Performance Warning**\n`;
          reportText += `- Average response time is high (${report.averageResponseTime}ms)\n`;
          reportText += `- Consider optimizing API queries or implementing caching\n\n`;
        }

        return reportText;
      })
    );
  }
}
