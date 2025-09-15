const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

async function setupDemoData() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🚀 Setting up demo data...');
    
    // 1. Create a verified recruiter account
    console.log('👤 Creating recruiter account...');
    const recruiterPassword = 'Recruiter@123';
    const hashedRecruiterPassword = await bcrypt.hash(recruiterPassword, 12);
    
    const recruiter = await prisma.user.create({
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
    
    // 2. Create sample jobs
    console.log('💼 Creating sample jobs...');
    
    const jobs = [
      {
        title: 'Senior Software Engineer',
        description: 'We are looking for a Senior Software Engineer to join our dynamic team. You will be responsible for designing, developing, and maintaining high-quality software solutions.',
        skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'AWS'],
        experience: 5,
        createdBy: recruiter.id
      },
      {
        title: 'Frontend Developer',
        description: 'Join our frontend team to build amazing user experiences. You will work with modern frameworks and collaborate with designers and backend developers.',
        skills: ['React', 'Vue.js', 'CSS', 'HTML', 'JavaScript'],
        experience: 3,
        createdBy: recruiter.id
      },
      {
        title: 'DevOps Engineer',
        description: 'We need a DevOps Engineer to help us scale our infrastructure. You will work with cloud platforms, CI/CD pipelines, and monitoring systems.',
        skills: ['Docker', 'Kubernetes', 'AWS', 'Jenkins', 'Terraform'],
        experience: 4,
        createdBy: recruiter.id
      },
      {
        title: 'Data Scientist',
        description: 'Looking for a Data Scientist to analyze complex datasets and build machine learning models. You will work with large datasets and create insights.',
        skills: ['Python', 'Machine Learning', 'SQL', 'TensorFlow', 'Pandas'],
        experience: 3,
        createdBy: recruiter.id
      },
      {
        title: 'Product Manager',
        description: 'We are seeking a Product Manager to lead product development and strategy. You will work with cross-functional teams to deliver great products.',
        skills: ['Product Strategy', 'Agile', 'Analytics', 'User Research', 'Roadmapping'],
        experience: 5,
        createdBy: recruiter.id
      }
    ];
    
    for (const jobData of jobs) {
      const job = await prisma.job.create({
        data: jobData
      });
      console.log(`✅ Created job: ${job.title}`);
    }
    
    // 3. Create a candidate account
    console.log('👨‍💻 Creating candidate account...');
    const candidatePassword = 'Candidate@123';
    const hashedCandidatePassword = await bcrypt.hash(candidatePassword, 12);
    
    const candidate = await prisma.user.create({
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
    
    // 4. Create candidate profile
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
    
    // 5. Create some applications
    console.log('📄 Creating sample applications...');
    const allJobs = await prisma.job.findMany();
    
    // Apply to first 2 jobs
    for (let i = 0; i < Math.min(2, allJobs.length); i++) {
      const application = await prisma.application.create({
        data: {
          jobId: allJobs[i].id,
          candidateId: candidateProfile.id,
          userId: candidate.id,
          coverLetter: `I am very interested in the ${allJobs[i].title} position. My experience with ${allJobs[i].skills.slice(0, 2).join(' and ')} makes me a great fit for this role.`,
          status: i === 0 ? 'SCREENING' : 'SUBMITTED'
        }
      });
      console.log(`✅ Created application for: ${allJobs[i].title}`);
    }
    
    console.log('\n🎉 Demo data setup complete!');
    console.log('\n📋 Account Summary:');
    console.log('👑 Admin: admin@aihiring.com / Admin@123');
    console.log('👥 Recruiter: recruiter@aihiring.com / Recruiter@123');
    console.log('👨‍💻 Candidate: candidate@aihiring.com / Candidate@123');
    console.log(`\n💼 Created ${jobs.length} jobs`);
    console.log('📄 Created 2 applications');
    
  } catch (error) {
    if (error.code === 'P2002') {
      console.log('⚠️ Some data already exists, skipping duplicates');
    } else {
      console.error('❌ Error setting up demo data:', error);
    }
  } finally {
    await prisma.$disconnect();
  }
}

setupDemoData();