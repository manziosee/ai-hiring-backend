import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { HfInference } from '@huggingface/inference';

@Injectable()
export class AiService {
  private openai: OpenAI;
  private hf: HfInference;

  constructor(private configService: ConfigService) {
    const openaiKey = this.configService.get('OPENAI_API_KEY');
    const hfKey = this.configService.get('HUGGINGFACE_API_KEY');
    
    if (openaiKey) {
      this.openai = new OpenAI({ apiKey: openaiKey });
    }
    if (hfKey) {
      this.hf = new HfInference(hfKey);
    }
  }

  async generateInterviewQuestions(
    jobTitle: string,
    jobDescription: string,
    candidateSkills: string[],
  ): Promise<string[]> {
    try {
      if (!this.openai) {
        return this.getFallbackQuestions(jobTitle);
      }
      
      const prompt = `Generate 5 interview questions for a ${jobTitle} position. 
      Job Description: ${jobDescription}
      Candidate Skills: ${candidateSkills.join(', ')}
      
      Focus on technical skills, problem-solving, and role-specific scenarios.
      Return only the questions, numbered 1-5.`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 500,
        temperature: 0.7,
      });

      const questions =
        response.choices[0]?.message?.content
          ?.split('\n')
          .filter((line) => line.trim() && /^\d+\./.test(line.trim()))
          .map((line) => line.replace(/^\d+\.\s*/, '').trim()) || [];

      return questions;
    } catch (error) {
      // Log error without exposing sensitive details
      console.error('Error generating interview questions');
      return this.getFallbackQuestions(jobTitle);
    }
  }

  async analyzeInterviewResponse(
    question: string,
    response: string,
  ): Promise<{
    score: number;
    feedback: string;
    keyPoints: string[];
  }> {
    try {
      if (!this.openai) {
        return {
          score: 5,
          feedback: 'OpenAI service not available',
          keyPoints: [],
        };
      }
      
      const prompt = `Analyze this interview response:
      Question: ${question}
      Response: ${response}
      
      Provide:
      1. Score (0-10)
      2. Brief feedback
      3. Key strengths/weaknesses
      
      Format as JSON: {"score": number, "feedback": "string", "keyPoints": ["string"]}`;

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 300,
        temperature: 0.3,
      });

      const result = JSON.parse(
        completion.choices[0]?.message?.content || '{}',
      );
      return {
        score: result.score || 5,
        feedback: result.feedback || 'Response analyzed',
        keyPoints: result.keyPoints || [],
      };
    } catch (error) {
      // Log error without exposing sensitive details
      console.error('Error analyzing interview response');
      return {
        score: 5,
        feedback: 'Unable to analyze response at this time',
        keyPoints: [],
      };
    }
  }

  async extractSkillsFromText(text: string): Promise<string[]> {
    try {
      if (!this.hf) {
        return this.extractSkillsWithPatterns(text);
      }
      
      // Use skill-specific model for better accuracy
      const response = await this.hf.tokenClassification({
        model: 'jjzha/jobbert-base-cased',
        inputs: text,
      });

      // Extract skills from job-specific NER results
      const skills = response
        .filter((entity) => entity.entity_group === 'SKILL')
        .map((entity) => entity.word)
        .filter(
          (skill): skill is string =>
            typeof skill === 'string' && skill.length > 2,
        );

      // Fallback to pattern matching if no skills found
      if (skills.length === 0) {
        return this.extractSkillsWithPatterns(text);
      }

      return [...new Set(skills)];
    } catch (error) {
      console.error('Error extracting skills with JobBERT, falling back to patterns');
      return this.extractSkillsWithPatterns(text);
    }
  }

  async generateJobDescription(
    title: string,
    requirements: string[],
  ): Promise<string> {
    try {
      if (!this.openai) {
        return `Job description for ${title} position with requirements: ${requirements.join(', ')}.`;
      }
      
      const prompt = `Generate a professional job description for: ${title}
      
      Requirements: ${requirements.join(', ')}
      
      Include:
      - Role overview
      - Key responsibilities
      - Required qualifications
      - Preferred qualifications
      
      Keep it concise and professional.`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 800,
        temperature: 0.6,
      });

      return (
        response.choices[0]?.message?.content ||
        `Job description for ${title} position.`
      );
    } catch (error) {
      // Log error without exposing sensitive details
      console.error('Error generating job description');
      return `Job description for ${title} position with requirements: ${requirements.join(', ')}.`;
    }
  }

  private getFallbackQuestions(jobTitle: string): string[] {
    const genericQuestions = [
      `Tell me about your experience relevant to the ${jobTitle} role.`,
      'Describe a challenging project you worked on and how you overcame obstacles.',
      'How do you stay updated with the latest technologies and industry trends?',
      'Describe your approach to problem-solving in a team environment.',
      'What motivates you in your work, and how do you handle pressure?',
    ];
    return genericQuestions;
  }

  private extractSkillsWithPatterns(text: string): string[] {
    const skillPatterns = new Set([
      'javascript', 'typescript', 'python', 'java', 'c#', 'c++', 'go', 'rust',
      'react', 'angular', 'vue', 'svelte', 'node.js', 'express', 'nestjs',
      'django', 'flask', 'spring', 'laravel', 'rails', 'asp.net',
      'sql', 'postgresql', 'mysql', 'mongodb', 'redis', 'elasticsearch',
      'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'git',
      'html', 'css', 'sass', 'less', 'webpack', 'babel', 'vite',
      'jest', 'cypress', 'selenium', 'junit', 'pytest',
      'machine learning', 'ai', 'data science', 'tensorflow', 'pytorch',
      'graphql', 'rest api', 'microservices', 'devops', 'ci/cd'
    ]);

    const textLower = text.toLowerCase();
    const foundSkills = Array.from(skillPatterns).filter(skill => {
      const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      return regex.test(textLower);
    });

    return [...new Set(foundSkills)];
  }
}
