# API Testing Guide

## Overview
This guide provides comprehensive test data and instructions for testing all API endpoints in the AI Hiring Backend.

## Quick Start

### 1. Start the Server
```bash
npm run start:dev
```

### 2. Run Automated Tests
```bash
node run-api-tests.js
```

### 3. Manual Testing Options
- **VS Code REST Client**: Use `test-endpoints.http`
- **Postman**: Import `postman-collection.json`
- **cURL**: See examples below

## Test Data Structure

### Authentication Flow
1. **Register Users** (3 roles: ADMIN, RECRUITER, CANDIDATE)
2. **Login** to get JWT tokens
3. **Use tokens** for protected endpoints

### Testing Order
```
Health Check → Register → Login → Jobs → Candidates → Applications → Interviews → Screening → AI Services
```

## Sample cURL Commands

### Register & Login
```bash
# Register Admin
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@aihiring.com",
    "password": "AdminPass123!",
    "fullName": "System Administrator",
    "role": "ADMIN"
  }'

# Login Admin
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@aihiring.com",
    "password": "AdminPass123!"
  }'
```

### Job Management
```bash
# Create Job (requires recruiter/admin token)
curl -X POST http://localhost:3000/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Senior Full Stack Developer",
    "description": "Experienced developer needed for scalable web applications",
    "skills": ["JavaScript", "TypeScript", "React", "Node.js"],
    "experience": 5
  }'

# Get All Jobs
curl -X GET http://localhost:3000/jobs
```

### Applications
```bash
# Apply for Job (requires candidate token)
curl -X POST http://localhost:3000/applications \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer CANDIDATE_TOKEN" \
  -d '{
    "jobId": "JOB_ID",
    "coverLetter": "I am excited to apply for this position..."
  }'

# Update Application Status (requires recruiter/admin token)
curl -X PATCH http://localhost:3000/applications/APPLICATION_ID/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer RECRUITER_TOKEN" \
  -d '{"status": "UNDER_REVIEW"}'
```

### File Upload
```bash
# Upload Resume (requires candidate token)
curl -X POST http://localhost:3000/file-upload/resume \
  -H "Authorization: Bearer CANDIDATE_TOKEN" \
  -F "file=@test-files/sample-resume.txt"
```

## Available Endpoints

### 🔐 Authentication (`/auth`)
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/refresh` - Refresh JWT token
- `POST /auth/logout` - Logout user

### 👤 Users (`/users`)
- `GET /users/me` - Get current user profile
- `PATCH /users/me` - Update user profile

### 💼 Jobs (`/jobs`)
- `POST /jobs` - Create job (Admin/Recruiter)
- `GET /jobs` - Get all jobs
- `GET /jobs/:id` - Get job by ID
- `PATCH /jobs/:id` - Update job (Admin/Recruiter)
- `DELETE /jobs/:id` - Delete job (Admin/Recruiter)

### 👥 Candidates (`/candidates`)
- `POST /candidates` - Create candidate profile
- `GET /candidates` - Get all candidates (Admin/Recruiter)
- `GET /candidates/:id` - Get candidate by ID (Admin/Recruiter)

### 📄 Applications (`/applications`)
- `POST /applications` - Apply for job (Candidate)
- `GET /applications/job/:jobId` - Get applications by job (Admin/Recruiter)
- `GET /applications/candidate/:candidateId` - Get candidate applications
- `PATCH /applications/:id/status` - Update application status (Admin/Recruiter)

### 🎤 Interviews (`/interviews`)
- `POST /interviews` - Schedule interview (Admin/Recruiter)
- `GET /interviews` - Get all interviews (Admin/Recruiter)
- `GET /interviews/:applicationId` - Get interviews by application (Admin/Recruiter)

### 🤖 AI Screening (`/screening`)
- `POST /screening/run/:applicationId` - Run AI screening (Admin/Recruiter)
- `GET /screening/results/:applicationId` - Get screening results (Admin/Recruiter)

### 🧠 AI Services (`/ai`)
- `POST /ai/generate-job-description` - Generate job description (Admin/Recruiter)
- `POST /ai/generate-interview-questions` - Generate interview questions (Admin/Recruiter)
- `POST /ai/analyze-interview-response` - Analyze interview response (Admin/Recruiter)

### 📁 File Upload (`/file-upload`, `/uploads`)
- `POST /file-upload/resume` - Upload resume (Candidate)
- `POST /uploads/resume` - Upload resume (All roles)
- `POST /uploads/job-description` - Upload job description (Admin/Recruiter)
- `GET /uploads/resume/:candidateId` - Download resume (Admin/Recruiter)
- `GET /uploads/job-description/:jobId` - Download job description (Admin/Recruiter)

### 🏥 Health (`/health`)
- `GET /health` - Health check
- `GET /health/metrics` - System metrics

## Role-Based Access

### 🔴 Admin
- Full access to all endpoints
- User management
- System administration

### 🟡 Recruiter
- Job management (CRUD)
- View candidates and applications
- Schedule interviews
- Run AI screening
- Access AI services

### 🟢 Candidate
- Apply for jobs
- Manage own profile
- Upload resume
- View own applications

## Environment Variables Required
```env
DATABASE_URL="postgresql://..."
JWT_SECRET="your-jwt-secret"
OPENAI_API_KEY="your-openai-key"
HUGGINGFACE_API_KEY="your-huggingface-key"
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"
```

## Testing Tips

1. **Start with Health Check** - Verify server is running
2. **Register Users First** - Create all three user types
3. **Login and Store Tokens** - Copy JWT tokens for subsequent requests
4. **Follow Dependencies** - Create jobs before applications, applications before interviews
5. **Test Role Permissions** - Verify endpoints reject unauthorized access
6. **File Upload Testing** - Use actual files for upload endpoints
7. **WebSocket Testing** - Connect to ws://localhost:3000 for real-time notifications

## Common Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `429` - Too Many Requests (rate limiting)
- `500` - Internal Server Error
