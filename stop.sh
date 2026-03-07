#!/bin/bash

# Habitos Docker Stop Script

set -e

echo "🛑 Stopping Habitos..."

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

# Stop containers
docker compose down

echo ""
echo -e "${GREEN}✅ Habitos stopped successfully${NC}"
echo ""
echo -e "To start again: ${GREEN}./start.sh${NC}"
echo -e "To remove volumes: ${RED}docker compose down -v${NC}"