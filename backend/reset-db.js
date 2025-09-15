const { PrismaClient } = require('@prisma/client');

async function resetDatabase() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🗑️ Deleting all data from database...');
    
    // Delete in correct order to avoid foreign key constraints
    await prisma.application.deleteMany({});
    console.log('✅ Deleted all applications');
    
    await prisma.job.deleteMany({});
    console.log('✅ Deleted all jobs');
    
    await prisma.user.deleteMany({});
    console.log('✅ Deleted all users');
    
    console.log('🎉 Database reset complete! All data has been deleted.');
    
  } catch (error) {
    console.error('❌ Error resetting database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetDatabase();