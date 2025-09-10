#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up AI Hiring Backend for development...\n');

// Check if .env exists
if (!fs.existsSync('.env')) {
  console.log('❌ .env file not found. Please copy .env.example to .env and configure it.');
  process.exit(1);
}

try {
  // Generate Prisma client
  console.log('📦 Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });

  // Run database migrations
  console.log('🗄️  Running database migrations...');
  execSync('npx prisma db push', { stdio: 'inherit' });

  console.log('\n✅ Setup complete! You can now run:');
  console.log('   npm run start:dev');
  console.log('\n📚 API Documentation will be available at:');
  console.log('   http://localhost:3000/api');

} catch (error) {
  console.error('\n❌ Setup failed:', error.message);
  console.log('\n💡 Make sure PostgreSQL is running and accessible with the DATABASE_URL in .env');
  process.exit(1);
}