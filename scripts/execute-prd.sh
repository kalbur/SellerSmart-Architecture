#!/bin/bash

# SellerSmart PRD Execution Script
# This script implements a PRD from the .prds/processing directory

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if PRD_ID is provided
if [ -z "$1" ]; then
    echo -e "${RED}No PRD_ID provided - launching multi-PRD mode${NC}"
    echo ""
    # Execute the multi-PRD script
    exec "$0-multi"
    exit 0
fi

PRD_ID="$1"

# Check if we're in the correct directory
if [[ ! -f "CLAUDE.md" ]]; then
    echo -e "${RED}Error: This script must be run from the SellerSmart-Architecture directory${NC}"
    echo "Please cd to /Users/kal/GitHub/SellerSmart-Architecture and try again"
    exit 1
fi

# Check if PRD file exists
if [[ ! -f ".prds/processing/$PRD_ID.md" ]]; then
    echo -e "${RED}Error: PRD file not found: .prds/processing/$PRD_ID.md${NC}"
    echo ""
    echo "Available PRDs in processing:"
    ls -1 .prds/processing/*.md 2>/dev/null | sed 's|.prds/processing/||' | sed 's|.md||' || echo "  No PRDs found"
    exit 1
fi

echo -e "${GREEN}Starting SellerSmart PRD Execution${NC}"
echo -e "${BLUE}PRD ID: $PRD_ID${NC}"
echo -e "${YELLOW}Architecture directory: $(pwd)${NC}"
echo ""

# Check if claude CLI is installed
if ! command -v claude &> /dev/null; then
    echo -e "${RED}Error: claude CLI is not installed${NC}"
    echo "Please install it first: https://claude.ai/cli"
    exit 1
fi

# Create the prompt
PROMPT="# CLAUDE CODE EXECUTION PHASE

## CURRENT LOCATION
You are in: /Users/kal/GitHub/SellerSmart-Architecture

## SERVICE REPOSITORIES
All services are located at: /Users/kal/GitHub/
- SellerSmart-API
- SellerSmart-Web
- SellerSmart-Backend.BrandScan
- SellerSmart-Backend.InvOrders
- SellerSmart-Backend.RivalRadar
- SellerSmart-Backend.WholesaleScan
- SellerSmart-SiteMonitor

## REQUIREMENTS  
- Implement according to specific PRD: $PRD_ID
- Read CLAUDE.md for project context (in current directory)
- Check off PRD items as completed
- NO new features without updating PRD
- Follow codebase analysis and examples from PRD
- ENSURE COMPLETE IMPLEMENTATION - nothing left unfinished

## SETUP
1. Find and read PRD file:
   \`\`\`
   list_directory(\".prds/processing\")
   read_file(\".prds/processing/$PRD_ID.md\")
   \`\`\`
2. Update PRD status: PLANNING_COMPLETE → IN_PROGRESS
3. Review codebase analysis section for implementation guidance
4. Identify which service repositories need changes

## IMPLEMENTATION WORKFLOW
1. **Review PRD thoroughly**
   - Read codebase analysis section
   - Note which services are affected
   - Review code examples to follow

2. **Navigate to affected services**
   - Use \`cd /Users/kal/GitHub/SellerSmart-{service}\` for each service
   - Create feature branch if on main/master

3. **Create comprehensive tests first**
   - Follow test patterns identified in PRD
   - Write tests before implementation

4. **Implement following PRD checklist**
   - Use code examples and patterns from PRD
   - Maintain consistency with existing code
   - Mark items complete: - [ ] → - [x]

5. **Verify implementation**
   - ALL checklist items must be marked [x]
   - No TODO, FIXME, or incomplete code
   - All tests pass
   - Verify against success criteria

## CROSS-SERVICE CONSIDERATIONS
- If PRD affects multiple services, implement in order:
  1. Backend services first (API, microservices)
  2. Frontend (Web) last
- Ensure API contracts match between services
- Update documentation in each service

## COMPLETION CHECKLIST
- [ ] All PRD checklist items marked complete
- [ ] All tests written and passing
- [ ] No incomplete implementations
- [ ] Documentation updated
- [ ] Code follows conventions from CONVENTIONS.md
- [ ] PRD status updated to COMPLETED
- [ ] PRD moved to completed folder

## FINAL STEPS
1. Update PRD status to COMPLETED
2. Move PRD: \`move_file(\".prds/processing/$PRD_ID.md\", \".prds/completed/${PRD_ID}_COMPLETED.md\")\`
3. Add all changes to git in each affected repository
4. Print \"IMPLEMENTATION COMPLETE - PRD ID: $PRD_ID - ALL ITEMS FINISHED\"
5. Generate detailed PR description for each affected repository

## IMPORTANT REMINDERS
- Work from the SellerSmart-Architecture directory
- Navigate to service directories as needed
- Follow the patterns and examples in the PRD
- Complete ALL items - no partial implementations"

# Run Claude with the prompt
echo -e "${YELLOW}Launching Claude to execute PRD...${NC}"
claude --dangerously-skip-permissions "$PROMPT"

echo -e "${GREEN}PRD execution process completed!${NC}"
