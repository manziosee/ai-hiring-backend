const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

// Configuration
const BASE_URL = 'http://localhost:3000';
const testData = require('./test-data.json');

// Store tokens and IDs for dependent requests
let tokens = {};
let createdIds = {};

// Helper function to make authenticated requests
const makeRequest = async (method, endpoint, data = null, token = null, isFormData = false) => {
  const config = {
    method,
    url: `${BASE_URL}${endpoint}`,
    headers: {}
  };

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (data) {
    if (isFormData) {
      config.data = data;
      config.headers = { ...config.headers, ...data.getHeaders() };
    } else {
      config.data = data;
      config.headers['Content-Type'] = 'application/json';
    }
  }

  try {
    const response = await axios(config);
    return { success: true, data: response.data, status: response.status };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data || error.message, 
      status: error.response?.status 
    };
  }
};

// Test functions
const testAuthentication = async () => {
  console.log('\n🔐 Testing Authentication Endpoints...');
  
  // Register users
  for (const [role, userData] of Object.entries(testData.authentication.register)) {
    console.log(`\n📝 Registering ${role}...`);
    const result = await makeRequest('POST', '/auth/register', userData);
    console.log(`Register ${role}:`, result.success ? '✅ Success' : '❌ Failed', result.status);
    if (!result.success) console.log('Error:', result.error);
  }

  // Login users and store tokens
  for (const [role, loginData] of Object.entries(testData.authentication.login)) {
    console.log(`\n🔑 Logging in ${role}...`);
    const result = await makeRequest('POST', '/auth/login', loginData);
    console.log(`Login ${role}:`, result.success ? '✅ Success' : '❌ Failed', result.status);
    
    if (result.success && result.data.access_token) {
      tokens[role] = result.data.access_token;
      console.log(`Token stored for ${role}`);
    } else if (!result.success) {
      console.log('Error:', result.error);
    }
  }
};

const testUserProfile = async () => {
  console.log('\n👤 Testing User Profile Endpoints...');
  
  // Get profile for each user type
  for (const [role, token] of Object.entries(tokens)) {
    console.log(`\n📋 Getting ${role} profile...`);
    const result = await makeRequest('GET', '/users/me', null, token);
    console.log(`Get ${role} profile:`, result.success ? '✅ Success' : '❌ Failed', result.status);
    if (!result.success) console.log('Error:', result.error);
  }

  // Update user profile
  if (tokens.candidate) {
    console.log('\n✏️ Updating candidate profile...');
    const result = await makeRequest('PATCH', '/users/me', testData.users.update, tokens.candidate);
    console.log('Update profile:', result.success ? '✅ Success' : '❌ Failed', result.status);
    if (!result.success) console.log('Error:', result.error);
  }
};

const testJobManagement = async () => {
  console.log('\n💼 Testing Job Management Endpoints...');
  
  // Create jobs (requires admin or recruiter token)
  const recruiterToken = tokens.recruiter || tokens.admin;
  if (recruiterToken) {
    for (const [index, jobData] of testData.jobs.create.entries()) {
      console.log(`\n📝 Creating job ${index + 1}: ${jobData.title}...`);
      const result = await makeRequest('POST', '/jobs', jobData, recruiterToken);
      console.log(`Create job ${index + 1}:`, result.success ? '✅ Success' : '❌ Failed', result.status);
      
      if (result.success && result.data.id) {
        createdIds[`job${index + 1}`] = result.data.id;
        console.log(`Job ID stored: ${result.data.id}`);
      } else if (!result.success) {
        console.log('Error:', result.error);
      }
    }

    // Get all jobs
    console.log('\n📋 Getting all jobs...');
    const result = await makeRequest('GET', '/jobs');
    console.log('Get all jobs:', result.success ? '✅ Success' : '❌ Failed', result.status);
    if (!result.success) console.log('Error:', result.error);

    // Update a job
    if (createdIds.job1) {
      console.log('\n✏️ Updating job...');
      const updateResult = await makeRequest('PATCH', `/jobs/${createdIds.job1}`, testData.jobs.update, recruiterToken);
      console.log('Update job:', updateResult.success ? '✅ Success' : '❌ Failed', updateResult.status);
      if (!updateResult.success) console.log('Error:', updateResult.error);
    }
  } else {
    console.log('❌ No recruiter or admin token available for job management tests');
  }
};

const testCandidateManagement = async () => {
  console.log('\n👥 Testing Candidate Management Endpoints...');
  
  // Create candidate profiles
  if (tokens.candidate) {
    for (const [index, candidateData] of testData.candidates.create.entries()) {
      console.log(`\n📝 Creating candidate profile ${index + 1}: ${candidateData.name}...`);
      const result = await makeRequest('POST', '/candidates', candidateData, tokens.candidate);
      console.log(`Create candidate ${index + 1}:`, result.success ? '✅ Success' : '❌ Failed', result.status);
      
      if (result.success && result.data.id) {
        createdIds[`candidate${index + 1}`] = result.data.id;
      } else if (!result.success) {
        console.log('Error:', result.error);
      }
    }
  }

  // Get candidates (admin/recruiter access)
  const adminToken = tokens.admin || tokens.recruiter;
  if (adminToken) {
    console.log('\n📋 Getting all candidates...');
    const result = await makeRequest('GET', '/candidates', null, adminToken);
    console.log('Get all candidates:', result.success ? '✅ Success' : '❌ Failed', result.status);
    if (!result.success) console.log('Error:', result.error);
  }
};

const testApplications = async () => {
  console.log('\n📄 Testing Application Endpoints...');
  
  if (tokens.candidate && createdIds.job1) {
    // Create applications
    for (const [index, appData] of testData.applications.create.entries()) {
      const applicationData = { ...appData, jobId: createdIds.job1 };
      console.log(`\n📝 Creating application ${index + 1}...`);
      const result = await makeRequest('POST', '/applications', applicationData, tokens.candidate);
      console.log(`Create application ${index + 1}:`, result.success ? '✅ Success' : '❌ Failed', result.status);
      
      if (result.success && result.data.id) {
        createdIds[`application${index + 1}`] = result.data.id;
      } else if (!result.success) {
        console.log('Error:', result.error);
      }
    }

    // Get applications by job
    const adminToken = tokens.admin || tokens.recruiter;
    if (adminToken && createdIds.job1) {
      console.log('\n📋 Getting applications for job...');
      const result = await makeRequest('GET', `/applications/job/${createdIds.job1}`, null, adminToken);
      console.log('Get applications by job:', result.success ? '✅ Success' : '❌ Failed', result.status);
      if (!result.success) console.log('Error:', result.error);
    }

    // Update application status
    if (adminToken && createdIds.application1) {
      for (const [index, statusData] of testData.applications.updateStatus.entries()) {
        console.log(`\n✏️ Updating application status to ${statusData.status}...`);
        const result = await makeRequest('PATCH', `/applications/${createdIds.application1}/status`, statusData, adminToken);
        console.log(`Update status to ${statusData.status}:`, result.success ? '✅ Success' : '❌ Failed', result.status);
        if (!result.success) console.log('Error:', result.error);
        
        // Wait a bit between status updates
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  } else {
    console.log('❌ Missing candidate token or job ID for application tests');
  }
};

const testInterviews = async () => {
  console.log('\n🎤 Testing Interview Endpoints...');
  
  const adminToken = tokens.admin || tokens.recruiter;
  if (adminToken && createdIds.application1) {
    // Create interviews
    for (const [index, interviewData] of testData.interviews.create.entries()) {
      const interviewPayload = { ...interviewData, applicationId: createdIds.application1 };
      console.log(`\n📝 Creating interview ${index + 1}...`);
      const result = await makeRequest('POST', '/interviews', interviewPayload, adminToken);
      console.log(`Create interview ${index + 1}:`, result.success ? '✅ Success' : '❌ Failed', result.status);
      
      if (result.success && result.data.id) {
        createdIds[`interview${index + 1}`] = result.data.id;
      } else if (!result.success) {
        console.log('Error:', result.error);
      }
    }

    // Get interviews
    console.log('\n📋 Getting all interviews...');
    const result = await makeRequest('GET', '/interviews', null, adminToken);
    console.log('Get all interviews:', result.success ? '✅ Success' : '❌ Failed', result.status);
    if (!result.success) console.log('Error:', result.error);
  } else {
    console.log('❌ Missing admin/recruiter token or application ID for interview tests');
  }
};

const testScreening = async () => {
  console.log('\n🤖 Testing AI Screening Endpoints...');
  
  const adminToken = tokens.admin || tokens.recruiter;
  if (adminToken && createdIds.application1) {
    // Run screening
    console.log('\n🔍 Running AI screening...');
    const result = await makeRequest('POST', `/screening/run/${createdIds.application1}`, null, adminToken);
    console.log('Run screening:', result.success ? '✅ Success' : '❌ Failed', result.status);
    if (!result.success) console.log('Error:', result.error);

    // Get screening results
    console.log('\n📊 Getting screening results...');
    const resultsResponse = await makeRequest('GET', `/screening/results/${createdIds.application1}`, null, adminToken);
    console.log('Get screening results:', resultsResponse.success ? '✅ Success' : '❌ Failed', resultsResponse.status);
    if (!resultsResponse.success) console.log('Error:', resultsResponse.error);
  } else {
    console.log('❌ Missing admin/recruiter token or application ID for screening tests');
  }
};

const testAIServices = async () => {
  console.log('\n🧠 Testing AI Service Endpoints...');
  
  const adminToken = tokens.admin || tokens.recruiter;
  if (adminToken) {
    // Generate job description
    console.log('\n📝 Generating job description...');
    const jobDescResult = await makeRequest('POST', '/ai/generate-job-description', testData.ai.generateJobDescription, adminToken);
    console.log('Generate job description:', jobDescResult.success ? '✅ Success' : '❌ Failed', jobDescResult.status);
    if (!jobDescResult.success) console.log('Error:', jobDescResult.error);

    // Generate interview questions
    console.log('\n❓ Generating interview questions...');
    const questionsResult = await makeRequest('POST', '/ai/generate-interview-questions', testData.ai.generateInterviewQuestions, adminToken);
    console.log('Generate interview questions:', questionsResult.success ? '✅ Success' : '❌ Failed', questionsResult.status);
    if (!questionsResult.success) console.log('Error:', questionsResult.error);

    // Analyze interview response
    console.log('\n📊 Analyzing interview response...');
    const analysisResult = await makeRequest('POST', '/ai/analyze-interview-response', testData.ai.analyzeInterviewResponse, adminToken);
    console.log('Analyze interview response:', analysisResult.success ? '✅ Success' : '❌ Failed', analysisResult.status);
    if (!analysisResult.success) console.log('Error:', analysisResult.error);
  } else {
    console.log('❌ Missing admin/recruiter token for AI service tests');
  }
};

const testHealthEndpoints = async () => {
  console.log('\n🏥 Testing Health Endpoints...');
  
  // Health check
  console.log('\n💓 Checking health...');
  const healthResult = await makeRequest('GET', '/health');
  console.log('Health check:', healthResult.success ? '✅ Success' : '❌ Failed', healthResult.status);
  if (!healthResult.success) console.log('Error:', healthResult.error);

  // Metrics
  console.log('\n📊 Getting metrics...');
  const metricsResult = await makeRequest('GET', '/health/metrics');
  console.log('Get metrics:', metricsResult.success ? '✅ Success' : '❌ Failed', metricsResult.status);
  if (!metricsResult.success) console.log('Error:', metricsResult.error);
};

// Main test runner
const runAllTests = async () => {
  console.log('🚀 Starting API Endpoint Tests...');
  console.log(`Base URL: ${BASE_URL}`);
  console.log('=' * 50);

  try {
    // Test in order of dependencies
    await testHealthEndpoints();
    await testAuthentication();
    await testUserProfile();
    await testJobManagement();
    await testCandidateManagement();
    await testApplications();
    await testInterviews();
    await testScreening();
    await testAIServices();

    console.log('\n🎉 All tests completed!');
    console.log('\n📊 Summary:');
    console.log('Tokens collected:', Object.keys(tokens).length);
    console.log('Created entities:', Object.keys(createdIds).length);
    console.log('\nCreated IDs:', createdIds);

  } catch (error) {
    console.error('❌ Test runner failed:', error.message);
  }
};

// Export for use in other scripts
module.exports = {
  makeRequest,
  testAuthentication,
  testUserProfile,
  testJobManagement,
  testCandidateManagement,
  testApplications,
  testInterviews,
  testScreening,
  testAIServices,
  testHealthEndpoints,
  runAllTests,
  BASE_URL,
  testData
};

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests().catch(console.error);
}
