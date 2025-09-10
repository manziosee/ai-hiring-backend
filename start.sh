#!/bin/bash

echo "========================================"
echo "   AI Hiring Platform - Quick Start"
echo "========================================"
echo

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js not found. Please install Node.js 18+ from https://nodejs.org/${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js found${NC}"
echo

# Check if .env exists
if [ ! -f ".env" ]; then
    echo -e "${BLUE}📝 Creating .env file from template...${NC}"
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo -e "${GREEN}✅ .env file created${NC}"
        echo -e "${YELLOW}⚠️  Please edit .env file with your database and API keys${NC}"
        echo
    else
        echo -e "${RED}❌ .env.example not found${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ .env file exists${NC}"
fi

# Install dependencies
echo -e "${BLUE}📦 Installing dependencies...${NC}"
npm install --legacy-peer-deps
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to install root dependencies${NC}"
    exit 1
fi

echo -e "${BLUE}📦 Installing backend dependencies...${NC}"
cd backend
npm install --legacy-peer-deps
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to install backend dependencies${NC}"
    exit 1
fi

echo -e "${BLUE}🗄️  Generating Prisma client...${NC}"
npm run prisma:generate
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to generate Prisma client${NC}"
    echo -e "${YELLOW}⚠️  Make sure your DATABASE_URL is configured in .env${NC}"
    exit 1
fi

cd ..

echo
echo -e "${GREEN}🎉 Setup completed successfully!${NC}"
echo
echo -e "${BLUE}📝 Next steps:${NC}"
echo "1. Edit .env file with your database credentials"
echo "2. Ensure PostgreSQL is running"
echo "3. Run database migrations: cd backend && npm run prisma:migrate"
echo "4. Start the application: npm run dev"
echo
echo -e "${BLUE}📖 For detailed instructions, see INSTALLATION.md${NC}"
echo -e "${BLUE}🌐 API docs will be available at: http://localhost:3000/api${NC}"
echo