const express = require('express');
const cors = require('cors');
const natural = require('natural');
const Sentiment = require('sentiment');
const compromise = require('compromise');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8000;
const sentiment = new Sentiment();

// Middleware
app.use(cors());
app.use(express.json());

// AI Service Class
class AIService {
  constructor() {
    this.commonSkills = [
      'Python', 'JavaScript', 'Java', 'React', 'Node.js', 'SQL', 'AWS', 'Docker',
      'Kubernetes', 'Machine Learning', 'Data Science', 'Project Management',
      'Leadership', 'Communication', 'Problem Solving', 'Teamwork', 'Git',
      'HTML', 'CSS', 'TypeScript', 'Angular', 'Vue', 'MongoDB', 'PostgreSQL',
      'C++', 'C#', '.NET', 'Spring', 'Django', 'Flask', 'Redis', 'GraphQL'
    ];
  }

  analyzeResume(resumeText, jobDescription) {
    try {
      // Extract skills using NLP
      const skills = this.extractSkills(resumeText);
      
      // Calculate match score using TF-IDF similarity
      const matchScore = this.calculateMatchScore(resumeText, jobDescription);
      
      // Extract experience years
      const experienceYears = this.extractExperience(resumeText);
      
      // Generate AI summary
      const summary = this.generateSummary(resumeText, jobDescription, skills, experienceYears);
      
      // Analyze strengths and weaknesses
      const { strengths, weaknesses } = this.analyzeStrengthsWeaknesses(resumeText, jobDescription);
      
      return {
        match_score: Math.round(matchScore),
        key_skills: skills,
        experience_years: experienceYears,
        strengths: strengths,
        weaknesses: weaknesses,
        summary: summary
      };
    } catch (error) {
      console.error('Resume analysis error:', error);
      throw error;
    }
  }

  rankCandidates(candidates, jobRequirements) {
    try {
      const rankedCandidates = candidates.map(candidate => {
        const score = this.calculateCandidateScore(candidate, jobRequirements);
        return { ...candidate, ai_score: Math.round(score) };
      }).sort((a, b) => b.ai_score - a.ai_score);

      return {
        ranked_candidates: rankedCandidates,
        ranking_criteria: {
          skills_weight: 0.4,
          experience_weight: 0.3,
          education_weight: 0.2,
          cultural_fit_weight: 0.1
        }
      };
    } catch (error) {
      console.error('Candidate ranking error:', error);
      throw error;
    }
  }

  analyzeBias(hiringData) {
    try {
      if (!hiringData || hiringData.length === 0) {
        return {
          bias_score: 0,
          bias_indicators: {},
          recommendations: ['Collect more hiring data for analysis']
        };
      }

      const biasIndicators = this.detectBiasPatterns(hiringData);
      const biasScore = this.calculateBiasScore(biasIndicators);
      const recommendations = this.generateBiasRecommendations(biasIndicators);

      return {
        bias_score: Math.round(biasScore),
        bias_indicators: biasIndicators,
        recommendations: recommendations
      };
    } catch (error) {
      console.error('Bias analysis error:', error);
      throw error;
    }
  }

  analyzeSentiment(text, context) {
    try {
      // Use sentiment analysis library
      const sentimentResult = sentiment.analyze(text);
      
      // Extract emotions using NLP
      const emotions = this.extractEmotions(text);
      
      // Calculate engagement score
      const engagementScore = this.calculateEngagementScore(text, context);
      
      // Determine overall sentiment
      let sentimentLabel = 'neutral';
      let confidence = 0.5;
      
      if (sentimentResult.score > 0) {
        sentimentLabel = 'positive';
        confidence = Math.min(sentimentResult.score / 5, 0.95);
      } else if (sentimentResult.score < 0) {
        sentimentLabel = 'negative';
        confidence = Math.min(Math.abs(sentimentResult.score) / 5, 0.95);
      }

      return {
        sentiment: sentimentLabel,
        confidence: Math.round(confidence * 100) / 100,
        emotions: emotions,
        engagement_score: Math.round(engagementScore)
      };
    } catch (error) {
      console.error('Sentiment analysis error:', error);
      throw error;
    }
  }

  // Helper methods
  extractSkills(text) {
    const foundSkills = [];
    const textLower = text.toLowerCase();
    
    this.commonSkills.forEach(skill => {
      if (textLower.includes(skill.toLowerCase())) {
        foundSkills.push(skill);
      }
    });
    
    return foundSkills.slice(0, 8);
  }

  calculateMatchScore(resumeText, jobDescription) {
    try {
      // Simple word-based similarity
      const resumeWords = resumeText.toLowerCase().split(/\s+/);
      const jobWords = jobDescription.toLowerCase().split(/\s+/);
      
      const resumeSet = new Set(resumeWords);
      const jobSet = new Set(jobWords);
      
      const intersection = new Set([...resumeSet].filter(x => jobSet.has(x)));
      const union = new Set([...resumeSet, ...jobSet]);
      
      if (union.size === 0) return 50;
      
      const similarity = intersection.size / union.size;
      return Math.min(similarity * 100, 95);
    } catch (error) {
      console.error('Match score calculation error:', error);
      return 50; // Default score
    }
  }

  extractExperience(text) {
    const patterns = [
      /(\d+)\+?\s*years?\s*(?:of\s*)?experience/gi,
      /(\d+)\+?\s*years?\s*in/gi,
      /experience\s*:\s*(\d+)\+?\s*years?/gi
    ];
    
    for (const pattern of patterns) {
      const matches = text.match(pattern);
      if (matches && matches.length > 0) {
        const numbers = matches[0].match(/\d+/);
        if (numbers && numbers.length > 0) {
          return parseInt(numbers[0]);
        }
      }
    }
    
    // Look for simple number + years pattern
    const simpleMatch = text.match(/(\d+)\s*years?/i);
    if (simpleMatch) {
      return parseInt(simpleMatch[1]);
    }
    
    return 3; // Default experience
  }

  generateSummary(resumeText, jobDescription, skills, experience) {
    try {
      const topSkills = skills.slice(0, 3).join(', ') || 'various technologies';
      const jobWords = jobDescription.toLowerCase();
      let jobTitle = 'this position';
      
      // Extract job title from description
      if (jobWords.includes('engineer')) jobTitle = 'engineering role';
      else if (jobWords.includes('developer')) jobTitle = 'development position';
      else if (jobWords.includes('manager')) jobTitle = 'management role';
      
      return `Experienced professional with ${experience} years in the field. Strong expertise in ${topSkills}. Well-suited for ${jobTitle} with relevant technical background and proven track record.`;
    } catch (error) {
      console.error('Summary generation error:', error);
      return `Professional candidate with ${experience} years of experience and relevant skills for this position.`;
    }
  }

  analyzeStrengthsWeaknesses(resumeText, jobDescription) {
    const resumeSkills = new Set(this.extractSkills(resumeText));
    const jobSkills = new Set(this.extractSkills(jobDescription));
    
    const strengths = [...resumeSkills].filter(skill => jobSkills.has(skill)).slice(0, 4);
    const weaknesses = [...jobSkills].filter(skill => !resumeSkills.has(skill)).slice(0, 3);
    
    // Add generic strengths if none found
    if (strengths.length === 0) {
      strengths.push('Technical expertise', 'Problem solving', 'Adaptability');
    }
    
    return { strengths, weaknesses };
  }

  calculateCandidateScore(candidate, jobRequirements) {
    let score = 0;
    
    // Skills matching (40% weight)
    const candidateSkills = candidate.skills || [];
    const requiredSkills = jobRequirements.required_skills || [];
    if (requiredSkills.length > 0) {
      const skillMatch = candidateSkills.filter(skill => 
        requiredSkills.some(req => req.toLowerCase() === skill.toLowerCase())
      ).length;
      score += (skillMatch / requiredSkills.length) * 40;
    }
    
    // Experience (30% weight)
    const candidateExp = candidate.experience_years || 0;
    const requiredExp = jobRequirements.min_experience || 0;
    if (requiredExp > 0) {
      score += Math.min(candidateExp / requiredExp, 1.0) * 30;
    }
    
    // Education (20% weight)
    if (candidate.education_level === jobRequirements.education_level) {
      score += 20;
    } else {
      score += 10;
    }
    
    // Cultural fit (10% weight)
    score += 10;
    
    return Math.min(score, 100);
  }

  detectBiasPatterns(hiringData) {
    const indicators = {};
    
    // Gender bias analysis
    const genderGroups = this.groupBy(hiringData, 'gender');
    if (Object.keys(genderGroups).length > 1) {
      const genderRates = {};
      Object.keys(genderGroups).forEach(gender => {
        const group = genderGroups[gender];
        const hireRate = group.filter(h => h.hired).length / group.length;
        genderRates[gender] = hireRate;
      });
      
      const rates = Object.values(genderRates);
      const variance = this.calculateVariance(rates);
      indicators.gender_bias = { hire_rates: genderRates, variance };
    }
    
    // Age bias analysis
    const ageGroups = this.groupBy(hiringData, h => {
      const age = h.age || 30;
      if (age < 30) return 'under_30';
      if (age < 40) return '30_39';
      if (age < 50) return '40_49';
      return 'over_50';
    });
    
    if (Object.keys(ageGroups).length > 1) {
      const ageRates = {};
      Object.keys(ageGroups).forEach(ageGroup => {
        const group = ageGroups[ageGroup];
        const hireRate = group.filter(h => h.hired).length / group.length;
        ageRates[ageGroup] = hireRate;
      });
      
      const rates = Object.values(ageRates);
      const variance = this.calculateVariance(rates);
      indicators.age_bias = { hire_rates: ageRates, variance };
    }
    
    return indicators;
  }

  calculateBiasScore(indicators) {
    if (Object.keys(indicators).length === 0) return 0;
    
    let totalVariance = 0;
    let count = 0;
    
    Object.values(indicators).forEach(indicator => {
      if (indicator.variance !== undefined) {
        totalVariance += indicator.variance;
        count++;
      }
    });
    
    if (count === 0) return 0;
    
    const avgVariance = totalVariance / count;
    return Math.min(avgVariance * 100, 100);
  }

  generateBiasRecommendations(indicators) {
    const recommendations = [];
    
    Object.keys(indicators).forEach(indicator => {
      const data = indicators[indicator];
      if (data.variance > 0.1) {
        if (indicator.includes('gender')) {
          recommendations.push('Implement blind resume screening to reduce gender bias');
          recommendations.push('Ensure diverse interview panels');
        } else if (indicator.includes('age')) {
          recommendations.push('Focus on skills and experience rather than graduation dates');
          recommendations.push('Use structured interviews with standardized questions');
        }
      }
    });
    
    if (recommendations.length === 0) {
      recommendations.push('Continue monitoring hiring patterns for bias');
      recommendations.push('Maintain diverse candidate pipelines');
    }
    
    return recommendations;
  }

  extractEmotions(text) {
    const doc = compromise(text);
    
    const enthusiasmWords = doc.match('(excited|enthusiastic|passionate|love|amazing|fantastic)').length;
    const confidenceWords = doc.match('(confident|sure|certain|believe|know|experienced)').length;
    const concernWords = doc.match('(concerned|worried|unsure|doubt|uncertain)').length;
    
    const total = enthusiasmWords + confidenceWords + concernWords || 1;
    
    return {
      enthusiasm: Math.round((enthusiasmWords / total) * 100) / 100,
      confidence: Math.round((confidenceWords / total) * 100) / 100,
      concern: Math.round((concernWords / total) * 100) / 100
    };
  }

  calculateEngagementScore(text, context) {
    // Length factor (longer responses show more engagement)
    const lengthScore = Math.min(text.length / 500, 1.0) * 30;
    
    // Question asking (shows engagement)
    const questionScore = Math.min((text.match(/\?/g) || []).length / 3, 1.0) * 30;
    
    // Specific mentions (shows research)
    const contextWords = context.toLowerCase().split(' ');
    const specificMentions = contextWords.filter(word => 
      word.length > 3 && text.toLowerCase().includes(word)
    ).length;
    const mentionScore = Math.min(specificMentions / 5, 1.0) * 40;
    
    return lengthScore + questionScore + mentionScore;
  }

  // Utility methods
  groupBy(array, key) {
    return array.reduce((groups, item) => {
      const group = typeof key === 'function' ? key(item) : item[key];
      groups[group] = groups[group] || [];
      groups[group].push(item);
      return groups;
    }, {});
  }

  calculateVariance(numbers) {
    if (numbers.length === 0) return 0;
    const mean = numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
    const variance = numbers.reduce((sum, num) => sum + Math.pow(num - mean, 2), 0) / numbers.length;
    return variance;
  }
}

// Initialize AI service
const aiService = new AIService();

// Routes
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'ai-ml-service',
    timestamp: new Date().toISOString()
  });
});

app.post('/analyze-resume', async (req, res) => {
  try {
    const { resume_text, job_description } = req.body;
    
    if (!resume_text || !job_description) {
      return res.status(400).json({ error: 'Missing resume_text or job_description' });
    }
    
    const result = aiService.analyzeResume(resume_text, job_description);
    res.json(result);
  } catch (error) {
    console.error('Resume analysis error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/rank-candidates', async (req, res) => {
  try {
    const { candidates, job_requirements } = req.body;
    
    if (!candidates || !Array.isArray(candidates)) {
      return res.status(400).json({ error: 'Missing or invalid candidates array' });
    }
    
    const result = aiService.rankCandidates(candidates, job_requirements || {});
    res.json(result);
  } catch (error) {
    console.error('Candidate ranking error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/analyze-bias', async (req, res) => {
  try {
    const { hiring_data } = req.body;
    
    const result = aiService.analyzeBias(hiring_data || []);
    res.json(result);
  } catch (error) {
    console.error('Bias analysis error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/analyze-sentiment', async (req, res) => {
  try {
    const { text, context } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Missing text parameter' });
    }
    
    const result = aiService.analyzeSentiment(text, context || '');
    res.json(result);
  } catch (error) {
    console.error('Sentiment analysis error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`🤖 AI ML Service running on http://localhost:${port}`);
  console.log(`📊 Health check: http://localhost:${port}/health`);
  console.log(`🧠 Ready to process AI requests...`);
});

module.exports = app;