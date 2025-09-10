# 🔧 Troubleshooting Guide

## Common Issues & Solutions

### 1. Dependency Installation Issues

#### Peer Dependency Conflicts
```bash
# Error: peer dep warnings or conflicts
npm ERR! peer dep missing: @nestjs/common@^10.0.0

# Solution 1: Use legacy peer deps (Recommended)
npm install --legacy-peer-deps

# Solution 2: Force installation
npm install --force

# Solution 3: Clean install
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

#### Module Not Found Errors
```bash
# Error: Cannot find module '@nestjs/...'
# Solution: Reinstall dependencies
cd backend
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### 2. Database Issues

#### Connection Refused
```bash
# Error: connect ECONNREFUSED 127.0.0.1:5432
# Solutions:
```

**Check PostgreSQL Status:**
```bash
# Windows
net start postgresql-x64-13

# macOS (Homebrew)
brew services start postgresql

# Linux (systemd)
sudo systemctl start postgresql
```

**Verify Database Exists:**
```sql
-- Connect to PostgreSQL
psql -U postgres

-- Create database
CREATE DATABASE ai_hiring_db;

-- Create user
CREATE USER ai_hiring_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE ai_hiring_db TO ai_hiring_user;
```

#### Prisma Client Issues
```bash
# Error: Prisma Client not generated
# Solution:
cd backend
npm run prisma:generate

# Error: Database schema out of sync
# Solution:
npm run prisma:migrate

# Nuclear option (WARNING: Deletes all data)
npm run prisma:reset
```

### 3. Environment Configuration

#### Missing Environment Variables
```bash
# Error: JWT_SECRET is not defined
# Solution: Check .env file exists and has required variables
```

**Required Variables:**
```env
DATABASE_URL="postgresql://..."
JWT_SECRET="your-secret-key"
OPENAI_API_KEY="sk-..."
```

**Validate .env:**
```bash
# Check if .env exists
ls -la .env

# Copy from example if missing
cp .env.example .env
```

### 4. Port Issues

#### Port Already in Use
```bash
# Error: EADDRINUSE :::3000
# Solutions:
```

**Find Process Using Port:**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000
kill -9 <PID>

# Or use different port in .env
PORT=3001
```

### 5. API Key Issues

#### OpenAI API Errors
```bash
# Error: 401 Unauthorized
# Check API key format: sk-...
# Verify account has credits
# Test with curl:
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### HuggingFace Token Issues
```bash
# Error: 401 Unauthorized
# Check token format: hf_...
# Verify token permissions
```

### 6. File Upload Issues

#### File Size Limits
```bash
# Error: File too large
# Solution: Increase limit in .env
MAX_FILE_SIZE=10485760  # 10MB
```

#### Upload Directory Permissions
```bash
# Error: EACCES permission denied
# Solution: Fix permissions
chmod 755 uploads/
mkdir -p uploads
```

### 7. Build Issues

#### TypeScript Compilation Errors
```bash
# Error: TS2307: Cannot find module
# Solution: Install types
npm install --save-dev @types/node @types/express

# Clear TypeScript cache
rm -rf dist/
npm run build
```

#### ESLint Errors
```bash
# Fix linting issues
npm run lint

# Auto-fix where possible
npm run lint -- --fix
```

### 8. Docker Issues

#### Container Build Failures
```bash
# Clear Docker cache
docker system prune -a

# Rebuild containers
docker-compose up --build

# Check logs
docker-compose logs backend
```

#### Database Connection in Docker
```bash
# Use service name instead of localhost
DATABASE_URL="postgresql://postgres:password@postgres:5432/ai_hiring_db"
```

### 9. Performance Issues

#### Slow API Responses
```bash
# Check database connections
# Monitor with:
npm run prisma:studio

# Enable query logging in Prisma
# Add to schema.prisma:
generator client {
  provider = "prisma-client-js"
  log      = ["query", "info", "warn", "error"]
}
```

#### Memory Issues
```bash
# Increase Node.js memory limit
node --max-old-space-size=4096 dist/main.js

# Or in package.json:
"start:prod": "node --max-old-space-size=4096 dist/main.js"
```

### 10. Testing Issues

#### Test Database Setup
```bash
# Use separate test database
DATABASE_URL="postgresql://postgres:password@localhost:5432/ai_hiring_test"

# Run tests
npm run test:e2e
```

## Diagnostic Commands

### Health Checks
```bash
# Check API health
curl http://localhost:3000/health

# Check database connection
cd backend && npm run prisma:studio

# Check all services
npm run health
```

### Log Analysis
```bash
# View application logs
tail -f logs/app.log

# Docker logs
docker-compose logs -f backend

# System logs (Linux)
journalctl -u postgresql -f
```

### Network Debugging
```bash
# Test API endpoints
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Check open ports
netstat -tulpn | grep :3000
```

## Getting Help

### Before Asking for Help
1. ✅ Check this troubleshooting guide
2. ✅ Review error messages carefully
3. ✅ Check logs for detailed errors
4. ✅ Verify environment configuration
5. ✅ Try clean installation

### Where to Get Help
- 📖 **Documentation**: [INSTALLATION.md](INSTALLATION.md)
- 🐛 **Issues**: [GitHub Issues](https://github.com/manziosee/ai-hiring-backend/issues)
- 📧 **Email**: [oseemanzi3@gmail.com](mailto:oseemanzi3@gmail.com)
- 🌐 **API Docs**: [http://localhost:3000/api](http://localhost:3000/api)

### When Reporting Issues
Include the following information:
- Operating system and version
- Node.js and npm versions
- Complete error message
- Steps to reproduce
- Environment configuration (without sensitive data)
- Relevant log files

## Quick Fixes

### Reset Everything
```bash
# Nuclear option - complete reset
npm run clean
rm -rf uploads/ logs/
cp .env.example .env
npm run setup
```

### Verify Installation
```bash
# Check versions
node --version    # Should be 18+
npm --version     # Should be 9+
psql --version    # Should be 13+

# Check services
curl http://localhost:3000/health
```

### Common Commands
```bash
# Fresh start
npm run fresh:install
npm run dev

# Database reset
cd backend
npm run prisma:reset
npm run prisma:migrate

# Clean build
npm run clean
npm run build
```