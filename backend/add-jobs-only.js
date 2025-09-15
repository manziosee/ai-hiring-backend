const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

async function addJobsAndData() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🚀 Adding jobs and demo data...');
    
    // Find or create recruiter
    let recruiter = await prisma.user.findUnique({
      where: { email: 'recruiter@aihiring.com' }
    });
    
    if (!recruiter) {
      const recruiterPassword = 'Recruiter@123';
      const hashedRecruiterPassword = await bcrypt.hash(recruiterPassword, 12);
      
      recruiter = await prisma.user.create({
        data: {
          email: 'recruiter@aihiring.com',
          password: hashedRecruiterPassword,
          fullName: 'John Recruiter',
          role: 'RECRUITER',
          emailVerified: true,
          verificationToken: null
        }
      });
      console.log('✅ Recruiter created:', recruiter.email);
    } else {
      console.log('✅ Recruiter found:', recruiter.email);
    }
    
    // Create jobs
    const jobs = [
      {
        title: 'Senior Software Engineer',
        description: 'We are looking for a Senior Software Engineer to join our dynamic team.',
        skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'AWS'],
        experience: 5,
        createdBy: recruiter.id
      },
      {
        title: 'Frontend Developer',
        description: 'Join our frontend team to build amazing user experiences.',
        skills: ['React', 'Vue.js', 'CSS', 'HTML', 'JavaScript'],
        experience: 3,
        createdBy: recruiter.id
      },
      {
        title: 'DevOps Engineer',
        description: 'We need a DevOps Engineer to help us scale our infrastructure.',
        skills: ['Docker', 'Kubernetes', 'AWS', 'Jenkins', 'Terraform'],
        experience: 4,
        createdBy: recruiter.id
      }
    ];
    
    for (const jobData of jobs) {
      try {
        const job = await prisma.job.create({
          data: jobData
        });
        console.log(`✅ Created job: ${job.title}`);
      } catch (error) {
        if (error.code === 'P2002') {
          console.log(`⚠️ Job "${jobData.title}" already exists`);
        } else {
          console.error(`❌ Error creating job "${jobData.title}":`, error.message);
        }
      }
    }
    
    // Find or create candidate
    let candidate = await prisma.user.findUnique({
      where: { email: 'candidate@aihiring.com' }
    });
    
    if (!candidate) {
      const candidatePassword = 'Candidate@123';
      const hashedCandidatePassword = await bcrypt.hash(candidatePassword, 12);
      
      candidate = await prisma.user.create({
        data: {
          email: 'candidate@aihiring.com',
          password: hashedCandidatePassword,
          fullName: 'Jane Candidate',
          role: 'CANDIDATE',
          emailVerified: true,
          verificationToken: null
        }
      });
      console.log('✅ Candidate created:', candidate.email);
      
      // Create candidate profile
      const candidateProfile = await prisma.candidate.create({
        data: {
          name: candidate.fullName,
          email: candidate.email,
          phone: '+1-555-0123',
          location: 'San Francisco, CA',
          skills: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL'],
          yearsExp: 3,
          userId: candidate.id
        }
      });
      console.log('✅ Candidate profile created');
    } else {
      console.log('✅ Candidate found:', candidate.email);
    }
    
    console.log('\n🎉 Demo data setup complete!');
    console.log('\n📋 Account Summary:');
    console.log('👑 Admin: admin@aihiring.com / Admin@123');
    console.log('👥 Recruiter: recruiter@aihiring.com / Recruiter@123');
    console.log('👨💻 Candidate: candidate@aihiring.com / Candidate@123');
    
  } catch (error) {
    console.error('❌ Error setting up demo data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addJobsAndData();