import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { UserRole, ApplicationStatus } from '@prisma/client';

describe('AI Hiring Platform (e2e)', () => {
  let app: INestApplication<App>;
  let prismaService: PrismaService;
  let authToken: string;
  let recruiterToken: string;
  let candidateId: string;
  let jobId: string;
  let applicationId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());

    prismaService = app.get<PrismaService>(PrismaService);

    await app.init();
  });

  afterAll(async () => {
    // Clean up test data
    await prismaService.application.deleteMany({});
    await prismaService.candidate.deleteMany({});
    await prismaService.job.deleteMany({});
    await prismaService.user.deleteMany({});
    await app.close();
  });

  describe('Authentication Flow', () => {
    it('/auth/register (POST) - should register a new recruiter', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'recruiter@test.com',
          password: 'password123',
          fullName: 'Test Recruiter',
          role: UserRole.RECRUITER,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('access_token');
          expect(res.body.user.email).toBe('recruiter@test.com');
          expect(res.body.user.role).toBe(UserRole.RECRUITER);
          recruiterToken = res.body.access_token;
        });
    });

    it('/auth/register (POST) - should register a new candidate', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'candidate@test.com',
          password: 'password123',
          fullName: 'Test Candidate',
          role: UserRole.CANDIDATE,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('access_token');
          expect(res.body.user.email).toBe('candidate@test.com');
          expect(res.body.user.role).toBe(UserRole.CANDIDATE);
          authToken = res.body.access_token;
        });
    });

    it('/auth/login (POST) - should login with valid credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'candidate@test.com',
          password: 'password123',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('access_token');
          expect(res.body.user.email).toBe('candidate@test.com');
        });
    });

    it('/auth/login (POST) - should fail with invalid credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'candidate@test.com',
          password: 'wrongpassword',
        })
        .expect(401);
    });
  });

  describe('Candidate Profile Management', () => {
    it('/candidates (POST) - should create candidate profile', () => {
      return request(app.getHttpServer())
        .post('/candidates')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'John Doe',
          skills: ['JavaScript', 'TypeScript', 'React'],
          yearsExp: 3,
          resumeUrl: 'https://example.com/resume.pdf',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.name).toBe('John Doe');
          expect(res.body.skills).toEqual([
            'JavaScript',
            'TypeScript',
            'React',
          ]);
          expect(res.body.yearsExp).toBe(3);
          candidateId = res.body.id;
        });
    });

    it('/candidates/:id (GET) - should get candidate profile', () => {
      return request(app.getHttpServer())
        .get(`/candidates/${candidateId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(candidateId);
          expect(res.body.name).toBe('John Doe');
        });
    });
  });

  describe('Job Management', () => {
    it('/jobs (POST) - should create a new job', () => {
      return request(app.getHttpServer())
        .post('/jobs')
        .set('Authorization', `Bearer ${recruiterToken}`)
        .send({
          title: 'Senior Frontend Developer',
          description: 'We are looking for a senior frontend developer...',
          skills: ['JavaScript', 'React', 'TypeScript'],
          experience: 3,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.title).toBe('Senior Frontend Developer');
          expect(res.body.skills).toEqual([
            'JavaScript',
            'React',
            'TypeScript',
          ]);
          jobId = res.body.id;
        });
    });

    it('/jobs (GET) - should get all jobs', () => {
      return request(app.getHttpServer())
        .get('/jobs')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
        });
    });

    it('/jobs/:id (GET) - should get specific job', () => {
      return request(app.getHttpServer())
        .get(`/jobs/${jobId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(jobId);
          expect(res.body.title).toBe('Senior Frontend Developer');
        });
    });
  });

  describe('Application Workflow', () => {
    it('/applications (POST) - should create job application', () => {
      return request(app.getHttpServer())
        .post('/applications')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          jobId: jobId,
          candidateId: candidateId,
          coverLetter: 'I am very interested in this position...',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.jobId).toBe(jobId);
          expect(res.body.candidateId).toBe(candidateId);
          expect(res.body.status).toBe(ApplicationStatus.SUBMITTED);
          applicationId = res.body.id;
        });
    });

    it('/applications/job/:jobId (GET) - should get applications for job', () => {
      return request(app.getHttpServer())
        .get(`/applications/job/${jobId}`)
        .set('Authorization', `Bearer ${recruiterToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
          expect(res.body[0].jobId).toBe(jobId);
        });
    });

    it('/applications/:id/status (PATCH) - should update application status', () => {
      return request(app.getHttpServer())
        .patch(`/applications/${applicationId}/status`)
        .set('Authorization', `Bearer ${recruiterToken}`)
        .send({
          status: ApplicationStatus.SCREENING,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.status).toBe(ApplicationStatus.SCREENING);
        });
    });
  });

  describe('AI Screening', () => {
    it('/screening/run/:applicationId (POST) - should run screening', () => {
      return request(app.getHttpServer())
        .post(`/screening/run/${applicationId}`)
        .set('Authorization', `Bearer ${recruiterToken}`)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('fitScore');
          expect(res.body).toHaveProperty('details');
          expect(res.body.applicationId).toBe(applicationId);
        });
    });

    it('/screening/results/:applicationId (GET) - should get screening results', () => {
      return request(app.getHttpServer())
        .get(`/screening/results/${applicationId}`)
        .set('Authorization', `Bearer ${recruiterToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
        });
    });
  });

  describe('Interview Scheduling', () => {
    it('/interviews (POST) - should schedule interview', () => {
      return request(app.getHttpServer())
        .post('/interviews')
        .set('Authorization', `Bearer ${recruiterToken}`)
        .send({
          applicationId: applicationId,
          scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          type: 'TECHNICAL',
          notes: 'Technical interview for frontend position',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.applicationId).toBe(applicationId);
          expect(res.body.type).toBe('TECHNICAL');
        });
    });

    it('/interviews/application/:applicationId (GET) - should get interviews for application', () => {
      return request(app.getHttpServer())
        .get(`/interviews/application/${applicationId}`)
        .set('Authorization', `Bearer ${recruiterToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
        });
    });
  });

  describe('Protected Routes', () => {
    it('should reject requests without authentication', () => {
      return request(app.getHttpServer()).get('/users/profile').expect(401);
    });

    it('should reject requests with invalid token', () => {
      return request(app.getHttpServer())
        .get('/users/profile')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });

    it('should allow access with valid token', () => {
      return request(app.getHttpServer())
        .get('/users/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
    });
  });

  describe('Health Check', () => {
    it('/ (GET) - should return health status', () => {
      return request(app.getHttpServer())
        .get('/')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('status');
          expect(res.body.status).toBe('OK');
        });
    });
  });
});
