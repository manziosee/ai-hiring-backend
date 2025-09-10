# 🤖 AI Hiring Platform Backend

<div align="center">

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Kubernetes](https://img.shields.io/badge/Kubernetes-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white)

**An intelligent recruitment platform with AI-powered candidate screening and automated interview scheduling.**

[![CI/CD Pipeline](https://github.com/manziosee/ai-hiring-backend/actions/workflows/ci.yml/badge.svg)](https://github.com/manziosee/ai-hiring-backend/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/manziosee/ai-hiring-backend/pulls)
[![API Status](https://img.shields.io/badge/API-Online-brightgreen.svg)](https://ai-hiring-api.fly.dev/health)
[![Test Coverage](https://img.shields.io/badge/Coverage-85%25-brightgreen.svg)](https://github.com/manziosee/ai-hiring-backend/actions)
[![Security Score](https://img.shields.io/badge/Security-A-brightgreen.svg)](https://github.com/manziosee/ai-hiring-backend/security)


</div>

---

## 🚀 Features
- **🤖 AI-Powered Screening** — ML/NLP resume analysis & job matching  
- **👥 Role-Based Access** — Admin, Recruiter & Candidate roles  
- **📄 Resume Processing** — PDF/DOCX parsing & skill extraction  
- **💼 Job Management** — Full job posting & application system  
- **📊 Real-Time Analytics** — Candidate fit scores & screening results  
- **🔔 Notifications** — Email + WebSocket real-time updates  
- **📱 RESTful API** — Fully documented with Swagger/OpenAPI  
- **🔐 JWT Authentication** — Secure token-based authentication
- **📊 Role-Based Dashboards** — Customized dashboards for each user role
- **📅 Interview Scheduling** — Automated interview management system
- **📁 File Management** — Resume & document upload/download
- **🔍 Advanced Search** — Job and candidate search with filters
- **📈 Performance Metrics** — Real-time system monitoring
- **🛡️ Security Features** — Input sanitization, rate limiting, audit logs
- **🧪 Comprehensive Testing** — Unit, integration & e2e tests
- **🐳 Containerized** — Docker & Kubernetes ready  
- **☁️ Cloud Native** — Deployable on Fly.io, AWS, GCP, Azure
- **🚀 CI/CD Pipeline** — Automated testing and deployment  

---

## 🏗️ Architecture

```

┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
│   Main API      │   │   ML Service    │   │  Email Service  │
│    (NestJS)     │◄──►│   (FastAPI)    │◄──►│   (Node.js)    │
│                 │   │                 │   │                 │
│ - Auth          │   │ - Resume Parsing│   │ - Notifications │
│ - Jobs          │   │ - Skill Extract │   │ - Templates     │
│ - Applications  │   │ - AI Matching   │   │ - SMTP          │
│ - Screening     │   │ - Embeddings    │   │                 │
└─────────────────┘   └─────────────────┘   └─────────────────┘
▲                     ▲                      ▲
│                     │                      │
▼                     ▼                      ▼
┌─────────────────────────────────────────────────────────────┐
│                    PostgreSQL Database                      │
│                                                             │
│ Users | Jobs | Candidates | Applications | Screening Results │
└─────────────────────────────────────────────────────────────┘

````

---

## 📦 Quick Start

### ✅ Prerequisites
- Node.js 18+  
- PostgreSQL 13+  
- Python 3.9+  
- Docker (optional)  
- Kubernetes (optional)  

### 💻 Local Development

```bash
# Clone the repository
git clone https://github.com/manziosee/ai-hiring-backend.git
cd ai-hiring-backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your local settings

# Setup database
npm run prisma:migrate
npm run prisma:generate

# Start ML service
cd microservices/ml-service
pip install -r requirements.txt
python main.py

# Start Email service
cd microservices/email-service
npm install
npm start

# Start main application
npm run start:dev
````

* Main API: `http://localhost:3000`
* Swagger Docs: `http://localhost:3000/api`
* ML Service: `http://localhost:8000`
* Email Service: `http://localhost:3002`

---

## 🐳 Docker Deployment

### Using Docker Compose

```bash
# Build & start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Individual Services

```bash
# Main application
docker build -t ai-hiring-backend .

# ML service
cd microservices/ml-service
docker build -t ai-hiring-ml .

# Email service
cd microservices/email-service
docker build -t ai-hiring-email .
```

---

## ☸️ Kubernetes Deployment

### Prerequisites

* Kubernetes cluster (Minikube/GKE/EKS/AKS)
* `kubectl` configured
* Helm (optional)

### Deploy

```bash
# Apply manifests
kubectl apply -f kubernetes/

# Or with Helm
helm install ai-hiring-platform ./charts/ai-hiring-platform
```

### Access Services

```bash
kubectl get all -n ai-hiring
kubectl port-forward svc/main-api 3000:3000 -n ai-hiring
kubectl port-forward svc/ml-service 8000:8000 -n ai-hiring
```

---

## ✈️ Fly.io Deployment

### Prerequisites

* Fly.io account & CLI (`flyctl`)
* Docker installed

### Deploy

```bash
# Login
flyctl auth login

# Main API
flyctl apps create ai-hiring-api
flyctl secrets set DATABASE_URL=... JWT_SECRET=... EMAIL_USER=... EMAIL_PASSWORD=...
flyctl deploy

# ML Service
cd microservices/ml-service
flyctl apps create ai-hiring-ml
flyctl deploy

# Email Service
cd microservices/email-service
flyctl apps create ai-hiring-email
flyctl deploy
```

Example `fly.toml` for Main API:

```toml
app = "ai-hiring-api"
primary_region = "iad"

[build]
  builder = "paketobuildpacks/builder:base"

[http_service]
  internal_port = 3000
  force_https = true
  auto_stop_machines = true
  auto_start_machines = true
  min_machines_running = 0
```

---

## 📚 API Documentation

* Swagger Docs: [http://localhost:3000/api](http://localhost:3000/api)
* OpenAPI JSON: [http://localhost:3000/api-json](http://localhost:3000/api-json)

### 🔑 API Endpoints

#### 🔐 Authentication
| Method | Endpoint         | Description       | Auth | Status |
|--------|------------------|-------------------|------|--------|
| POST   | `/auth/register` | User registration | ❌    | ✅     |
| POST   | `/auth/login`    | User login        | ❌    | ✅     |
| POST   | `/auth/refresh`  | Refresh JWT token | ✅    | ✅     |
| POST   | `/auth/logout`   | User logout       | ✅    | ✅     |

#### 👥 Users Management
| Method | Endpoint           | Description          | Auth        | Status |
|--------|--------------------|----------------------|-------------|--------|
| GET    | `/users/me`        | Get current user     | ✅           | ✅     |
| GET    | `/users`           | List all users       | ✅ Admin     | ✅     |
| GET    | `/users/{id}`      | Get user by ID       | ✅ Admin     | ✅     |
| PATCH  | `/users/{id}`      | Update user profile  | ✅           | ✅     |
| DELETE | `/users/{id}`      | Delete user          | ✅ Admin     | ✅     |

#### 💼 Jobs Management
| Method | Endpoint           | Description          | Auth        | Status |
|--------|--------------------|----------------------|-------------|--------|
| GET    | `/jobs`            | List all jobs        | ❌           | ✅     |
| GET    | `/jobs/{id}`       | Get job details      | ❌           | ✅     |
| POST   | `/jobs`            | Create new job       | ✅ Recruiter | ✅     |
| PUT    | `/jobs/{id}`       | Update job           | ✅ Recruiter | ✅     |
| DELETE | `/jobs/{id}`       | Delete job           | ✅ Recruiter | ✅     |

#### 📋 Applications
| Method | Endpoint                    | Description              | Auth        | Status |
|--------|----------------------------|--------------------------|-------------|--------|
| POST   | `/applications`            | Apply for job            | ✅ Candidate | ✅     |
| GET    | `/applications`            | Get user applications    | ✅           | ✅     |
| GET    | `/applications/{id}`       | Get application details  | ✅           | ✅     |
| GET    | `/applications/job/{jobId}`| Get applications for job | ✅ Recruiter | ✅     |
| PATCH  | `/applications/{id}/status`| Update application status| ✅ Recruiter | ✅     |

#### 🤖 AI Screening
| Method | Endpoint                | Description           | Auth        | Status |
|--------|------------------------|-----------------------|-------------|--------|
| POST   | `/screening/run/{id}`   | Run AI screening      | ✅ Recruiter | ✅     |
| GET    | `/screening/{id}`       | Get screening results | ✅           | ✅     |
| GET    | `/screening/job/{id}`   | Get job screenings    | ✅ Recruiter | ✅     |

#### 📅 Interviews
| Method | Endpoint                     | Description                  | Auth        | Status |
|--------|------------------------------|------------------------------|-------------|--------|
| POST   | `/interviews`                | Schedule interview           | ✅ Recruiter | ✅     |
| GET    | `/interviews/{applicationId}`| Get interviews for application| ✅           | ✅     |
| PUT    | `/interviews/{id}`           | Update interview             | ✅ Recruiter | ✅     |
| DELETE | `/interviews/{id}`           | Cancel interview             | ✅ Recruiter | ✅     |

#### 📁 File Upload
| Method | Endpoint                    | Description              | Auth        | Status |
|--------|-----------------------------|--------------------------| ------------|--------|
| POST   | `/uploads/resume`           | Upload resume            | ✅ Candidate | ✅     |
| GET    | `/uploads/resume/{filename}`| Download resume          | ✅ Recruiter | ✅     |
| POST   | `/uploads/job-description`  | Upload job description   | ✅ Recruiter | ✅     |

#### 📊 Dashboard
| Method | Endpoint              | Description           | Auth        | Status |
|--------|-----------------------|-----------------------|-------------|--------|
| GET    | `/dashboard/admin`    | Admin dashboard data  | ✅ Admin     | ✅     |
| GET    | `/dashboard/recruiter`| Recruiter dashboard   | ✅ Recruiter | ✅     |
| GET    | `/dashboard/candidate`| Candidate dashboard   | ✅ Candidate | ✅     |

#### 🏥 Health & Monitoring
| Method | Endpoint    | Description    | Auth | Status |
|--------|-------------|----------------|------|--------|
| GET    | `/health`   | Health check   | ❌    | ✅     |
| GET    | `/metrics`  | App metrics    | ❌    | ✅     |

---

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run e2e tests
npm run test:e2e

# Run test coverage
npm run test:cov

# Run integration tests (requires services to be running)
npm install axios form-data
node test-integrations.js
```

### Integration Testing

The `test-integrations.js` script provides comprehensive end-to-end testing of all system components:

- **Health Checks**: Verifies main API and ML service availability
- **Authentication**: Tests user registration, login, and JWT token handling
- **Job Management**: Creates and retrieves job postings
- **Candidate Management**: Manages candidate profiles
- **AI Integrations**: Tests OpenAI and HuggingFace integrations
- **ML Service**: Validates resume screening and skill extraction
- **Application Workflow**: End-to-end application processing
- **Dashboard Testing**: Validates role-based dashboard data
- **File Upload/Download**: Tests resume and document handling
- **Interview Scheduling**: Validates interview management system
- **Rate Limiting**: Ensures security measures are active
- **Security Testing**: Input sanitization and XSS prevention

### Test Coverage
- **Unit Tests**: Individual component testing
- **Integration Tests**: API endpoint testing
- **E2E Tests**: Complete user workflow testing
- **Security Tests**: Vulnerability scanning
- **Performance Tests**: Load and stress testing

Before running integration tests:
1. Start the main API: `npm run start:dev`
2. Start the ML service: `cd microservices/ml-service && python main.py`
3. Ensure database is running and migrated
4. Set up environment variables (`.env` file)
5. Run: `node test-integrations.js`

---

## 🔧 Configuration

### Environment Variables

| Variable              | Description                  | Default                                        |
| --------------------- | ---------------------------- | ---------------------------------------------- |
| `DATABASE_URL`        | PostgreSQL connection string | -                                              |
| `JWT_SECRET`          | JWT signing secret           | -                                              |
| `JWT_REFRESH_SECRET`  | JWT refresh token secret     | -                                              |
| `EMAIL_USER`          | SMTP email user              | -                                              |
| `EMAIL_PASSWORD`      | SMTP app password            | -                                              |
| `ML_SERVICE_HOST`     | ML service host              | localhost                                      |
| `ML_SERVICE_PORT`     | ML service port              | 8000                                           |
| `EMAIL_SERVICE_HOST`  | Email service host           | localhost                                      |
| `EMAIL_SERVICE_PORT`  | Email service port           | 3002                                           |
| `APP_URL`             | Application base URL         | http://localhost:3000                          |
| `OPENAI_API_KEY`      | OpenAI API key for AI features| -                                              |
| `HUGGINGFACE_API_KEY` | HuggingFace API key          | -                                              |
| `THROTTLE_TTL`        | Rate limiting time window    | 60000                                          |
| `THROTTLE_LIMIT`      | Rate limiting max requests   | 10                                             |
| `UPLOAD_MAX_SIZE`     | Max file upload size (MB)    | 10                                             |

---

## 🗄️ Database Schema

### Core Entities
* **Users** — Admin, Recruiter, Candidate roles with authentication
* **Jobs** — Job postings with requirements, salary, location
* **Candidates** — Extended profiles with skills, experience, contact info
* **Applications** — Job applications with status tracking
* **ScreeningResults** — AI-generated fit scores and analysis
* **Interviews** — Scheduled interview sessions with types and notes

### Supporting Tables
* **AuditLogs** — System activity tracking for security
* **Notifications** — Email and system notifications
* **FileUploads** — Resume and document metadata
* **UserSessions** — JWT token management and refresh

### Key Features
- **Role-Based Access Control** — Different permissions for each user type
- **Audit Trail** — Complete activity logging for compliance
- **File Management** — Secure document storage and retrieval
- **Real-time Notifications** — Email and WebSocket updates
- **AI Integration** — ML-powered resume analysis and matching

---

## 🤝 Contributing

We welcome contributions!

1. Fork the repo
2. Create feature branch → `git checkout -b feature/amazing-feature`
3. Commit changes → `git commit -m 'Add amazing feature'`
4. Push branch → `git push origin feature/amazing-feature`
5. Open Pull Request

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 🆘 Support

* 📧 Email: [oseemanzi3@gmail.com](mailto:oseemanzi3@gmail.com)
* 🐛 [Create an Issue](https://github.com/manziosee/ai-hiring-backend/issues)
* 💬 Discussion Forum (coming soon)

---

## 🙏 Acknowledgments

* [NestJS](https://nestjs.com/) — Progressive Node.js framework
* [FastAPI](https://fastapi.tiangolo.com/) — Modern Python web framework
* [Prisma](https://www.prisma.io/) — Next-generation ORM
* [Sentence Transformers](https://www.sbert.net/) — Semantic similarity models
* [Fly.io](https://fly.io/) — Seamless deployment

---

<div align="center">

Developed by **Manzi Osee**
📧 [oseemanzi3@gmail.com](mailto:oseemanzi3@gmail.com)

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-square\&logo=linkedin\&logoColor=white)](https://www.linkedin.com/in/manzi-niyongira-os%C3%A9e-2065861bb/)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-square\&logo=github\&logoColor=white)](https://github.com/manziosee)


