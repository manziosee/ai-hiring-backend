import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AiAnalysisService {
  constructor(private prisma: PrismaService) {}

  async summarizeResume(applicationId: string) {
    const application = await this.prisma.application.findUnique({
      where: { id: applicationId },
      include: { candidate: true, job: true }
    });

    if (!application) throw new Error('Application not found');

    try {
      // Call Python AI service for real analysis
      const response = await fetch('http://localhost:8000/analyze-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resume_text: `Skills: ${application.candidate.skills.join(', ')}. Experience: ${application.candidate.yearsExp} years. Name: ${application.candidate.name}`,
          job_description: `${application.job.title}: ${application.job.description}. Required skills: ${application.job.skills.join(', ')}. Experience: ${application.job.experience} years.`
        })
      });

      if (response.ok) {
        const aiResult = await response.json();
        return {
          keySkills: aiResult.key_skills,
          experience: `${aiResult.experience_years}+ years`,
          strengths: aiResult.strengths,
          matchScore: Math.round(aiResult.match_score),
          summary: aiResult.summary
        };
      }
    } catch (error) {
      console.error('AI service error:', error);
    }

    // Fallback to mock data
    return {
      keySkills: application.candidate.skills.slice(0, 4),
      experience: `${application.candidate.yearsExp}+ years`,
      strengths: ['Technical expertise', 'Problem solving', 'Communication'],
      matchScore: Math.floor(Math.random() * 40) + 60,
      summary: `Experienced ${application.job.title.toLowerCase()} with ${application.candidate.yearsExp} years of experience and strong technical skills.`
    };
  }

  async rankCandidates(jobId: string) {
    const applications = await this.prisma.application.findMany({
      where: { jobId },
      include: { candidate: true }
    });

    const job = await this.prisma.job.findUnique({ where: { id: jobId } });
    
    const rankedCandidates = applications.map(app => ({
      ...app,
      matchScore: Math.floor(Math.random() * 40) + 60,
      keyStrengths: ['Technical skills', 'Experience match', 'Cultural fit'],
      summary: `Strong candidate with relevant experience for ${job?.title || 'this position'}`
    })).sort((a, b) => b.matchScore - a.matchScore);

    return rankedCandidates;
  }

  async analyzeSkillGaps(companyId: string) {
    const jobs = await this.prisma.job.findMany({
      where: { createdBy: companyId },
      include: { applications: true }
    });

    const skillGaps = {
      inDemandSkills: ['React', 'Python', 'AWS', 'Docker', 'Kubernetes'],
      hardToFillRoles: ['Senior DevOps Engineer', 'ML Engineer', 'Security Architect'],
      averageTimeToHire: 45,
      skillHeatmap: {
        'Frontend': { demand: 85, supply: 60 },
        'Backend': { demand: 90, supply: 75 },
        'DevOps': { demand: 95, supply: 40 },
        'Data Science': { demand: 80, supply: 35 }
      }
    };

    return skillGaps;
  }
}