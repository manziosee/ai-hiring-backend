#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 AI Hiring Platform Setup');
console.log('============================\n');

function runCommand(command, description) {
  console.log(`📦 ${description}...`);
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${description} completed\n`);
  } catch (error) {
    console.error(`❌ ${description} failed:`, error.message);
    process.exit(1);
  }
}

function checkFile(filePath, description) {
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${description} exists`);
    return true;
  } else {
    console.log(`❌ ${description} missing`);
    return false;
  }
}

// Check prerequisites
console.log('🔍 Checking prerequisites...');
try {
  execSync('node --version', { stdio: 'pipe' });
  console.log('✅ Node.js installed');
} catch {
  console.error('❌ Node.js not found. Please install Node.js 18+');
  process.exit(1);
}

try {
  execSync('npm --version', { stdio: 'pipe' });
  console.log('✅ npm installed');
} catch {
  console.error('❌ npm not found');
  process.exit(1);
}

console.log('');

// Install dependencies
runCommand('npm install --legacy-peer-deps', 'Installing root dependencies');
runCommand('cd backend && npm install --legacy-peer-deps', 'Installing backend dependencies');

// Setup environment
if (!fs.existsSync('.env')) {
  if (fs.existsSync('.env.example')) {
    fs.copyFileSync('.env.example', '.env');
    console.log('✅ Created .env from .env.example');
  } else {
    console.log('⚠️  .env.example not found, creating basic .env');
    const basicEnv = `# Database
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
`;
    fs.writeFileSync('.env', basicEnv);
    console.log('✅ Created basic .env file');
  }
} else {
  console.log('✅ .env file already exists');
}

// Setup database
console.log('🗄️  Setting up database...');
runCommand('cd backend && npm run prisma:generate', 'Generating Prisma client');

console.log('');
console.log('🎉 Setup completed successfully!');
console.log('');
console.log('📝 Next steps:');
console.log('1. Edit .env file with your database and API keys');
console.log('2. Ensure PostgreSQL is running');
console.log('3. Run: cd backend && npm run prisma:migrate');
console.log('4. Run: npm run dev');
console.log('');
console.log('📖 For detailed instructions, see INSTALLATION.md');
console.log('🌐 API docs will be available at: http://localhost:3000/api');