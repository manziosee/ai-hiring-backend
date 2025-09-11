# 🤖 AI Hiring Platform

<div align="center">

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Fly.io](https://img.shields.io/badge/Fly.io-8B5CF6?style=for-the-badge&logo=fly.io&logoColor=white)

**Full-stack AI-powered recruitment platform with intelligent candidate screening and automated interview scheduling.**

[![CI/CD Pipeline](https://github.com/manziosee/ai-hiring-backend/actions/workflows/ci.yml/badge.svg)](https://github.com/manziosee/ai-hiring-backend/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/manziosee/ai-hiring-backend/pulls)

### 🌐 **Live Demo**

[![Frontend](https://img.shields.io/badge/Frontend-Live-success?style=for-the-badge)](https://ai-hiring-frontend.fly.dev/)
[![Backend API](https://img.shields.io/badge/Backend%20API-Live-success?style=for-the-badge)](https://ai-hiring-backend.fly.dev/)
[![Swagger Docs](https://img.shields.io/badge/API%20Docs-Live-blue?style=for-the-badge)](https://ai-hiring-backend.fly.dev/api)

**🔗 Quick Access:**
- **Frontend App**: [ai-hiring-frontend.fly.dev](https://ai-hiring-frontend.fly.dev/)
- **Backend API**: [ai-hiring-backend.fly.dev](https://ai-hiring-backend.fly.dev/)
- **API Documentation**: [ai-hiring-backend.fly.dev/api](https://ai-hiring-backend.fly.dev/api)

</div>

---

## 🚀 Features
- **🤖 AI-Powered Screening** — ML/NLP resume analysis & job matching  
- **👥 Role-Based Access** — Admin, Recruiter & Candidate roles  
- **📄 Resume Processing** — PDF/DOCX parsing & skill extraction  
- **💼 Job Management** — Full job posting & application system  
- **📊 Real-Time Analytics** — Candidate fit scores & screening results  
- **🔔 Notifications** — Email + WebSocket real-time updates  
- **📱 Modern Frontend** — Angular 17 with TypeScript & Material Design
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
│   Frontend      │   │   Backend API   │   │   ML Service    │
│   (Angular)     │◄──►│   (NestJS)     │◄──►│   (FastAPI)    │
│                 │   │                 │   │                 │
│ - Dashboard     │   │ - Auth          │   │ - Resume Parse  │
│ - Job Search    │   │ - Jobs          │   │ - Skill Extract │
│ - Applications  │   │ - Applications  │   │ - AI Matching   │
│ - File Upload   │   │ - Screening     │   │ - Embeddings    │
└─────────────────┘   └─────────────────┘   └─────────────────┘
                      ▲                     ▲
                      │                     │
                      ▼                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    PostgreSQL Database                      │
│                                                             │
│ Users | Jobs | Candidates | Applications | Screening Results │
└─────────────────────────────────────────────────────────────┘
```

---

## 📦 Project Structure

```
ai-hiring-platform/
├── backend/                 # NestJS API server
│   ├── src/                # Source code
│   ├── prisma/             # Database schema & migrations
│   ├── microservices/      # ML & Email services
│   └── package.json
├── frontend/               # Angular web application
│   ├── src/                # Angular components & pages
│   ├── public/             # Static assets
│   └── package.json
├── shared/                 # Shared TypeScript types
│   └── src/types/          # Common interfaces
├── docker-compose.yml      # Multi-service deployment
├── .github/workflows/      # CI/CD pipelines
└── package.json           # Workspace configuration
```

---

## 🚀 Quick Start

### ✅ Prerequisites
- **Node.js 18+** ([Download](https://nodejs.org/))
- **PostgreSQL 13+** ([Download](https://www.postgresql.org/download/))
- **Git** ([Download](https://git-scm.com/downloads))
- **Docker** (optional - [Download](https://www.docker.com/get-started))

### ⚡ Automated Setup

```bash
# Clone the repository
git clone https://github.com/manziosee/ai-hiring-backend.git
cd ai-hiring-backend

# Quick setup (Windows)
start.bat

# Quick setup (Unix/Linux/macOS)
./start.sh

# Or use npm script
npm run setup
```

### 💻 Manual Setup

```bash
# Install dependencies (use legacy peer deps for compatibility)
npm install --legacy-peer-deps

# Setup environment
cp .env.example .env
# Edit .env with your database and API settings

# Setup backend
cd backend
npm install --legacy-peer-deps
npm run prisma:generate
npm run prisma:migrate
cd ..

# Start all services
npm run dev
```

**Local Development URLs:**
- Frontend: `http://localhost:3001`
- Backend API: `http://localhost:3000`
- Swagger Docs: `http://localhost:3000/api`
- ML Service: `http://localhost:8000`

**Production URLs:**
- Frontend: [https://ai-hiring-frontend.fly.dev](https://ai-hiring-frontend.fly.dev)
- Backend API: [https://ai-hiring-backend.fly.dev](https://ai-hiring-backend.fly.dev)
- API Documentation: [https://ai-hiring-backend.fly.dev/api](https://ai-hiring-backend.fly.dev/api)

### 🐳 Docker Development

```bash
# Start all services with Docker
npm run docker:up

# View logs
npm run docker:logs

# Stop services
npm run docker:down
```

### 🔧 Troubleshooting

#### Dependency Issues
If you encounter peer dependency conflicts:

```bash
# Option 1: Use legacy peer deps (Recommended)
npm install --legacy-peer-deps

# Option 2: Force resolution (Alternative)
npm install --force

# Option 3: Clean install
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

#### Backend Setup Issues
```bash
# Go to backend directory
cd backend

# Clean install with legacy peer deps
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps

# Generate Prisma client
npm run prisma:generate

# Start backend
npm run start:dev
```

#### Database Issues
```bash
# Reset database
cd backend
npm run prisma:reset

# Apply migrations
npm run prisma:migrate

# Generate client
npm run prisma:generate
```

📖 **For detailed setup instructions, see [INSTALLATION.md](INSTALLATION.md)**

---

## 🔧 Development Commands

```bash
# Development
npm run dev                 # Start all services
npm run dev:backend        # Backend only
npm run dev:frontend       # Frontend only

# Building
npm run build              # Build all packages
npm run build:backend      # Backend only
npm run build:frontend     # Frontend only

# Testing
npm run test               # Test all packages
npm run test:backend       # Backend tests
npm run test:frontend      # Frontend tests

# Linting
npm run lint               # Lint all packages
npm run lint:backend       # Backend linting
npm run lint:frontend      # Frontend linting

# Setup & Maintenance
npm run setup              # Complete setup
npm run clean              # Clean dependencies
npm run fresh:install      # Clean install
npm run health             # Check API health
```

---

## 📚 API Documentation

### 🌐 Live API Documentation
* **Production Swagger**: [https://ai-hiring-backend.fly.dev/api](https://ai-hiring-backend.fly.dev/api)
* **Production OpenAPI**: [https://ai-hiring-backend.fly.dev/api-json](https://ai-hiring-backend.fly.dev/api-json)

### 💻 Local Development
* **Local Swagger**: [http://localhost:3000/api](http://localhost:3000/api)
* **Local OpenAPI**: [http://localhost:3000/api-json](http://localhost:3000/api-json)

### 🔑 Key API Endpoints

| Category | Endpoint | Method | Description | Auth |
|----------|----------|--------|-------------|------|
| **Auth** | `/auth/login` | POST | User login | ❌ |
| **Auth** | `/auth/register` | POST | User registration | ❌ |
| **Jobs** | `/jobs` | GET | List all jobs | ❌ |
| **Jobs** | `/jobs` | POST | Create job | ✅ Recruiter |
| **Applications** | `/applications` | POST | Apply for job | ✅ Candidate |
| **Screening** | `/screening/run/{id}` | POST | Run AI screening | ✅ Recruiter |
| **Dashboard** | `/dashboard/{role}` | GET | Role-based dashboard | ✅ |

---

## 🎨 Frontend Features

### 🌐 **Live Demo Access**
Experience the platform live at [ai-hiring-frontend.fly.dev](https://ai-hiring-frontend.fly.dev)

### **Role-Based Interfaces**
- **Admin Dashboard**: User management, system analytics, platform overview
- **Recruiter Portal**: Job posting, candidate screening, interview scheduling  
- **Candidate Portal**: Job search, application tracking, profile management

### **Modern UI/UX Design**
- 🌈 **Glassmorphism Design** — Modern glass-like effects and animations
- 🎨 **Custom Branding** — Professional logo and consistent visual identity
- 📱 **Responsive Layout** — Optimized for desktop, tablet, and mobile
- ✨ **Smooth Animations** — Engaging transitions and micro-interactions

### **Key Components**
- 🔐 Authentication & authorization with demo accounts
- 📋 Job listing & advanced search with filters
- 📄 Resume upload & management (PDF/DOCX support)
- 📊 Real-time dashboard analytics with charts
- 💬 Application status tracking with notifications
- 📅 Interview scheduling interface
- 🔔 Real-time notifications and updates

---

## 🧪 Testing

```bash
# Backend testing
cd backend
npm test                   # Unit tests
npm run test:e2e          # End-to-end tests
npm run test:cov          # Coverage report

# Frontend testing
cd frontend
npm test                   # Component tests
npm run test:e2e          # E2E with Cypress

# Integration testing
node backend/test-integrations.js
```

---

## 🚀 Deployment

### 🌐 **Live Production (Fly.io)**
The application is currently deployed and running on Fly.io:

- **Frontend**: [https://ai-hiring-frontend.fly.dev](https://ai-hiring-frontend.fly.dev)
- **Backend**: [https://ai-hiring-backend.fly.dev](https://ai-hiring-backend.fly.dev)
- **Database**: PostgreSQL on Fly.io
- **Status**: 🟢 Live and operational

### 🛠️ **Deploy Your Own Instance**

#### **Fly.io Deployment**
```bash
# Backend deployment
cd backend
flyctl launch --no-deploy
flyctl secrets set RESEND_API_KEY="your-resend-key"
flyctl deploy

# Frontend deployment
cd frontend
flyctl launch --no-deploy
flyctl deploy
```

#### **Docker Compose**
```bash
docker-compose up -d       # Local production deployment
```

#### **Kubernetes**
```bash
kubectl apply -f kubernetes/
```

---

## 🔧 Environment Variables

### Backend (.env)
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/ai_hiring_db"
DIRECT_URL="postgresql://username:password@localhost:5432/ai_hiring_db"

# Authentication
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_EXPIRES_IN="7d"

# AI Services
OPENAI_API_KEY="sk-your-openai-api-key"
HUGGINGFACE_API_KEY="hf_your-huggingface-token"

# Email Configuration
EMAIL_USER="your-email@gmail.com"
EMAIL_PASSWORD="your-app-password"
RESEND_API_KEY="re_your-resend-api-key"

# Application
PORT=3000
NODE_ENV="development"

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_DEST="./uploads"
```

### Frontend Environment Configuration

#### Development (src/environments/environment.ts)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
  appName: 'AI Hiring Platform'
};
```

#### Production (src/environments/environment.prod.ts)
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://ai-hiring-backend.fly.dev',
  appName: 'AI Hiring Platform'
};
```

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 🆘 Support

* 📧 Email: [oseemanzi3@gmail.com](mailto:oseemanzi3@gmail.com)
* 🐛 [Create an Issue](https://github.com/manziosee/ai-hiring-backend/issues)

---

<div align="center">

**Developed by Manzi Osee**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/manzi-niyongira-os%C3%A9e-2065861bb/)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/manziosee)

</div>