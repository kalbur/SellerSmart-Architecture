#!/bin/bash

# SellerSmart PRD Creation Script
# This script should be run from the SellerSmart-Architecture directory

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the correct directory
if [[ ! -f "CLAUDE.md" ]]; then
    echo -e "${RED}Error: This script must be run from the SellerSmart-Architecture directory${NC}"
    echo "Please cd to /Users/kal/GitHub/SellerSmart-Architecture and try again"
    exit 1
fi

# Create timestamp for PRD ID
TIMESTAMP=$(date +"%Y%m%d_%H%M")

echo -e "${GREEN}Starting SellerSmart PRD Creation Process${NC}"
echo -e "${YELLOW}Current directory: $(pwd)${NC}"
echo -e "${YELLOW}Timestamp: ${TIMESTAMP}${NC}"
echo ""

# Check if claude CLI is installed
if ! command -v claude &> /dev/null; then
    echo -e "${RED}Error: claude CLI is not installed${NC}"
    echo "Please install it first: https://claude.ai/cli"
    exit 1
fi

# Run the PRD creation command
claude --dangerously-skip-permissions "# CLAUDE CODE PLANNING PHASE (NO CODING)

## CURRENT LOCATION
You are in: /Users/kal/GitHub/SellerSmart-Architecture

## REQUIREMENTS
- PLANNING ONLY - DO NOT WRITE CODE
- Read CLAUDE.md for project context (it's in the current directory)
- Create comprehensive PRD with unique ID format: PRD_${TIMESTAMP}_{feature_slug}
- Each feature gets its own dedicated PRD
- Save PRD in .prds/processing/ directory

## PROJECT STRUCTURE
All SellerSmart repositories are located at: /Users/kal/GitHub/
- SellerSmart-Architecture (current directory - documentation)
- SellerSmart-API (main API gateway)
- SellerSmart-Web (frontend)
- SellerSmart-Backend.BrandScan
- SellerSmart-Backend.InvOrders
- SellerSmart-Backend.RivalRadar
- SellerSmart-Backend.WholesaleScan
- SellerSmart-Backend.RapReview
- SellerSmart-SiteMonitor

## MCP TOOLS USAGE (MANDATORY WHEN APPLICABLE)
### 1. Context7 - API Documentation
- **Always use for**: External API integrations, library documentation
- **Commands**: \`local__context7__resolve-library-id\` then \`local__context7__get-library-docs\`
- **Example**: When integrating Stripe, Next.js features, or any external service

### 2. Repomix - Fast Codebase Analysis
- **Always use for**: Analyzing existing codebases efficiently
- **Commands**: \`local__repomix__pack_codebase\` (local) or \`local__repomix__pack_remote_repository\` (GitHub)
- **Benefits**: Faster than manual directory traversal, comprehensive structure analysis
- **Use**: Before exploring manually with list_directory, try Repomix first

### 3. MongoDB Atlas Tool - Database Schema
- **Always use for**: MongoDB schema analysis and collection inspection
- **Commands**: 
  - \`local__MongoDB__collection-schema\` - Analyze collection structure
  - \`local__MongoDB__list-collections\` - List all collections
  - \`local__MongoDB__list-databases\` - Show database structure
- **Example**: When planning features involving database operations

## WORKFLOW
1. Ask user to describe feature/bug in detail
2. Ask clarifying questions about requirements
3. **MCP TOOLS ASSESSMENT:**
   - Check if external APIs are involved → Use Context7
   - Check if MongoDB is used → Use MongoDB Atlas tools
   - Use Repomix to analyze codebase structure first
4. **COMPREHENSIVE CODEBASE ASSESSMENT:**
   - Use Repomix output to understand project structure quickly
   - Navigate to service directories: cd /Users/kal/GitHub/SellerSmart-{service}
   - Identify similar existing modules/components for consistency
   - Find relevant patterns, utilities, and conventions
   - Extract code examples from similar implementations
   - Document architectural patterns and dependencies
   - Note styling/naming conventions used in codebase
5. Create detailed PRD file in .prds/processing/ with:
   - Problem statement & user needs
   - **MCP Tools Used Section:**
     - List which MCP tools were consulted
     - Key findings from each tool
   - **Codebase Analysis Section:**
     - Similar existing implementations (with file paths)
     - Code examples to follow for consistency
     - Relevant utilities/helpers to reuse
     - Architectural patterns to maintain
   - Technical requirements with references to existing code
   - Implementation checklist (comprehensive, referencing similar modules)
   - Test strategy (following existing test patterns)
   - Success criteria

## CODEBASE EXPLORATION CHECKLIST
- [ ] Use Repomix to get initial codebase overview
- [ ] Check for MongoDB usage → Use MongoDB Atlas tools if present
- [ ] Check for external API usage → Use Context7 for documentation
- [ ] Read main project files (package.json, README, etc.) in each relevant service
- [ ] Explore src/ or main code directories
- [ ] Find components/modules similar to requested feature
- [ ] Identify shared utilities and patterns
- [ ] Review test structure and conventions
- [ ] Document styling/naming patterns
- [ ] Extract relevant code examples for reference

## BRANCHING
- Check current branch with \`execute_command(\"git branch --show-current\")\`
- If on main/master: recommend branch creation in PRD
- If on other branch: assume current branch is correct

## COMPLETION
- Print \"PRD CREATION COMPLETE\" 
- Print exact PRD ID created
- List MCP tools that were used in the analysis
- Add PRD to git with \`execute_command(\"git add .prds/processing/*.md\")\`"

echo -e "${GREEN}PRD creation process started!${NC}"
