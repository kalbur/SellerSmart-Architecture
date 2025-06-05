#!/bin/bash

# SellerSmart Kill Port 3000 Script
# Kills any process running on localhost:3000

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  SellerSmart Port 3000 Killer${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo ""

# Find process using port 3000
echo -e "${YELLOW}Checking for processes on port 3000...${NC}"

# Use lsof to find process on port 3000
PID=$(lsof -ti :3000)

if [ -z "$PID" ]; then
    echo -e "${GREEN}✓ No process found running on port 3000${NC}"
    echo -e "${BLUE}Port 3000 is free to use!${NC}"
else
    echo -e "${RED}Found process(es) on port 3000:${NC}"
    
    # Show details about the process(es)
    lsof -i :3000
    
    echo ""
    echo -e "${YELLOW}Killing process(es) with PID(s): $PID${NC}"
    
    # Kill the process(es)
    kill -9 $PID
    
    # Check if kill was successful
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Successfully killed process(es) on port 3000${NC}"
        
        # Double-check that port is now free
        sleep 1
        CHECK_PID=$(lsof -ti :3000)
        if [ -z "$CHECK_PID" ]; then
            echo -e "${GREEN}✓ Port 3000 is now free!${NC}"
        else
            echo -e "${RED}⚠ Warning: Port 3000 still has active processes${NC}"
            echo -e "${YELLOW}You may need to run this script again${NC}"
        fi
    else
        echo -e "${RED}✗ Failed to kill process(es)${NC}"
        echo -e "${YELLOW}You may need to run with sudo or check permissions${NC}"
    fi
fi

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
