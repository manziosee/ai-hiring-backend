import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { HfInference } from '@huggingface/inference';

@Injectable()
export class AiService {
  private openai: OpenAI;
  private hf: HfInference;

  constructor(private configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get('OPENAI_API_KEY'),
    });
    
    this.hf = new HfInference(this.configService.get('HUGGINGFACE_API_KEY'));
  }

  async generateInterviewQuestions(jobTitle: string, jobDescription: string, candidateSkills: string[]): Promise<string[]> {
    try {
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

      const questions = response.choices[0]?.message?.content
        ?.split('\n')
        .filter(line => line.trim() && /^\d+\./.test(line.trim()))
        .map(line => line.replace(/^\d+\.\s*/, '').trim()) || [];

      return questions;
    } catch (error) {
      console.error('Error generating interview questions:', error);
      return this.getFallbackQuestions(jobTitle);
    }
  }

  async analyzeInterviewResponse(question: string, response: string): Promise<{
    score: number;
    feedback: string;
    keyPoints: string[];
  }> {
    try {
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

      const result = JSON.parse(completion.choices[0]?.message?.content || '{}');
      return {
        score: result.score || 5,
        feedback: result.feedback || 'Response analyzed',
        keyPoints: result.keyPoints || [],
      };
    } catch (error) {
      console.error('Error analyzing interview response:', error);
      return {
        score: 5,
        feedback: 'Unable to analyze response at this time',
        keyPoints: [],
      };
    }
  }

  async extractSkillsFromText(text: string): Promise<string[]> {
    try {
      // Use Hugging Face for skill extraction
      const response = await this.hf.tokenClassification({
        model: 'dbmdz/bert-large-cased-finetuned-conll03-english',
        inputs: text,
      });

      // Extract skills from NER results
      const skills = response
        .filter(entity => entity.entity_group === 'MISC' || entity.entity_group === 'ORG')
        .map(entity => entity.word)
        .filter((skill): skill is string => typeof skill === 'string' && skill.length > 2);

      return [...new Set(skills)];
    } catch (error) {
      console.error('Error extracting skills with Hugging Face:', error);
      return this.extractSkillsWithPatterns(text);
    }
  }

  async generateJobDescription(title: string, requirements: string[]): Promise<string> {
    try {
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

      return response.choices[0]?.message?.content || `Job description for ${title} position.`;
    } catch (error) {
      console.error('Error generating job description:', error);
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
    const skillPatterns = [
      'javascript', 'typescript', 'python', 'java', 'react', 'angular', 'vue',
      'node.js', 'express', 'nestjs', 'django', 'flask', 'spring', 'laravel',
      'sql', 'postgresql', 'mysql', 'mongodb', 'redis', 'elasticsearch',
      'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'git',
      'html', 'css', 'sass', 'webpack', 'babel', 'jest', 'cypress',
      'machine learning', 'ai', 'data science', 'tensorflow', 'pytorch',
    ];

    const foundSkills = skillPatterns.filter(skill =>
      text.toLowerCase().includes(skill.toLowerCase())
    );

    return [...new Set(foundSkills)];
  }
}
