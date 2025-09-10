# 🚀 Postman Test Data for AI Hiring Backend

## Base URL
```
http://localhost:3000
```

## 🔐 Authentication Endpoints

### 1. Register User (Admin)
**POST** `/auth/register`
```json
{
  "email": "admin@example.com",
  "password": "Admin123!",
  "fullName": "John Admin",
  "role": "ADMIN"
}
```

### 2. Register User (Recruiter)
**POST** `/auth/register`
```json
{
  "email": "recruiter@example.com",
  "password": "Recruiter123!",
  "fullName": "Jane Smith",
  "role": "RECRUITER"
}
```

### 3. Register User (Candidate)
**POST** `/auth/register`
```json
{
  "email": "candidate@example.com",
  "password": "Candidate123!",
  "fullName": "Mike Johnson",
  "role": "CANDIDATE",
  "candidateData": {
    "phone": "+1234567890",
    "location": "New York, NY",
    "skills": ["JavaScript", "React", "Node.js"],
    "yearsExp": 3
  }
}
```

### 4. Login
**POST** `/auth/login`
```json
{
  "email": "admin@example.com",
  "password": "Admin123!"
}
```

### 5. Refresh Token
**POST** `/auth/refresh`
**Headers:** `Authorization: Bearer <refresh_token>`

### 6. Logout
**POST** `/auth/logout`
**Headers:** `Authorization: Bearer <access_token>`

---

## 👥 Users Management

### 7. Get Current User
**GET** `/users/me`
**Headers:** `Authorization: Bearer <access_token>`

### 8. List All Users (Admin only)
**GET** `/users`
**Headers:** `Authorization: Bearer <admin_token>`

### 9. Get User by ID
**GET** `/users/1`
**Headers:** `Authorization: Bearer <admin_token>`

### 10. Update User Profile
**PATCH** `/users/1`
**Headers:** `Authorization: Bearer <access_token>`
```json
{
  "firstName": "Updated John",
  "lastName": "Updated Admin",
  "phone": "+1234567890"
}
```

### 11. Delete User (Admin only)
**DELETE** `/users/2`
**Headers:** `Authorization: Bearer <admin_token>`

---

## 💼 Jobs Management

### 12. Create Job (Recruiter)
**POST** `/jobs`
**Headers:** `Authorization: Bearer <recruiter_token>`
```json
{
  "title": "Senior Software Engineer",
  "description": "We are looking for an experienced software engineer to join our team.",
  "requirements": "5+ years of experience in JavaScript, Node.js, React",
  "location": "New York, NY",
  "salary": 120000,
  "type": "FULL_TIME",
  "department": "Engineering"
}
```

### 13. Create Another Job
**POST** `/jobs`
**Headers:** `Authorization: Bearer <recruiter_token>`
```json
{
  "title": "Frontend Developer",
  "description": "Join our frontend team to build amazing user interfaces.",
  "requirements": "3+ years React, TypeScript, CSS",
  "location": "San Francisco, CA",
  "salary": 95000,
  "type": "FULL_TIME",
  "department": "Engineering"
}
```

### 14. List All Jobs
**GET** `/jobs`

### 15. Get Job Details
**GET** `/jobs/1`

### 16. Update Job
**PUT** `/jobs/1`
**Headers:** `Authorization: Bearer <recruiter_token>`
```json
{
  "title": "Senior Full Stack Engineer",
  "description": "Updated job description for full stack role.",
  "requirements": "5+ years full stack development",
  "location": "Remote",
  "salary": 130000,
  "type": "FULL_TIME",
  "department": "Engineering"
}
```

### 17. Delete Job
**DELETE** `/jobs/2`
**Headers:** `Authorization: Bearer <recruiter_token>`

---

## 📋 Applications

### 18. Apply for Job
**POST** `/applications`
**Headers:** `Authorization: Bearer <candidate_token>`
```json
{
  "jobId": 1,
  "coverLetter": "I am very interested in this position and believe my skills align perfectly with your requirements."
}
```

### 19. Get User Applications
**GET** `/applications`
**Headers:** `Authorization: Bearer <candidate_token>`

### 20. Get Application Details
**GET** `/applications/1`
**Headers:** `Authorization: Bearer <access_token>`

### 21. Get Applications for Job
**GET** `/applications/job/1`
**Headers:** `Authorization: Bearer <recruiter_token>`

### 22. Update Application Status
**PATCH** `/applications/1/status`
**Headers:** `Authorization: Bearer <recruiter_token>`
```json
{
  "status": "REVIEWED"
}
```

---

## 🤖 AI Screening

### 23. Run AI Screening
**POST** `/screening/run/1`
**Headers:** `Authorization: Bearer <recruiter_token>`

### 24. Get Screening Results
**GET** `/screening/1`
**Headers:** `Authorization: Bearer <access_token>`

### 25. Get Job Screening Results
**GET** `/screening/job/1`
**Headers:** `Authorization: Bearer <recruiter_token>`

---

## 📅 Interviews

### 26. Schedule Interview
**POST** `/interviews`
**Headers:** `Authorization: Bearer <recruiter_token>`
```json
{
  "applicationId": 1,
  "scheduledAt": "2024-02-15T10:00:00Z",
  "type": "TECHNICAL",
  "location": "Conference Room A",
  "notes": "Technical interview focusing on JavaScript and system design"
}
```

### 27. Get Interviews for Application
**GET** `/interviews/1`
**Headers:** `Authorization: Bearer <access_token>`

### 28. Update Interview
**PUT** `/interviews/1`
**Headers:** `Authorization: Bearer <recruiter_token>`
```json
{
  "scheduledAt": "2024-02-15T14:00:00Z",
  "type": "TECHNICAL",
  "location": "Conference Room B",
  "notes": "Rescheduled technical interview"
}
```

### 29. Cancel Interview
**DELETE** `/interviews/1`
**Headers:** `Authorization: Bearer <recruiter_token>`

---

## 📁 File Upload

### 30. Upload Resume
**POST** `/uploads/resume`
**Headers:** 
- `Authorization: Bearer <candidate_token>`
- `Content-Type: multipart/form-data`
**Body:** Form-data with file field named `file`

### 31. Download Resume
**GET** `/uploads/resume/resume_123.pdf`
**Headers:** `Authorization: Bearer <recruiter_token>`

### 32. Upload Job Description
**POST** `/uploads/job-description`
**Headers:** 
- `Authorization: Bearer <recruiter_token>`
- `Content-Type: multipart/form-data`
**Body:** Form-data with file field named `file`

---

## 🏥 Health & Monitoring

### 33. Health Check
**GET** `/health`

### 34. App Metrics
**GET** `/metrics`

---

## 📊 Dashboard Endpoints

### 35. Admin Dashboard
**GET** `/dashboard/admin`
**Headers:** `Authorization: Bearer <admin_token>`

### 36. Recruiter Dashboard
**GET** `/dashboard/recruiter`
**Headers:** `Authorization: Bearer <recruiter_token>`

### 37. Candidate Dashboard
**GET** `/dashboard/candidate`
**Headers:** `Authorization: Bearer <candidate_token>`

---

## 📝 Testing Workflow

### Step 1: Authentication Flow
1. Register users (Admin, Recruiter, Candidate)
2. Login with each user type
3. Save the JWT tokens for subsequent requests

### Step 2: Job Management Flow
1. Create jobs as Recruiter
2. List all jobs (public)
3. Get job details

### Step 3: Application Flow
1. Apply for jobs as Candidate
2. View applications as Candidate
3. View job applications as Recruiter
4. Update application status as Recruiter

### Step 4: AI Screening Flow
1. Run AI screening on applications
2. View screening results

### Step 5: Interview Flow
1. Schedule interviews as Recruiter
2. Update interview details
3. View interviews

### Step 6: File Upload Flow
1. Upload resume as Candidate
2. Upload job description as Recruiter
3. Download files as authorized users

---

## 🔑 Sample JWT Tokens Structure

After login, you'll receive tokens like:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "admin@example.com",
    "role": "ADMIN"
  }
}
```

Use the `access_token` in the Authorization header:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🚨 Common Status Codes

- **200** - Success
- **201** - Created
- **400** - Bad Request
- **401** - Unauthorized
- **403** - Forbidden
- **404** - Not Found
- **409** - Conflict
- **500** - Internal Server Error

---

## 💡 Tips for Testing

1. **Start with Health Check** - Ensure the API is running
2. **Register Users First** - Create all user types before testing
3. **Save Tokens** - Store JWT tokens in Postman environment variables
4. **Test Role Permissions** - Verify that role-based access works correctly
5. **Test Error Cases** - Try invalid data to test validation
6. **File Uploads** - Use actual PDF/DOCX files for resume uploads
7. **Sequential Testing** - Some endpoints depend on data from previous requests

---

## 🔧 Postman Environment Variables

Create these variables in Postman:
- `base_url`: `http://localhost:3000`
- `admin_token`: `<admin_jwt_token>`
- `recruiter_token`: `<recruiter_jwt_token>`
- `candidate_token`: `<candidate_jwt_token>`
- `job_id`: `1`
- `application_id`: `1`
- `user_id`: `1`