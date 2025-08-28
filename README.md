# 🤖 AI Hiring Platform Backend

<div align="center">

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Kubernetes](https://img.shields.io/badge/Kubernetes-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white)

**An intelligent recruitment platform with AI-powered candidate screening and automated interview scheduling.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/manziosee/ai-hiring-backend/pulls)
[![CI/CD](https://github.com/manziosee/ai-hiring-backend/workflows/CI/badge.svg)](https://github.com/manziosee/ai-hiring-backend/actions)

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

### 🔑 Key Endpoints

| Method | Endpoint              | Description       | Auth        |
| ------ | --------------------- | ----------------- | ----------- |
| POST   | `/auth/register`      | User registration | ❌           |
| POST   | `/auth/login`         | User login        | ❌           |
| GET    | `/users/me`           | Get current user  | ✅           |
| GET    | `/jobs`               | List all jobs     | ❌           |
| POST   | `/jobs`               | Create job        | ✅ Recruiter |
| POST   | `/applications`       | Apply for job     | ✅ Candidate |
| POST   | `/screening/run/{id}` | Run AI screening  | ✅ Recruiter |
| GET    | `/interviews/{id}`    | Get interviews    | ✅           |

---

## 🔧 Configuration

### Environment Variables

| Variable          | Description                  | Default                                        |
| ----------------- | ---------------------------- | ---------------------------------------------- |
| `DATABASE_URL`    | PostgreSQL connection string | -                                              |
| `JWT_SECRET`      | JWT signing secret           | -                                              |
| `EMAIL_USER`      | SMTP email user              | -                                              |
| `EMAIL_PASSWORD`  | SMTP app password            | -                                              |
| `ML_SERVICE_HOST` | ML service host              | localhost                                      |
| `ML_SERVICE_PORT` | ML service port              | 8000                                           |
| `APP_URL`         | Application base URL         | [http://localhost:3000](http://localhost:3000) |

---

## 🗄️ Database Schema

* **Users** — Admin, Recruiter, Candidate roles
* **Jobs** — Job postings with requirements
* **Candidates** — Profiles with resumes & skills
* **Applications** — Candidate job applications
* **ScreeningResults** — AI fit scores & analysis
* **Interviews** — Scheduled interview sessions

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


