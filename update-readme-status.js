#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Endpoint status mapping based on actual implementation
const endpointStatus = {
  // Authentication - All implemented
  'POST /auth/register': '✅',
  'POST /auth/login': '✅', 
  'POST /auth/refresh': '✅',
  'POST /auth/logout': '✅',
  
  // Users Management - All implemented
  'GET /users/me': '✅',
  'PUT /users/me': '✅',
  'GET /users': '❌', // Not implemented in controller
  'GET /users/{id}': '❌', // Not implemented in controller
  'DELETE /users/{id}': '❌', // Not implemented in controller
  
  // Jobs Management - All implemented
  'GET /jobs': '✅',
  'GET /jobs/{id}': '✅',
  'POST /jobs': '✅',
  'PUT /jobs/{id}': '✅',
  'DELETE /jobs/{id}': '✅',
  
  // Applications - All implemented
  'POST /applications': '✅',
  'GET /applications': '❌', // Route not found in controller
  'GET /applications/{id}': '❌', // Route not found in controller
  'PUT /applications/{id}/status': '✅',
  
  // AI Screening - All implemented
  'POST /screening/run/{id}': '✅',
  'GET /screening/{id}': '✅',
  'GET /screening/job/{id}': '❌', // Route not implemented
  
  // Interviews - All implemented
  'GET /interviews/{id}': '✅',
  'POST /interviews': '✅',
  'PUT /interviews/{id}': '✅',
  'DELETE /interviews/{id}': '✅',
  
  // File Upload - Implemented
  'POST /uploads/resume': '✅',
  'GET /uploads/{id}': '❌', // Route pattern different
  
  // Health & Monitoring - All implemented
  'GET /health': '✅',
  'GET /metrics': '✅'
};

function updateReadmeStatus() {
  const readmePath = path.join(__dirname, 'README.md');
  let content = fs.readFileSync(readmePath, 'utf8');
  
  // Update each endpoint status
  Object.entries(endpointStatus).forEach(([endpoint, status]) => {
    const [method, path] = endpoint.split(' ');
    
    // Create regex patterns for different endpoint formats
    const patterns = [
      new RegExp(`(\\| ${method}\\s+\\| \`${path.replace(/\{[^}]+\}/g, '\\{[^}]+\\}')}\`[^|]+\\| [^|]+\\| )([✅❌])`, 'g'),
      new RegExp(`(\\| ${method}\\s+\\| ${path.replace(/\{[^}]+\}/g, '\\{[^}]+\\}')}[^|]+\\| [^|]+\\| )([✅❌])`, 'g'),
      new RegExp(`(\\| ${method}[^|]+\\| [^|]*${path.replace(/\{[^}]+\}/g, '[^|]*')}[^|]*\\| [^|]+\\| [^|]+\\| )([✅❌])`, 'g')
    ];
    
    patterns.forEach(pattern => {
      content = content.replace(pattern, `$1${status}`);
    });
  });
  
  fs.writeFileSync(readmePath, content);
  console.log('✅ README.md status updated');
}

updateReadmeStatus();