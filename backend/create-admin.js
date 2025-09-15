const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

async function createAdmin() {
  const prisma = new PrismaClient();
  
  try {
    console.log('👤 Creating admin account...');
    
    const adminEmail = 'admin@aihiring.com';
    const adminPassword = 'Admin@123';
    const hashedPassword = await bcrypt.hash(adminPassword, 12);
    
    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        fullName: 'Admin User',
        role: 'ADMIN',
        emailVerified: true,
        verificationToken: null
      }
    });
    
    console.log('✅ Admin account created successfully!');
    console.log('📧 Email:', adminEmail);
    console.log('🔑 Password:', adminPassword);
    console.log('👑 Role: ADMIN');
    console.log('✅ Email Verified: true');
    
  } catch (error) {
    if (error.code === 'P2002') {
      console.log('⚠️ Admin account already exists');
    } else {
      console.error('❌ Error creating admin:', error);
    }
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();