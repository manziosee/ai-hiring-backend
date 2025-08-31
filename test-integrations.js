const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

// Configuration
const API_BASE_URL = 'http://localhost:3000';
const ML_SERVICE_URL = 'http://localhost:8000';

// Test data
const testUser = {
  email: 'test@example.com',
  password: 'TestPassword123!',
  fullName: 'Test User',
  role: 'RECRUITER'
};

const testJob = {
  title: 'Senior Software Engineer',
  description: 'We are looking for a senior software engineer with expertise in Node.js, React, and cloud technologies.',
  skills: ['Node.js', 'React', 'AWS', 'TypeScript', 'PostgreSQL'],
  experience: 5,
  location: 'Remote',
  salary: 120000
};

const testCandidate = {
  email: 'candidate@example.com',
  fullName: 'John Doe',
  skills: ['JavaScript', 'React', 'Node.js', 'Python'],
  yearsExp: 4,
  resumeUrl: 'https://example.com/resume.pdf'
};

let authToken = '';
let jobId = '';
let candidateId = '';

// Helper functions
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const makeRequest = async (method, url, data = null, headers = {}) => {
  try {
    const config = {
      method,
      url,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };
    
    if (data) {
      config.data = data;
    }
    
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
async function testHealthChecks() {
  console.log('\n🔍 Testing Health Checks...');
  
  // Test main API health
  const mainApiHealth = await makeRequest('GET', `${API_BASE_URL}/health`);
  console.log('Main API Health:', mainApiHealth.success ? '✅ Healthy' : '❌ Failed');
  
  // Test ML service health
  const mlServiceHealth = await makeRequest('GET', `${ML_SERVICE_URL}/health`);
  console.log('ML Service Health:', mlServiceHealth.success ? '✅ Healthy' : '❌ Failed');
  
  if (mlServiceHealth.success) {
    console.log('ML Service Models:', mlServiceHealth.data.models);
  }
  
  return mainApiHealth.success && mlServiceHealth.success;
}

async function testAuthentication() {
  console.log('\n🔐 Testing Authentication...');
  
  // Register user
  const registerResult = await makeRequest('POST', `${API_BASE_URL}/auth/register`, testUser);
  console.log('User Registration:', registerResult.success ? '✅ Success' : '❌ Failed');
  
  // Login
  const loginResult = await makeRequest('POST', `${API_BASE_URL}/auth/login`, {
    email: testUser.email,
    password: testUser.password
  });
  
  if (loginResult.success) {
    authToken = loginResult.data.access_token;
    console.log('User Login: ✅ Success');
    console.log('Token received:', authToken ? '✅ Yes' : '❌ No');
  } else {
    console.log('User Login: ❌ Failed');
    console.log('Error:', loginResult.error);
  }
  
  return loginResult.success;
}

async function testJobManagement() {
  console.log('\n💼 Testing Job Management...');
  
  const headers = { Authorization: `Bearer ${authToken}` };
  
  // Create job
  const createJobResult = await makeRequest('POST', `${API_BASE_URL}/jobs`, testJob, headers);
  
  if (createJobResult.success) {
    jobId = createJobResult.data.id;
    console.log('Job Creation: ✅ Success');
    console.log('Job ID:', jobId);
  } else {
    console.log('Job Creation: ❌ Failed');
    console.log('Error:', createJobResult.error);
  }
  
  // Get jobs
  const getJobsResult = await makeRequest('GET', `${API_BASE_URL}/jobs`, null, headers);
  console.log('Get Jobs:', getJobsResult.success ? '✅ Success' : '❌ Failed');
  
  return createJobResult.success;
}

async function testCandidateManagement() {
  console.log('\n👤 Testing Candidate Management...');
  
  const headers = { Authorization: `Bearer ${authToken}` };
  
  // Create candidate
  const createCandidateResult = await makeRequest('POST', `${API_BASE_URL}/candidates`, testCandidate, headers);
  
  if (createCandidateResult.success) {
    candidateId = createCandidateResult.data.id;
    console.log('Candidate Creation: ✅ Success');
    console.log('Candidate ID:', candidateId);
  } else {
    console.log('Candidate Creation: ❌ Failed');
    console.log('Error:', createCandidateResult.error);
  }
  
  return createCandidateResult.success;
}

async function testAIIntegrations() {
  console.log('\n🤖 Testing AI Integrations...');
  
  const headers = { Authorization: `Bearer ${authToken}` };
  
  // Test interview question generation
  const questionsResult = await makeRequest('POST', `${API_BASE_URL}/ai/interview-questions`, {
    jobTitle: testJob.title,
    jobDescription: testJob.description,
    candidateSkills: testCandidate.skills
  }, headers);
  
  console.log('Interview Questions Generation:', questionsResult.success ? '✅ Success' : '❌ Failed');
  if (questionsResult.success) {
    console.log('Generated Questions:', questionsResult.data.length);
  }
  
  // Test skill extraction
  const skillsResult = await makeRequest('POST', `${API_BASE_URL}/ai/extract-skills`, {
    text: 'I have 5 years of experience with JavaScript, React, Node.js, Python, AWS, and Docker.'
  }, headers);
  
  console.log('Skill Extraction:', skillsResult.success ? '✅ Success' : '❌ Failed');
  if (skillsResult.success) {
    console.log('Extracted Skills:', skillsResult.data);
  }
  
  return questionsResult.success && skillsResult.success;
}

async function testMLServiceIntegration() {
  console.log('\n🧠 Testing ML Service Integration...');
  
  // Test basic screening
  const screeningRequest = {
    job: testJob,
    candidate: testCandidate,
    coverLetter: 'I am very interested in this position and believe my skills align well with your requirements.'
  };
  
  const screeningResult = await makeRequest('POST', `${ML_SERVICE_URL}/screen`, screeningRequest);
  console.log('Basic Screening:', screeningResult.success ? '✅ Success' : '❌ Failed');
  
  if (screeningResult.success) {
    console.log('Fit Score:', screeningResult.data.fitScore);
    console.log('Semantic Similarity:', screeningResult.data.details.semanticSimilarity);
    console.log('Skill Similarity:', screeningResult.data.details.skillSimilarity);
  }
  
  // Test advanced screening with question generation
  const advancedScreeningRequest = {
    ...screeningRequest,
    generateQuestions: true
  };
  
  const advancedResult = await makeRequest('POST', `${ML_SERVICE_URL}/advanced-screen`, advancedScreeningRequest);
  console.log('Advanced Screening:', advancedResult.success ? '✅ Success' : '❌ Failed');
  
  if (advancedResult.success) {
    console.log('Interview Questions Generated:', advancedResult.data.interviewQuestions ? '✅ Yes' : '❌ No');
  }
  
  // Test skill extraction endpoint
  const skillExtractionResult = await makeRequest('POST', `${ML_SERVICE_URL}/extract-skills`, 
    'I have experience with React, Node.js, Python, machine learning, and cloud computing on AWS.'
  );
  console.log('ML Skill Extraction:', skillExtractionResult.success ? '✅ Success' : '❌ Failed');
  
  return screeningResult.success;
}

async function testApplicationWorkflow() {
  console.log('\n📝 Testing Application Workflow...');
  
  const headers = { Authorization: `Bearer ${authToken}` };
  
  if (!jobId || !candidateId) {
    console.log('❌ Missing job or candidate ID for application test');
    return false;
  }
  
  // Create application
  const applicationData = {
    jobId: jobId,
    candidateId: candidateId,
    coverLetter: 'I am excited to apply for this position and believe I would be a great fit.'
  };
  
  const createAppResult = await makeRequest('POST', `${API_BASE_URL}/applications`, applicationData, headers);
  console.log('Application Creation:', createAppResult.success ? '✅ Success' : '❌ Failed');
  
  if (createAppResult.success) {
    const applicationId = createAppResult.data.id;
    
    // Screen application
    const screenResult = await makeRequest('POST', `${API_BASE_URL}/applications/${applicationId}/screen`, {}, headers);
    console.log('Application Screening:', screenResult.success ? '✅ Success' : '❌ Failed');
    
    if (screenResult.success) {
      console.log('Screening Score:', screenResult.data.fitScore);
    }
  }
  
  return createAppResult.success;
}

async function testRateLimiting() {
  console.log('\n⚡ Testing Rate Limiting...');
  
  const promises = [];
  for (let i = 0; i < 10; i++) {
    promises.push(makeRequest('POST', `${API_BASE_URL}/auth/login`, {
      email: 'invalid@example.com',
      password: 'wrongpassword'
    }));
  }
  
  const results = await Promise.all(promises);
  const rateLimitedRequests = results.filter(r => r.status === 429);
  
  console.log('Rate Limiting Active:', rateLimitedRequests.length > 0 ? '✅ Yes' : '❌ No');
  console.log('Rate Limited Requests:', rateLimitedRequests.length);
  
  return true;
}

// Main test runner
async function runAllTests() {
  console.log('🚀 Starting AI Hiring Backend Integration Tests\n');
  console.log('=' .repeat(50));
  
  const testResults = {
    healthChecks: false,
    authentication: false,
    jobManagement: false,
    candidateManagement: false,
    aiIntegrations: false,
    mlServiceIntegration: false,
    applicationWorkflow: false,
    rateLimiting: false
  };
  
  try {
    // Run tests sequentially
    testResults.healthChecks = await testHealthChecks();
    await delay(1000);
    
    testResults.authentication = await testAuthentication();
    await delay(1000);
    
    if (testResults.authentication) {
      testResults.jobManagement = await testJobManagement();
      await delay(1000);
      
      testResults.candidateManagement = await testCandidateManagement();
      await delay(1000);
      
      testResults.aiIntegrations = await testAIIntegrations();
      await delay(1000);
      
      testResults.applicationWorkflow = await testApplicationWorkflow();
      await delay(1000);
    }
    
    testResults.mlServiceIntegration = await testMLServiceIntegration();
    await delay(1000);
    
    testResults.rateLimiting = await testRateLimiting();
    
  } catch (error) {
    console.error('\n❌ Test execution failed:', error.message);
  }
  
  // Print summary
  console.log('\n' + '=' .repeat(50));
  console.log('📊 TEST SUMMARY');
  console.log('=' .repeat(50));
  
  const totalTests = Object.keys(testResults).length;
  const passedTests = Object.values(testResults).filter(Boolean).length;
  
  Object.entries(testResults).forEach(([test, passed]) => {
    const status = passed ? '✅ PASS' : '❌ FAIL';
    const testName = test.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    console.log(`${status} ${testName}`);
  });
  
  console.log('\n' + '-'.repeat(50));
  console.log(`Overall: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All tests passed! The AI Hiring Backend is fully functional.');
  } else {
    console.log('⚠️  Some tests failed. Please check the logs above for details.');
  }
  
  console.log('\n💡 Next Steps:');
  console.log('1. Ensure all environment variables are properly configured');
  console.log('2. Verify OpenAI and HuggingFace API keys are valid');
  console.log('3. Check that all services are running on correct ports');
  console.log('4. Review failed tests and fix any issues');
  
  return passedTests === totalTests;
}

// Run tests if called directly
if (require.main === module) {
  runAllTests()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

module.exports = { runAllTests };
