const axios = require('axios');

const AI_SERVICE_URL = 'http://localhost:8000';

async function testAIService() {
  console.log('🧪 Testing AI Service Endpoints\n');

  try {
    // Test resume analysis
    console.log('📄 Testing Resume Analysis...');
    const resumeResponse = await axios.post(`${AI_SERVICE_URL}/analyze-resume`, {
      resume_text: 'Experienced software engineer with 5 years in JavaScript, React, Node.js, and Python. Led development teams and delivered scalable applications.',
      job_description: 'Senior Software Engineer position requiring React, Node.js, and team leadership experience. 3+ years required.'
    });
    console.log('✅ Resume Analysis:', resumeResponse.data);
    console.log('');

    // Test candidate ranking
    console.log('🏆 Testing Candidate Ranking...');
    const rankingResponse = await axios.post(`${AI_SERVICE_URL}/rank-candidates`, {
      candidates: [
        { name: 'John Doe', skills: ['React', 'Node.js'], experience_years: 5, education_level: 'bachelor' },
        { name: 'Jane Smith', skills: ['Python', 'Django'], experience_years: 3, education_level: 'master' }
      ],
      job_requirements: {
        required_skills: ['React', 'Node.js'],
        min_experience: 3,
        education_level: 'bachelor'
      }
    });
    console.log('✅ Candidate Ranking:', rankingResponse.data);
    console.log('');

    // Test bias analysis
    console.log('⚖️ Testing Bias Analysis...');
    const biasResponse = await axios.post(`${AI_SERVICE_URL}/analyze-bias`, {
      hiring_data: [
        { gender: 'male', age: 28, hired: true },
        { gender: 'female', age: 32, hired: false },
        { gender: 'male', age: 35, hired: true },
        { gender: 'female', age: 29, hired: true }
      ]
    });
    console.log('✅ Bias Analysis:', biasResponse.data);
    console.log('');

    // Test sentiment analysis
    console.log('😊 Testing Sentiment Analysis...');
    const sentimentResponse = await axios.post(`${AI_SERVICE_URL}/analyze-sentiment`, {
      text: 'I am very excited about this opportunity and believe I would be a great fit for the team!',
      context: 'job application response'
    });
    console.log('✅ Sentiment Analysis:', sentimentResponse.data);
    console.log('');

    console.log('🎉 All AI Service tests passed!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testAIService();