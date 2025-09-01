#!/usr/bin/env node

const { runAllTests } = require('./test-api-endpoints');

console.log('🚀 AI Hiring Backend API Test Runner');
console.log('=====================================\n');

console.log('📋 Prerequisites:');
console.log('1. Make sure the backend server is running on http://localhost:3000');
console.log('2. Ensure database is set up and migrated');
console.log('3. Environment variables are configured (.env file)');
console.log('\nStarting tests in 3 seconds...\n');

setTimeout(() => {
  runAllTests();
}, 3000);
