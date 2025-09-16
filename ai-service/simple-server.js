const express = require('express');
const cors = require('cors');

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

// Simple AI Service
class SimpleAIService {
  extractSkills(text) {
    const skills = [
      'Python', 'JavaScript', 'Java', 'React', 'Node.js', 'SQL', 'AWS', 'Docker',
      'Kubernetes', 'Machine Learning', 'Data Science', 'Project Management',
      'Leadership', 'Communication', 'Problem Solving', 'Teamwork', 'Git',
      'HTML', 'CSS', 'TypeScript', 'Angular', 'Vue', 'MongoDB', 'PostgreSQL'
    ];
    
    const found = [];
    const textLower = text.toLowerCase();
    
    skills.forEach(skill => {
      if (textLower.includes(skill.toLowerCase())) {
        found.push(skill);
      }
    });
    
    return found.slice(0, 6);
  }

  extractExperience(text) {
    const match = text.match(/(\d+)\s*years?/i);
    return match ? parseInt(match[1]) : 3;
  }

  calculateMatchScore(resume, job) {
    const resumeWords = new Set(resume.toLowerCase().split(/\s+/));
    const jobWords = new Set(job.toLowerCase().split(/\s+/));
    
    const intersection = new Set([...resumeWords].filter(x => jobWords.has(x)));
    const union = new Set([...resumeWords, ...jobWords]);
    
    return Math.round((intersection.size / union.size) * 100);
  }

  analyzeResume(resumeText, jobDescription) {
    const skills = this.extractSkills(resumeText);
    const experience = this.extractExperience(resumeText);
    const matchScore = this.calculateMatchScore(resumeText, jobDescription);
    
    return {
      match_score: matchScore,
      key_skills: skills,
      experience_years: experience,
      strengths: skills.slice(0, 3),
      weaknesses: ['Communication', 'Leadership'].filter(w => !skills.includes(w)),
      summary: `Professional with ${experience} years of experience in ${skills.slice(0, 2).join(' and ')}. Strong technical background suitable for this role.`
    };
  }

  rankCandidates(candidates, jobRequirements) {
    const ranked = candidates.map(candidate => {
      let score = 50; // Base score
      
      // Skills matching
      const candidateSkills = candidate.skills || [];
      const requiredSkills = jobRequirements.required_skills || [];
      const skillMatch = candidateSkills.filter(s => requiredSkills.includes(s)).length;
      score += (skillMatch / Math.max(requiredSkills.length, 1)) * 30;
      
      // Experience
      const expRatio = (candidate.experience_years || 0) / Math.max(jobRequirements.min_experience || 1, 1);
      score += Math.min(expRatio, 1) * 20;
      
      return { ...candidate, ai_score: Math.round(score) };
    });
    
    return {
      ranked_candidates: ranked.sort((a, b) => b.ai_score - a.ai_score),
      ranking_criteria: { skills_weight: 0.4, experience_weight: 0.3, education_weight: 0.3 }
    };
  }

  analyzeBias(hiringData) {
    const totalCandidates = hiringData.length;
    const hiredCount = hiringData.filter(h => h.hired).length;
    const hireRate = totalCandidates > 0 ? hiredCount / totalCandidates : 0;
    
    // Simple bias calculation
    const biasScore = Math.abs(0.5 - hireRate) * 100;
    
    return {
      bias_score: Math.round(biasScore),
      bias_indicators: { overall_hire_rate: hireRate },
      recommendations: [
        'Implement structured interviews',
        'Use diverse interview panels',
        'Monitor hiring patterns regularly'
      ]
    };
  }

  analyzeSentiment(text, context) {
    const positiveWords = ['excited', 'great', 'excellent', 'amazing', 'love', 'passionate'];
    const negativeWords = ['bad', 'terrible', 'hate', 'awful', 'disappointed'];
    
    const textLower = text.toLowerCase();
    const positiveCount = positiveWords.filter(word => textLower.includes(word)).length;
    const negativeCount = negativeWords.filter(word => textLower.includes(word)).length;
    
    let sentiment = 'neutral';
    let confidence = 0.5;
    
    if (positiveCount > negativeCount) {
      sentiment = 'positive';
      confidence = Math.min(0.9, 0.6 + (positiveCount * 0.1));
    } else if (negativeCount > positiveCount) {
      sentiment = 'negative';
      confidence = Math.min(0.9, 0.6 + (negativeCount * 0.1));
    }
    
    return {
      sentiment,
      confidence,
      emotions: { enthusiasm: positiveCount, concern: negativeCount },
      engagement_score: Math.min(text.length / 10, 100)
    };
  }
}

const aiService = new SimpleAIService();

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'ai-ml-service', timestamp: new Date().toISOString() });
});

app.post('/analyze-resume', (req, res) => {
  try {
    const { resume_text, job_description } = req.body;
    const result = aiService.analyzeResume(resume_text || '', job_description || '');
    res.json(result);
  } catch (error) {
    console.error('Resume analysis error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/rank-candidates', (req, res) => {
  try {
    const { candidates, job_requirements } = req.body;
    const result = aiService.rankCandidates(candidates || [], job_requirements || {});
    res.json(result);
  } catch (error) {
    console.error('Ranking error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/analyze-bias', (req, res) => {
  try {
    const { hiring_data } = req.body;
    const result = aiService.analyzeBias(hiring_data || []);
    res.json(result);
  } catch (error) {
    console.error('Bias analysis error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/analyze-sentiment', (req, res) => {
  try {
    const { text, context } = req.body;
    const result = aiService.analyzeSentiment(text || '', context || '');
    res.json(result);
  } catch (error) {
    console.error('Sentiment analysis error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`🤖 Simple AI Service running on http://localhost:${port}`);
  console.log(`📊 Health: http://localhost:${port}/health`);
});

module.exports = app;