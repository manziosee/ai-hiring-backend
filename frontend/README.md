# AI Hiring Frontend - Fly.io Deployment

## Prerequisites
- [Fly.io CLI](https://fly.io/docs/hands-on/install-flyctl/) installed
- Fly.io account

## Quick Deploy

### Windows
```bash
deploy.bat
```

### Unix/Linux/macOS
```bash
./deploy.sh
```

## Manual Deployment

1. **Install Fly CLI** (if not installed)
   ```bash
   # Windows (PowerShell)
   iwr https://fly.io/install.ps1 -useb | iex
   
   # macOS/Linux
   curl -L https://fly.io/install.sh | sh
   ```

2. **Login to Fly.io**
   ```bash
   flyctl auth login
   ```

3. **Launch the app**
   ```bash
   flyctl launch --no-deploy
   ```

4. **Deploy**
   ```bash
   flyctl deploy
   ```

5. **Open the app**
   ```bash
   flyctl open
   ```

## Configuration

- **App Name**: `ai-hiring-frontend`
- **Region**: `iad` (US East)
- **Memory**: 256MB
- **Backend URL**: `https://ai-hiring-backend.fly.dev`

## Files Created

- `Dockerfile` - Multi-stage build with nginx
- `nginx.conf` - Web server configuration
- `fly.toml` - Fly.io app configuration
- `.dockerignore` - Docker build optimization
- `environment.prod.ts` - Production environment settings