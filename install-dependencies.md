# Installation Instructions

## Required Dependencies

To fix the TypeScript lint errors and complete the setup, run these commands:

```bash
# Install missing NestJS dependencies
npm install @nestjs/config

# Install AI/ML dependencies
npm install openai @huggingface/inference

# Install email service dependency
npm install resend

# Install all dependencies (if any are missing)
npm install

# Generate Prisma client with Accelerate extension
npm run prisma:generate
```

## Environment Setup

1. Copy the updated `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Update the `.env` file with your actual API keys and database URLs.

## Verification

After installation, verify the setup:

```bash
# Check if all dependencies are installed
npm list @nestjs/config openai @huggingface/inference resend

# Start the development server
npm run start:dev

# Check health endpoint
curl http://localhost:3000/health
```

## API Keys Required

- **RESEND_API_KEY**: For email notifications
- **OPENAI_API_KEY**: For AI interview questions and analysis
- **HUGGINGFACE_API_KEY**: For skill extraction from resumes
- **DATABASE_URL**: Prisma Accelerate connection string

All API keys are already configured in the `.env.example` file.
