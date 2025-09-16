const axios = require('axios');

const BASE_URL = 'https://ai-hiring-backend.fly.dev';
let authToken = '';

// Test credentials
const testCredentials = {
  recruiter: { email: 'recruiter@aihiring.com', password: 'Recruiter@123' },
  admin: { email: 'admin@aihiring.com', password: 'Admin@123' }
};

async function login(credentials) {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, credentials);
    return response.data.access_token;
  } catch (error) {
    console.error('Login failed:', error.response?.data || error.message);
    return null;
  }
}

async function testEndpoint(method, url, data = null, token = null) {
  try {
    const config = {
      method,
      url: `${BASE_URL}${url}`,
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    };
    
    if (data) config.data = data;
    
    const response = await axios(config);
    console.log(`✅ ${method.toUpperCase()} ${url} - Status: ${response.status}`);
    return response.data;
  } catch (error) {
    console.error(`❌ ${method.toUpperCase()} ${url} - Error: ${error.response?.status} ${error.response?.data?.message || error.message}`);
    return null;
  }
}

async function runTests() {
  console.log('🚀 Testing New AI Features Endpoints\n');

  // Login as recruiter
  console.log('📝 Logging in as recruiter...');
  authToken = await login(testCredentials.recruiter);
  if (!authToken) {
    console.error('Failed to login. Exiting tests.');
    return;
  }
  console.log('✅ Login successful\n');

  // Test AI Analysis endpoints
  console.log('🧠 Testing AI Analysis Endpoints:');
  await testEndpoint('GET', '/ai-analysis/skill-gaps', null, authToken);
  
  // Test with mock application ID
  await testEndpoint('GET', '/ai-analysis/resume-summary/mock-app-id', null, authToken);
  
  // Test with mock job ID
  await testEndpoint('GET', '/ai-analysis/rank-candidates/mock-job-id', null, authToken);
  
  console.log('');

  // Test Predictive Analytics endpoints
  console.log('📊 Testing Predictive Analytics Endpoints:');
  await testEndpoint('GET', '/predictive-analytics/hiring-predictions', null, authToken);
  await testEndpoint('GET', '/predictive-analytics/bias-analysis', null, authToken);
  await testEndpoint('GET', '/predictive-analytics/sentiment-analysis/mock-app-id', null, authToken);
  
  console.log('');

  // Test Interview Scheduling endpoints
  console.log('📅 Testing Interview Scheduling Endpoints:');
  await testEndpoint('GET', '/interview-scheduling/my-interviews', null, authToken);
  await testEndpoint('GET', '/interview-scheduling/available-slots/mock-interviewer-id?date=2024-01-15', null, authToken);
  
  // Test scheduling interview
  const scheduleData = {
    applicationId: 'mock-app-id',
    interviewerId: 'mock-interviewer-id',
    scheduledAt: '2024-01-15T10:00:00Z',
    type: 'VIDEO',
    duration: 60
  };
  await testEndpoint('POST', '/interview-scheduling/schedule', scheduleData, authToken);

  console.log('\n🏁 Tests completed!');
}

// Run tests
runTests().catch(console.error);