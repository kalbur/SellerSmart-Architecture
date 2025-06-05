#!/bin/bash

# SellerSmart Web Dev Server Script
# Starts the development server for SellerSmart-Web

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

WEB_DIR="/Users/kal/GitHub/SellerSmart-Web"

echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  SellerSmart Web Development Server${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo ""

# Check if directory exists
if [ ! -d "$WEB_DIR" ]; then
    echo -e "${RED}Error: SellerSmart-Web directory not found${NC}"
    echo -e "${RED}Expected location: $WEB_DIR${NC}"
    exit 1
fi

# Check if port 3001 is already in use (typical Next.js port)
PORT_CHECK=$(lsof -ti :3001)
if [ ! -z "$PORT_CHECK" ]; then
    echo -e "${YELLOW}⚠ Port 3001 is already in use${NC}"
    echo -e "${YELLOW}The dev server may already be running or another service is using it${NC}"
    echo ""
fi

# Navigate to the web directory
cd "$WEB_DIR"

echo -e "${CYAN}Directory: $WEB_DIR${NC}"
echo -e "${YELLOW}Starting development server...${NC}"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}node_modules not found. Running npm install first...${NC}"
    npm install
    echo ""
fi

# Start the development server
echo -e "${GREEN}Running: npm run dev${NC}"
echo -e "${CYAN}The server will start on http://localhost:3001${NC}"
echo -e "${YELLOW}Press Ctrl+C to stop the server${NC}"
echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo ""

# Run the dev server
npm run dev
