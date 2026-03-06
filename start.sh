#!/bin/bash

# Habitos Docker Startup Script
# This script builds and starts the Habitos containers

set -e

echo "🌱 Starting Habitos..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Docker is not running. Please start Docker first.${NC}"
    exit 1
fi

# Check if .env exists, if not create from example
if [ ! -f .env ]; then
    echo -e "${BLUE}📝 Creating .env file from template...${NC}"
    cp .env.example .env
    echo -e "${YELLOW}⚠️  Please review .env file and update JWT_SECRET for production!${NC}"
fi

# Pull latest changes (if in git repo)
if [ -d .git ]; then
    echo -e "${BLUE}📥 Pulling latest changes...${NC}"
    git pull || echo -e "${YELLOW}Could not pull changes (not a problem if no remote)${NC}"
fi

# Build and start containers
echo -e "${BLUE}🔨 Building containers...${NC}"
docker-compose build --no-cache

echo -e "${BLUE}🚀 Starting containers...${NC}"
docker-compose up -d

# Wait for services to be healthy
echo -e "${BLUE}⏳ Waiting for services to be ready...${NC}"
sleep 10

# Check if containers are running
if docker-compose ps | grep -q "Up"; then
    echo ""
    echo -e "${GREEN}✅ Habitos is running!${NC}"
    echo ""
    echo -e "${GREEN}Frontend:${NC} http://localhost:4201"
    echo -e "${GREEN}Backend:${NC}  http://localhost:3001/api"
    echo ""
    echo -e "${BLUE}📊 View logs:${NC} docker-compose logs -f"
    echo -e "${BLUE}🛑 Stop:${NC}      docker-compose down"
else
    echo -e "${YELLOW}⚠️  Containers started but may not be healthy. Check logs:${NC}"
    echo "docker-compose logs"
fi

# Show running containers
echo ""
echo -e "${BLUE}📦 Running containers:${NC}"
docker-compose ps