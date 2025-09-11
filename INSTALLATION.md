# 🚀 Installation & Setup Guide

## Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **PostgreSQL** 13+ ([Download](https://www.postgresql.org/download/))
- **Git** ([Download](https://git-scm.com/downloads))
- **Docker** (Optional - [Download](https://www.docker.com/get-started))

## Quick Setup

### 1. Clone Repository
```bash
git clone https://github.com/manziosee/ai-hiring-backend.git
cd ai-hiring-backend
```

### 2. Install Dependencies
```bash
# Install root dependencies with legacy peer deps
npm install --legacy-peer-deps

# Install backend dependencies
cd backend
npm install --legacy-peer-deps
cd ..
```

### 3. Environment Setup
```bash
# Copy environment file
cp .env.example .env

# Edit .env with your settings
# Required: DATABASE_URL, JWT_SECRET, OPENAI_API_KEY
```

### 4. Database Setup
```bash
cd backend

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# (Optional) Seed database
npm run prisma:studio
```

### 5. Start Development
```bash
# From root directory
npm run dev

# Or start backend only
cd backend && npm run start:dev
```

## Detailed Setup

### Database Configuration

#### PostgreSQL Setup
1. Install PostgreSQL
2. Create database:
```sql
CREATE DATABASE ai_hiring_db;
CREATE USER ai_hiring_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE ai_hiring_db TO ai_hiring_user;
```

3. Update `.env`:
```env
DATABASE_URL="postgresql://ai_hiring_user:your_password@localhost:5432/ai_hiring_db"
```

### API Keys Setup

#### OpenAI API Key
1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create new API key
3. Add to `.env`:
```env
OPENAI_API_KEY="sk-your-openai-api-key"
```

#### HuggingFace Token (Optional)
1. Visit [HuggingFace Tokens](https://huggingface.co/settings/tokens)
2. Create new token
3. Add to `.env`:
```env
HUGGINGFACE_API_KEY="hf_your-token"
```

## Troubleshooting

### Common Issues

#### 1. Peer Dependency Conflicts
```bash
# Solution 1: Use legacy peer deps
npm install --legacy-peer-deps

# Solution 2: Force install
npm install --force

# Solution 3: Clean install
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

#### 2. Prisma Client Issues
```bash
cd backend

# Regenerate Prisma client
npm run prisma:generate

# Reset database (WARNING: Deletes all data)
npm run prisma:reset

# Apply migrations
npm run prisma:migrate
```

#### 3. Port Already in Use
```bash
# Check what's using port 3000
netstat -ano | findstr :3000

# Kill process (Windows)
taskkill /PID <PID> /F

# Or change port in .env
PORT=3001
```

#### 4. Database Connection Issues
- Verify PostgreSQL is running
- Check DATABASE_URL format
- Ensure database exists
- Verify user permissions

#### 5. Module Not Found Errors
```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### Development Scripts

```bash
# Backend development
cd backend
npm run start:dev          # Start with hot reload
npm run start:debug        # Start with debugger
npm run prisma:studio      # Open Prisma Studio

# Testing
npm test                   # Unit tests
npm run test:e2e          # End-to-end tests
npm run test:cov          # Coverage report

# Database
npm run prisma:migrate     # Apply migrations
npm run prisma:generate    # Generate client
npm run prisma:reset       # Reset database

# Linting & Formatting
npm run lint              # ESLint
npm run format            # Prettier
```

### Docker Setup (Alternative)

```bash
# Start with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild containers
docker-compose up --build
```

### Production Deployment

#### Environment Variables
```env
NODE_ENV=production
DATABASE_URL="your-production-db-url"
JWT_SECRET="your-production-jwt-secret"
OPENAI_API_KEY="your-openai-key"
```

#### Build & Start
```bash
# Build application
npm run build

# Start production server
npm run start:prod
```

## Verification

### Health Check
```bash
# Check API health
curl http://localhost:3000/health

# Check Swagger docs
open http://localhost:3000/api
```

### Test Endpoints
```bash
# Register user
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","role":"CANDIDATE"}'

# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## Support

- 📧 **Email**: [oseemanzi3@gmail.com](mailto:oseemanzi3@gmail.com)
- 🐛 **Issues**: [GitHub Issues](https://github.com/manziosee/ai-hiring-backend/issues)
- 📖 **Documentation**: [API Docs](http://localhost:3000/api)

## Next Steps

1. ✅ Complete installation
2. 🔧 Configure environment variables
3. 🗄️ Set up database
4. 🚀 Start development server
5. 📖 Read [API Documentation](http://localhost:3000/api)
6. 🧪 Run tests
7. 🚀 Deploy to production