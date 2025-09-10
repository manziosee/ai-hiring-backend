#!/usr/bin/env node

const axios = require('axios');

const BASE_URL = 'http://localhost:3000';
const api = axios.create({ baseURL: BASE_URL });

// Test results tracking
const results = {
  auth: {},
  users: {},
  jobs: {},
  applications: {},
  screening: {},
  interviews: {},
  uploads: {},
  health: {}
};

let tokens = {
  admin: null,
  recruiter: null,
  candidate: null
};

let testData = {
  adminId: null,
  recruiterId: null,
  candidateId: null,
  jobId: null,
  applicationId: null,
  interviewId: null
};

async function testEndpoint(category, endpoint, method, data = null, auth = null, expectedStatus = 200) {
  try {
    const config = {
      method: method.toLowerCase(),
      url: endpoint,
      ...(data && { data }),
      ...(auth && { headers: { Authorization: `Bearer ${auth}` } })
    };

    const response = await api(config);
    const success = response.status === expectedStatus;
    results[category][`${method} ${endpoint}`] = success ? '✅' : '❌';
    console.log(`${success ? '✅' : '❌'} ${method} ${endpoint} - ${response.status}`);
    return { success, data: response.data };
  } catch (error) {
    const status = error.response?.status || 'ERROR';
    const success = status === expectedStatus;
    results[category][`${method} ${endpoint}`] = success ? '✅' : '❌';
    console.log(`${success ? '✅' : '❌'} ${method} ${endpoint} - ${status}`);
    return { success, error: error.message, data: error.response?.data };
  }
}

async function runTests() {
  console.log('🚀 Testing AI Hiring Backend API Endpoints\n');

  // Health Check Tests
  console.log('🏥 Testing Health & Monitoring...');
  await testEndpoint('health', '/health', 'GET');
  await testEndpoint('health', '/health/metrics', 'GET');

  // Authentication Tests
  console.log('\n🔐 Testing Authentication...');
  
  // Register Admin
  const adminReg = await testEndpoint('auth', '/auth/register', 'POST', {
    email: 'admin@test.com',
    password: 'password123',
    fullName: 'Test Admin',
    role: 'ADMIN'
  }, null, 201);
  if (adminReg.success) tokens.admin = adminReg.data.access_token;

  // Register Recruiter
  const recruiterReg = await testEndpoint('auth', '/auth/register', 'POST', {
    email: 'recruiter@test.com',
    password: 'password123',
    fullName: 'Test Recruiter',
    role: 'RECRUITER'
  }, null, 201);
  if (recruiterReg.success) tokens.recruiter = recruiterReg.data.access_token;

  // Register Candidate
  const candidateReg = await testEndpoint('auth', '/auth/register', 'POST', {
    email: 'candidate@test.com',
    password: 'password123',
    fullName: 'Test Candidate',
    role: 'CANDIDATE'
  }, null, 201);
  if (candidateReg.success) tokens.candidate = candidateReg.data.access_token;

  // Login Test
  await testEndpoint('auth', '/auth/login', 'POST', {
    email: 'admin@test.com',
    password: 'password123'
  });

  // Refresh Token Test
  if (tokens.admin) {
    await testEndpoint('auth', '/auth/refresh', 'POST', {}, tokens.admin);
  }

  // Logout Test
  if (tokens.admin) {
    await testEndpoint('auth', '/auth/logout', 'POST', {}, tokens.admin);
  }

  // Users Management Tests
  console.log('\n👥 Testing Users Management...');
  
  if (tokens.candidate) {
    await testEndpoint('users', '/users/me', 'GET', null, tokens.candidate);
    await testEndpoint('users', '/users/me', 'PATCH', {
      fullName: 'Updated Candidate Name'
    }, tokens.candidate);
  }

  // Jobs Management Tests
  console.log('\n💼 Testing Jobs Management...');
  
  // List all jobs (public)
  await testEndpoint('jobs', '/jobs', 'GET');

  if (tokens.recruiter) {
    // Create job
    const jobResult = await testEndpoint('jobs', '/jobs', 'POST', {
      title: 'Senior Developer',
      description: 'Looking for a senior developer',
      skills: ['JavaScript', 'Node.js', 'React'],
      experience: 5
    }, tokens.recruiter, 201);
    
    if (jobResult.success) {
      testData.jobId = jobResult.data.id;
      
      // Get job details
      await testEndpoint('jobs', `/jobs/${testData.jobId}`, 'GET');
      
      // Update job
      await testEndpoint('jobs', `/jobs/${testData.jobId}`, 'PATCH', {
        title: 'Senior Full Stack Developer'
      }, tokens.recruiter);
    }
  }

  // Create candidate profile for applications
  if (tokens.candidate && !testData.candidateId) {
    const candidateResult = await testEndpoint('applications', '/candidates', 'POST', {
      name: 'Test Candidate',
      skills: ['JavaScript', 'React'],
      yearsExp: 3,
      resumeUrl: 'https://example.com/resume.pdf'
    }, tokens.candidate, 201);
    
    if (candidateResult.success) {
      testData.candidateId = candidateResult.data.id;
    }
  }

  // Applications Tests
  console.log('\n📋 Testing Applications...');
  
  if (tokens.candidate && testData.jobId && testData.candidateId) {
    // Apply for job
    const appResult = await testEndpoint('applications', '/applications', 'POST', {
      jobId: testData.jobId,
      candidateId: testData.candidateId,
      coverLetter: 'I am interested in this position'
    }, tokens.candidate, 201);
    
    if (appResult.success) {
      testData.applicationId = appResult.data.id;
      
      // Get user applications
      await testEndpoint('applications', '/applications', 'GET', null, tokens.candidate);
      
      // Get application details
      await testEndpoint('applications', `/applications/${testData.applicationId}`, 'GET', null, tokens.candidate);
    }
  }

  if (tokens.recruiter && testData.jobId) {
    // Get applications for job
    await testEndpoint('applications', `/applications/job/${testData.jobId}`, 'GET', null, tokens.recruiter);
    
    if (testData.applicationId) {
      // Update application status
      await testEndpoint('applications', `/applications/${testData.applicationId}/status`, 'PATCH', {
        status: 'SCREENING'
      }, tokens.recruiter);
    }
  }

  // AI Screening Tests
  console.log('\n🤖 Testing AI Screening...');
  
  if (tokens.recruiter && testData.applicationId) {
    // Run screening
    await testEndpoint('screening', `/screening/run/${testData.applicationId}`, 'POST', null, tokens.recruiter, 201);
    
    // Get screening results
    await testEndpoint('screening', `/screening/${testData.applicationId}`, 'GET', null, tokens.recruiter);
  }

  // Interviews Tests
  console.log('\n📅 Testing Interviews...');
  
  if (tokens.recruiter && testData.applicationId) {
    // Schedule interview
    const interviewResult = await testEndpoint('interviews', '/interviews', 'POST', {
      applicationId: testData.applicationId,
      scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      mode: 'VIRTUAL',
      notes: 'Technical interview'
    }, tokens.recruiter, 201);
    
    if (interviewResult.success) {
      testData.interviewId = interviewResult.data.id;
      
      // Get interviews for application
      await testEndpoint('interviews', `/interviews/${testData.applicationId}`, 'GET', null, tokens.recruiter);
      
      // Update interview
      await testEndpoint('interviews', `/interviews/${testData.interviewId}`, 'PUT', {
        notes: 'Updated interview notes'
      }, tokens.recruiter);
      
      // Cancel interview
      await testEndpoint('interviews', `/interviews/${testData.interviewId}`, 'DELETE', null, tokens.recruiter);
    }
  }

  // File Upload Tests
  console.log('\n📁 Testing File Upload...');
  
  if (tokens.candidate) {
    // Note: File upload requires multipart/form-data, simplified test
    await testEndpoint('uploads', '/uploads/resume', 'POST', {
      filename: 'test-resume.pdf'
    }, tokens.candidate, 400); // Expected to fail without proper file
  }

  // Clean up - Delete job
  if (tokens.recruiter && testData.jobId) {
    await testEndpoint('jobs', `/jobs/${testData.jobId}`, 'DELETE', null, tokens.recruiter);
  }

  // Print Summary
  console.log('\n📊 Test Results Summary:');
  console.log('========================');
  
  Object.entries(results).forEach(([category, tests]) => {
    console.log(`\n${category.toUpperCase()}:`);
    Object.entries(tests).forEach(([test, result]) => {
      console.log(`  ${result} ${test}`);
    });
  });

  // Calculate overall success rate
  const allTests = Object.values(results).flatMap(category => Object.values(category));
  const successCount = allTests.filter(result => result === '✅').length;
  const totalCount = allTests.length;
  const successRate = ((successCount / totalCount) * 100).toFixed(1);
  
  console.log(`\n🎯 Overall Success Rate: ${successCount}/${totalCount} (${successRate}%)`);
}

// Run tests
runTests().catch(console.error);